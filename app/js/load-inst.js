var settings = require('./settings');

var collectory = settings.services.collectory.url;
var biocache = settings.services.biocache.url;

var loadInst = () => {
  $.getJSON(`${collectory}/ws/dataHub/dh6`, function (data) {
    var html = '';
    html += `<br><h3>Instituciones</h3><br>`;
    $.each(data['memberInstitutions'], function (key, value) {
      let iid = value['uid'];
      $.getJSON(`${collectory}/ws/institution/${iid}`, function (data) {
        html += '<div class="panel panel-default">';
        html += `<div class="panel-heading" role="tab" id="heading-${iid}">`;
        html += '  <h4 class="panel-title">';
        html += '    <a';
        html += '      role="button"';
        html += '      data-toggle="collapse"';
        html += '      data-parent="#accordion"';
        html += `      href="#collapse-${iid}"`;
        html += '      aria-expanded="true"';
        html += `      aria-controls="collapse-${iid}"`;
        html += '    >';
        html += `      ${value['name']}`;
        html += '    </a>';
        html += '  </h4>';
        html += '</div>';
        html += '<div';
        html += `  id="collapse-${iid}"`;
        html += '  class="panel-collapse collapse"';
        html += '  role="tabpanel"';
        html += `  aria-labelledby="heading-${iid}"`;
        html += '>';
        html += '  <div class="panel-body">';
        html += `<h4>Colecciones</h4>`;
        $.each(data['collections'], function (key, val) {
          // console.log(val);
          html += `<p><a href="${biocache}/occurrences/search?q=collection_uid%3A${val.uid}">${val.name}</a></p>`;
        });
        html += `<h4>Juegos de Datos</h4>`;
        $.each(data['linkedRecordProviders'], function (key, val) {
          // console.log(val);
          html += `<p><a href="${biocache}/occurrences/search?q=data_resource_uid%3A${val.uid}">${val.name}</a></p>`;
        });
        html += '</div>';
        html += '</div>';
        html += '</div>';
        $('#accordion-home-institutions').html(html);
      });
    });
  });
};

document.addEventListener('DOMContentLoaded', () => {
  if (
    (document.location.origin === settings.mainLAUrl ||
      document.location.host === 'localhost:3333') &&
    document.location.pathname === '/'
  ) {
    loadInst();
  }
});
