var settings = require('./settings');

const collectory = settings.services.collectory.url;
const biocache = settings.services.biocache.url;

function compareStrings(a, b) {
  // Assuming you want case-insensitive comparison
  a = a.toLowerCase();
  b = b.toLowerCase();

  return a < b ? -1 : a > b ? 1 : 0;
}

var loadInst = () => {
  $.getJSON(`${collectory}/ws/dataHub/dh6`, function (data) {
    var html = '';
    html += `<br><h3 data-i18n="index.stats.institutions"></h3><br>`;
    let inst = data['memberInstitutions'];
    let instS = inst.sort(function (a, b) {
      return compareStrings(a.name, b.name);
    });
    console.log(instS);

    $.ajaxSetup({
      async: false,
    });

    $.each(instS, function (key, value) {
      let iid = value['uid'];

      // let data = await getInst(iid);
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
        html += `<h4 data-i18n="index.stats.collections"></h4>`;
        $.each(data['collections'], function (key, val) {
          // console.log(val);
          html += `<p><a href="${biocache}/occurrences/search?q=collection_uid%3A${val.uid}">${val.name}</a></p>`;
        });
        html += `<h4 data-i18n="index.stats.datasets"></h4>`;
        $.each(data['linkedRecordProviders'], function (key, val) {
          // console.log(val);
          html += `<p><a href="${biocache}/occurrences/search?q=data_resource_uid%3A${val.uid}">${val.name}</a></p>`;
        });
        html += '</div>';
        html += '</div>';
        html += '</div>';
      });
    });
    $('#accordion-home-institutions').html(html);
    $("body").localize();
  });
  $.ajaxSetup({
    async: true,
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
