// The hub pages carry the GBIF.ES icon (head.html, in the home and in the module pages that
// include it), and it is a file of the build.
// Run after `npm run build`.
import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { dist, readDist, brandingBase } from './helpers.js';

const icons = html => [...html.matchAll(/<link rel="(?:icon|apple-touch-icon)" href="([^"]+)"/g)].map(m => m[1]);

test('the GBIF.ES favicon is a file of the build', () => {
  expect(fs.existsSync(path.join(dist, 'images/favicon-gbif.png'))).toBe(true);
});

test('the home links the favicon from this branding', () => {
  const hrefs = icons(readDist('index.html'));
  expect(hrefs.length).toBeGreaterThanOrEqual(2);
  for (const href of hrefs) expect(href).toBe(`${brandingBase()}/images/favicon-gbif.png`);
});

// The ALA apps fill ::headerFooterServer:: with the branding URL when they include head.html
test('head.html links it for the module pages', () => {
  const hrefs = icons(readDist('head.html'));
  expect(hrefs.length).toBeGreaterThanOrEqual(2);
  for (const href of hrefs) expect(href).toBe('::headerFooterServer::/images/favicon-gbif.png');
});
