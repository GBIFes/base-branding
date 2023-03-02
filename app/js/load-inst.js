import 'babel-polyfill';

var settings = require('./settings');

const collectory = settings.services.collectory.url;
const biocache = settings.services.biocache.url;

function compareStrings(a, b) {
  // Assuming you want case-insensitive comparison
  a = a.toLowerCase();
  b = b.toLowerCase();

  return a < b ? -1 : a > b ? 1 : 0;
}

let icol = {};
var loadInst = () => {
  $.getJSON(`${collectory}/ws/dataHub/dh6`, function (data) {
    var html = '';
    html += `<br><h3 data-i18n="index.stats.institutions"></h3><br>`;
    let inst = data['memberInstitutions'];
    let instS = inst.sort(function (a, b) {
      return compareStrings(a.name, b.name);
    });
    $.ajaxSetup({
      async: false,
    });

    $.each(instS, function (key, value) {
      let iid = value['uid'];

      if (iid != 'in99')
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
          html += `<span id="inst-content-${iid}"></span>`;
          icol[iid] = data['collections'];
          html += '</div>';
          html += '</div>';
          html += '</div>';
        });
    });
    $('#accordion-home-institutions').html(html);
    $("body").localize();
    $.ajaxSetup({
      async: true,
    });
    console.log(icol);
    for (const inst in icol) {
      let cohtml = '';
      $.each(icol[inst], function (key, val) {
        cohtml += '<ul id="filtered-list" style="padding-left:15px">';
        cohtml += `<li style="list-style: disc !important"><a href="${biocache}/occurrences/search?q=collection_uid%3A${val.uid}">${val.name}</a></li>`;
        cohtml += `<span id="col-content-${val.uid}"></span>`;
        let drhtml = '';
        $.getJSON(`${collectory}/ws/collection/${val.uid}`, function (data) {

          drhtml += '<ul id="filtered-list" style="padding-left:30px;">';
          $.each(data['linkedRecordProviders'], function (drkey, drval) {
            // console.log(val);
            drhtml += `<li style="list-style: circle;"><a href="${biocache}/occurrences/search?q=data_resource_uid%3A${drval.uid}">${drval.name}</a></li>`;
          });
          drhtml += '</ul>';
          $(`#col-content-${val.uid}`).html(drhtml);
        });
        cohtml += '</ul>';
        $(`#inst-content-${inst}`).html(cohtml);
      });
    }
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
