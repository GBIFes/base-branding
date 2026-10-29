import i18n from 'i18next';
import settings from './settings';
import { Highcharts, biocache, biocacheService, dh, pieColors } from './hub-charts.js';

// Home page: taxonomic breakdown of the data hub records, drilling down from kingdom to species

const ranks = ['kingdom', 'phylum', 'class', 'order', 'family', 'genus', 'species'];
let currentRank = '';
let currentName = '';

document.addEventListener('DOMContentLoaded', function () {
  if (!document.getElementById('taxo-container')) return;
  $.getJSON(
    `${biocacheService}/breakdown.json?q=data_hub_uid:${dh}&fq=rank:(species%20OR%20subspecies)&rank=kingdom`,
    (callback) => {
      var data = [];

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
            events: {
              drilldown: function (e) {
                if (!e.seriesOptions) {
                  var chart = this;
                  chart.myButton.show();
                  if (e.point.rank === 6) {
                    window
                      .open(
                        `${biocache}/occurrences/search?fq=${ranks[e.point.rank]}%3A"${e.point.name}"`,
                        '_blank'
                      )
                      .focus();
                  } else {
                    // Show the loading label
                    chart.showLoading('Cargando ...');

                    $.getJSON(
                      `${biocacheService}/breakdown.json?q=data_hub_uid:${dh}&name=${e.point.name}&fq=rank:(species%20OR%20subspecies)&rank=${ranks[e.point.rank]}`,
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
              colors: pieColors(settings.chartColors.taxo),
            },
            series: {
              borderWidth: 0,
              dataLabels: {
                enabled: true,
                distance: 40,
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
          chart.myButton = chart.renderer
            .button(i18n.t('index.stats.records'), 50, 350)
            .attr({
              zIndex: 3,
            })
            .on('click', function () {
              window
                .open(`${biocache}/occurrences/search?fq=${currentRank}%3A"${currentName}"`, '_blank')
                .focus();
            })
            .add();
          chart.myButton.hide();
        }
      );
    }
  );
});
