const Highcharts = require('highcharts');
const drilldown = require('highcharts/modules/drilldown');
const settings = require('./settings');
const i18n = require('i18next');

const biocache = settings.services.biocache.url;
const biocacheService = settings.isDevel
  ? 'https://biocache-ws.ala.org.au/ws/'
  : settings.services.biocacheService.url;

drilldown(Highcharts);

Highcharts.setOptions({
  lang: {
    loading: 'Cargando...',
    drillUpText: '◁ Volver a {series.name}',
    thousandsSep: ',',
    decimalPoint: '.',
  },
});

// Make monochrome colors
var pieColors = (function () {
  var colors = [],
    base = Highcharts.getOptions().colors[3], // '#36de97',
    i;

  for (i = 0; i < 10; i += 1) {
    // Start out with a darkened base color (negative brighten), and end
    // up with a much brighter color
    colors.push(
      Highcharts.color(base)
        .brighten((i - 3) / 7)
        .get()
    );
  }
  return colors;
})();

let ranks = [
  'kingdom',
  'phylum',
  'class',
  'order',
  'family',
  'genus',
  'species',
];
let currentRank = '';
let currentName = '';

document.addEventListener('DOMContentLoaded', function () {
  $.getJSON(
    `${biocacheService}/breakdown.json?q=data_hub_uid:dh6&fq=rank:(species%20OR%20subspecies)&rank=kingdom`,
    (callback) => {
      var data = [];
      // var drilldowns = {};

      for (var x in callback.taxa) {
        data.push({
          name: callback.taxa[x].label,
          rank: 0,
          y: callback.taxa[x].count,
          drilldown: true,
        });
      }
      // https://www.highcharts.com/demo/pie-drilldown
      Highcharts.chart(
        'taxo-container',
        {
          chart: {
            type: 'pie',
            /* options3d: {
            enabled: true,
            alpha: 45,
            beta: 0,
          }, */
            events: {
              drilldown: function (e) {
                if (!e.seriesOptions) {
                  var chart = this;
                  chart.myButton.show();
                  if (e.point.rank === 6) {
                    window
                      .open(
                        `${biocache}/occurrences/search?fq=${
                          ranks[e.point.rank]
                        }%3A"${e.point.name}"`,
                        '_blank'
                      )
                      .focus();
                  } else {
                    // Show the loading label
                    chart.showLoading('Cargando ...');

                    $.getJSON(
                      `${biocacheService}/breakdown.json?q=data_hub_uid:dh6&name=${
                        e.point.name
                      }&fq=rank:(species%20OR%20subspecies)&rank=${
                        ranks[e.point.rank]
                      }`,
                      (dCallback) => {
                        let series = {
                          name: e.point.name,
                          data: [],
                        };

                        currentName = e.point.name;
                        currentRank = ranks[e.point.rank];

                        for (var x in dCallback.taxa) {
                          series.data.push({
                            name: dCallback.taxa[x].label,
                            rank: e.point.rank + 1,
                            y: dCallback.taxa[x].count,
                            drilldown: true,
                          });
                        }
                        chart.hideLoading();
                        chart.addSeriesAsDrilldown(e.point, series);
                      }
                    );
                  }
                }
              },
            },
          },
          credits: false,
          title: {
            text: i18n.t('index.stats.taxonomies'),
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
              colors: pieColors,
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
              name: 'Kingdom',
              colorByPoint: true,
              data: data,
            },
          ],

          drilldown: {
            series: [],
          },
        },
        function (chart) {
          // on complete
          var i = 0;

          chart.myButton = chart.renderer
                                .button(i18n.t('index.stats.records'), 50, 350)
                                .attr({
              zIndex: 3,
            })
            .on('click', function () {
              window
                .open(
                  `${biocache}/occurrences/search?fq=${currentRank}%3A"${currentName}"`,
                  '_blank'
                )
                .focus();
            })
            .add();
          chart.myButton.hide();
        }
      );
    }
  );
});
