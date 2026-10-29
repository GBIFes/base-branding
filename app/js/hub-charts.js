import Highcharts from 'highcharts';
import drilldown from 'highcharts/modules/drilldown';
import settings from './settings';

// Shared bits of the data hub home charts (taxo-graph.js, inst-graph.js)

drilldown(Highcharts);

Highcharts.setOptions({
  lang: {
    loading: 'Cargando...',
    drillUpText: '◁ Volver a {series.name}',
    thousandsSep: '.',
    decimalPoint: ',',
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
    // Start out with a darkened base color (negative brighten), and end
    // up with a much brighter color
    colors.push(Highcharts.color(base).brighten((i - 3) / 7).get());
  }
  return colors;
};

export { Highcharts };
