const Highcharts = require('highcharts');
const drilldown = require('highcharts/modules/drilldown');
const settings = require('./settings');
const i18n = require('i18next');

const biocache = settings.services.biocache.url;
const biocacheService = settings.isDevel
                      ? 'https://biocache-ws.ala.org.au/ws/'
                      : settings.services.biocacheService.url;

drilldown(Highcharts);

// Make monochrome colors
var pieColors = (function () {
  var colors = [],
      base = Highcharts.getOptions().colors[2], // '#36de97',
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

document.addEventListener('DOMContentLoaded', function () {
  $.getJSON(
    `${biocacheService}/occurrence/facets?q=data_hub_uid:dh6&facets=institution_name&pageSize=0`,
    (callback) => {
      var data = [];
      // var drilldowns = {};
      for (var x in callback[0].fieldResult) {
        data.push({
          name: callback[0].fieldResult[x].label,
          rank: 0,
          y: callback[0].fieldResult[x].count,
          drilldown: true,
        });
      }
      // https://www.highcharts.com/demo/pie-drilldown
      Highcharts.chart(
        'inst-container',
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
                  window
                    .open(
                      `${biocache}/occurrences/search?fq=institution_name%3A"${e.point.name}"`,
                      '_blank'
                    )
                    .focus();
                }
            }
          },
          point: {
            events: {
              click: function () {
                window.open( `${biocache}/occurrences/search?fq=institution_name%3A"${e.point.name}"`);
              }
            }
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
              colors: pieColors,
              dataLabels: {
                minFontSize: 8
              }
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
        },
        function (chart) {
          // on complete
          var i = 0;

          chart.myButton = chart.renderer
                                .button('Registros', 50, 350)
                                .attr({
                                  zIndex: 3,
                                })
                                .on('click', function () {
                                  window
                                    .open(
                                      `${biocache}/occurrences/search?fq=institutionCode%3A"${currentName}"`,
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
