// The data hub home charts: taxo-graph.js and inst-graph.js draw a pie with Highcharts and
// walk into it with the drilldown module. Highcharts 11 still initialises a module with a
// factory call (`drilldown(Highcharts)` in hub-charts.js) and 12 dropped it, so a bump past
// 11 breaks the drilldown silently: the pie still renders and the click does nothing. These
// tests click, which is what catches it.
//
// Served through page.route over a hub home replica, with the biocache calls stubbed.
// Run after `npm run build`.
import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import settings from '../../app/js/settings.js';

const root = path.resolve(import.meta.dirname, '../..');
const dist = path.join(root, 'dist');
const HOST = 'https://hub.test';
// A hub branch cut from the template configures its own data hub; the template itself does
// not (no settings.dataHub, no settings.chartColors), and there the home charts never draw.
const CHARTS_CONFIGURED = Boolean(settings.dataHub && settings.chartColors);

// Highcharts <11.4.9 carries GHSA-5793-x2q3-c3q7 (javascript: URL in credits.href) and
// GHSA-rmqc-xvr3-v46c (dotted series.keys paths write to Object.prototype).
const MIN_HIGHCHARTS = [11, 4, 9];

const types = {
  '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.html': 'text/html',
  '.png': 'image/png', '.svg': 'image/svg+xml', '.woff': 'font/woff', '.woff2': 'font/woff2'
};
const contentType = file => types[path.extname(file)] || 'application/json';

const KINGDOMS = [
  { label: 'Plantae', count: 9000 },
  { label: 'Fungi', count: 1200 },
  { label: 'Chromista', count: 300 }
];
// Ten, so the drilled pie uses the whole colour ramp: its tail is where a slice used to
// come out white. The last one dwarfs the rest, as the real nameless buckets do.
const PHYLA = [
  { label: 'Tracheophyta', count: 800 }, { label: 'Bryophyta', count: 700 },
  { label: 'Rhodophyta', count: 600 }, { label: 'Marchantiophyta', count: 500 },
  { label: 'Chlorophyta', count: 400 }, { label: 'Charophyta', count: 300 },
  { label: 'Anthocerotophyta', count: 200 }, { label: 'Glaucophyta', count: 100 },
  { label: 'Prasinodermophyta', count: 50 }, { label: '', count: 9000 }
];
const INSTITUTIONS = [
  { label: 'Herbario A', fq: 'institution_uid:in1', count: 5000 },
  { label: 'Herbario B', fq: 'institution_uid:in2', count: 2500 }
];

function readDist(file) {
  const p = path.join(dist, file);
  if (!fs.existsSync(p)) throw new Error(`${p} not found: run npm run build before the e2e tests`);
  return fs.readFileSync(p, 'utf8');
}

function brandingBase(banner) {
  const m = banner.match(/src="(https?:\/\/[^"]+?)\/js\/init\.js/);
  if (!m) throw new Error('dist/banner.html does not load js/init.js');
  return m[1];
}

// $.getJSON reads these cross-origin, so they need the CORS header to reach the page at all.
const json = body => ({
  contentType: 'application/json',
  headers: { 'access-control-allow-origin': '*' },
  body: JSON.stringify(body)
});

async function openHubHome(page) {
  const banner = readDist('banner.html');
  const base = brandingBase(banner);
  const html = fs.readFileSync(path.join(import.meta.dirname, 'fixtures/hub-home.html'), 'utf8')
    .replace('<!--ALA_BANNER-->', banner)
    .replace('<!--ALA_FOOTER-->', readDist('footer.html'))
    .replaceAll('HEADER_FOOTER_URL', base);

  // window.open(...).focus() is what a drilled institution slice does; record it instead.
  await page.addInitScript(() => {
    window.__opened = [];
    window.open = url => { window.__opened.push(url); return { focus() {} }; };
  });

  await page.route('**/*', async route => {
    const url = new URL(route.request().url());
    const href = url.origin + url.pathname;
    if (href === `${HOST}/`) return route.fulfill({ contentType: 'text/html', body: html });

    // Matched on the path alone: a hub with isDevel reads the breakdown from the ALA
    // service instead of its own, and that base carries a /ws/ prefix.
    if (url.pathname.endsWith('/breakdown.json')) {
      // The drilled call carries name=<the clicked level>; the first one does not.
      const taxa = url.searchParams.get('name') ? PHYLA : KINGDOMS;
      return route.fulfill(json({ taxa }));
    }
    if (url.pathname.endsWith('/occurrence/facets')) {
      return route.fulfill(json([{ fieldResult: INSTITUTIONS }]));
    }
    if (href.startsWith(base + '/')) {
      const file = path.join(dist, decodeURIComponent(href.slice(base.length)));
      if (file.startsWith(dist) && fs.existsSync(file) && fs.statSync(file).isFile()) {
        return route.fulfill({ contentType: contentType(file), body: fs.readFileSync(file) });
      }
      return route.fulfill({ status: 404, body: '' });
    }
    return route.abort();
  });

  await page.goto(`${HOST}/`);
  await page.waitForLoadState('load');
  return { base };
}

const slices = (page, container) =>
  page.locator(`#${container} .highcharts-series path.highcharts-point`);

// The pie grows into place with an entry animation, and for the first frames a slice is a
// sliver that Playwright refuses to click as being outside the viewport. Highcharts tracks
// its own pointer events, so a synthetic dispatchEvent does not reach the drilldown either:
// wait for the slice to have real size and then click it like a visitor would.
const clickSlice = async (page, container) => {
  const slice = slices(page, container).first();
  await expect
    .poll(async () => {
      const box = await slice.boundingBox();
      return box ? Math.round(Math.min(box.width, box.height)) : 0;
    }, { message: 'the pie slice never grew past its entry animation' })
    .toBeGreaterThan(20);
  await slice.click();
};

test.describe('the data hub home charts', () => {
  test.skip(!CHARTS_CONFIGURED, 'this branch configures no data hub charts');

  test('the taxonomic pie renders the kingdoms it was given', async ({ page }) => {
    await openHubHome(page);

    await expect(page.locator('#taxo-container .highcharts-container')).toBeVisible();
    await expect(slices(page, 'taxo-container')).toHaveCount(KINGDOMS.length);
    await expect(page.locator('#taxo-container text.highcharts-title')).toContainText(/\S/);
  });

  // i18next fetches its namespace over the network, so a chart drawn on DOMContentLoaded
  // alone showed the raw key as its title whenever it won that race.
  test('both titles are translated, never the raw i18n key', async ({ page }) => {
    await openHubHome(page);

    for (const container of ['taxo-container', 'inst-container']) {
      const title = page.locator(`#${container} text.highcharts-title`);
      await expect(title).toContainText(/\S/);
      await expect(title).not.toContainText('index.stats');
    }
  });

  // Highcharts 11 sizes text in em of the chart's font-size, and the hub page's root size
  // is 10px: without an explicit chart font-size the data labels came out at 7px.
  test('the data labels are readable, not shrunk by the page root size', async ({ page }) => {
    await openHubHome(page);
    await expect(slices(page, 'taxo-container')).toHaveCount(KINGDOMS.length);

    const size = await page.locator('#taxo-container .highcharts-data-labels text').first()
      .evaluate(e => parseFloat(getComputedStyle(e).fontSize));
    expect(size, 'the data labels shrank with the page root size').toBeGreaterThanOrEqual(10);
  });

  test('clicking a kingdom drills into it, so the drilldown module is loaded', async ({ page }) => {
    await openHubHome(page);
    await expect(slices(page, 'taxo-container')).toHaveCount(KINGDOMS.length);

    const drilled = page.waitForRequest(r => r.url().includes('/breakdown.json') && r.url().includes('name='));
    await clickSlice(page, 'taxo-container');
    await drilled;

    // The second level replaced the first one: without the drilldown module the click is a no-op.
    await expect(slices(page, 'taxo-container')).toHaveCount(PHYLA.length);

    // None of them may be white: the page behind is, so such a slice reads as missing.
    // A guard, not a reproduction: with these stubbed counts the drilled series does not
    // walk the far end of the colour ramp, which is where marinas lost its biggest slice.
    // That one was checked on the deployed hub, by reading the slice's fill.
    const fills = await slices(page, 'taxo-container')
      .evaluateAll(ps => ps.map(p => p.getAttribute('fill')));
    const washedOut = fills.filter(fill => {
      const [r, g, b] = (fill.match(/\d+/g) || []).map(Number);
      return 0.2126 * r + 0.7152 * g + 0.0722 * b > 240; // as good as white behind it
    });
    expect(washedOut, 'a slice is too pale to tell from the page behind it').toEqual([]);
  });

  test('the institutions pie renders and a slice opens its records search', async ({ page }) => {
    await openHubHome(page);

    await expect(page.locator('#inst-container .highcharts-container')).toBeVisible();
    await expect(slices(page, 'inst-container')).toHaveCount(INSTITUTIONS.length);

    await clickSlice(page, 'inst-container');
    await expect.poll(() => page.evaluate(() => window.__opened)).toContain(
      `${settings.services.biocache.url}/occurrences/search?fq=${INSTITUTIONS[0].fq}`
    );
  });
});

test('highcharts is not a version with a known advisory', async ({ page }) => {
  const lock = JSON.parse(fs.readFileSync(path.join(root, 'package-lock.json'), 'utf8'));
  const entry = lock.packages['node_modules/highcharts'];
  expect(entry, 'highcharts is not in package-lock.json').toBeTruthy();

  const got = entry.version.split('.').map(Number);
  const ok = got[0] > MIN_HIGHCHARTS[0]
    || (got[0] === MIN_HIGHCHARTS[0] && (got[1] > MIN_HIGHCHARTS[1]
      || (got[1] === MIN_HIGHCHARTS[1] && got[2] >= MIN_HIGHCHARTS[2])));
  expect(ok, `highcharts ${entry.version} is below ${MIN_HIGHCHARTS.join('.')}`).toBe(true);
});
