import i18n from 'i18next';
import settings from './settings';
import { Highcharts, biocache, biocacheService, dh, pieColors } from './hub-charts.js';

// Home page: data hub records by institution; a click opens that institution's records

document.addEventListener('DOMContentLoaded', function () {
  if (!document.getElementById('inst-container')) return;
  $.getJSON(
    `${biocacheService}/occurrence/facets?q=data_hub_uid:${dh}&facets=institution_uid&pageSize=0`,
    (callback) => {
      var data = [];
      const fieldResult = (callback[0] && callback[0].fieldResult) || [];
      for (var x in fieldResult) {
        data.push({
          name: fieldResult[x].label,
          fq: fieldResult[x].fq,
          rank: 0,
          y: fieldResult[x].count,
          drilldown: true,
        });
      }
      // https://www.highcharts.com/demo/pie-drilldown
      Highcharts.chart('inst-container', {
        chart: {
          type: 'pie',
          events: {
            drilldown: function (e) {
              window.open(`${biocache}/occurrences/search?fq=${e.point.fq}`, '_blank').focus();
            },
          },
        },
        allowPointSelect: true,
        credits: false,
        title: {
          text: i18n.t('index.stats.institutions'),
          style: { fontSize: '22px', fontWeight: 500 },
        },
        xAxis: {
          type: 'category',
        },
        legend: {
          enabled: false,
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            colors: pieColors(settings.chartColors.inst),
            dataLabels: {
              minFontSize: 8,
            },
          },
          series: {
            borderWidth: 0,
            dataLabels: {
              enabled: true,
            },
          },
        },
        series: [
          {
            name: i18n.t('index.stats.records'),
            colorByPoint: true,
            data: data,
          },
        ],
        drilldown: {
          series: [],
        },
      });
    }
  );
});
