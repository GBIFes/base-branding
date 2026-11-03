import Highcharts from 'highcharts';
import drilldown from 'highcharts/modules/drilldown';
import i18n from 'i18next';
import settings from './settings';

// Shared bits of the data hub home charts (taxo-graph.js, inst-graph.js)

drilldown(Highcharts);

Highcharts.setOptions({
  // Highcharts 11 sizes every label in em of the chart's own font-size, which defaults to
  // 1rem; the Bootstrap 3 skin sets html{font-size:10px}, so the data labels came out at
  // 7px. Pin the chart to the body size, where 0.7em lands back around the 11px of 9.x.
  chart: {
    style: { fontSize: '16px' },
  },
  lang: {
    loading: 'Cargando...',
    thousandsSep: '.',
    decimalPoint: ',',
  },
  // The drill-up button lang.drillUpText used to label is gone since 9.3.2: what walks
  // back up a drilldown now is the breadcrumbs component. showFullPath keeps it to the
  // single button the old one was, and {level.name} is the level being returned to.
  drilldown: {
    breadcrumbs: {
      showFullPath: false,
      format: '◁ Volver a {level.name}',
    },
  },
});

export const biocache = settings.services.biocache.url;
export const biocacheService = settings.isDevel
  ? 'https://biocache-ws.ala.org.au/ws/'
  : settings.services.biocacheService.url;
export const dh = settings.dataHub;

// Monochrome colors from one Highcharts palette entry
export const pieColors = (colorIndex) => {
  const colors = [];
  const base = Highcharts.getOptions().colors[colorIndex];
  for (let i = 0; i < 10; i += 1) {
    // Darkened base colour to a lighter one, and no further: the old range ended at
    // brighten(6/7), which is white, so a level whose slice landed on the last entries
    // was drawn white on a white page and looked like a missing slice (the records with
    // no class under Chordata, 32.696 of them, were the whole pie and invisible).
    colors.push(Highcharts.color(base).brighten(-0.4 + (i * 0.8) / 9).get());
  }
  return colors;
};

export { Highcharts };

// The chart titles come from i18next, which fetches its namespace over the network. Drawing
// on DOMContentLoaded alone let the chart win that race and leave the raw key
// ('index.stats.taxonomies') as the title, which is what the home showed about half the time.
export const whenReady = (fn) => {
  const onI18n = () => (i18n.isInitialized ? fn() : i18n.on('initialized', fn));
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onI18n);
  } else {
    onI18n();
  }
};
