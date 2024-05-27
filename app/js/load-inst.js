import 'babel-polyfill';

var settings = require('./settings');

const collectory = settings.services.collectory.url;
const biocache = settings.services.biocache.url;
var dh = settings.dataHub;
var dhToFlag = settings.dataHubToFlag;

function compareStrings(a, b) {
  // Assuming you want case-insensitive comparison
  a = a.toLowerCase();
  b = b.toLowerCase();

  return a < b ? -1 : a > b ? 1 : 0;
}

let icol = {};
var loadInst = () => {

  let instToFlag;
  let colToFlag;
  let drToFlag;
  $.getJSON(`${collectory}/ws/dataHub/${dhToFlag}`, function (dataToFlag) {
    instToFlag = $.map(dataToFlag.memberInstitutions, function(institution) {
      return institution.uid;
    });

    colToFlag = $.map(dataToFlag.memberCollections, function(collection) {
      return collection.uid;
    });

    drToFlag = $.map(dataToFlag.memberDataResources, function(resource) {
      return resource.uid;
    });

  $.getJSON(`${collectory}/ws/dataHub/${dh}`, function (data) {
    var html = '';
    html += `<br><h3 data-i18n="index.stats.institutions"></h3><br>`;
    let inst = data['memberInstitutions'];
    let colMembers = data['memberCollections'];
    let drMembers = data['memberDataResources'];

    let instS = inst.sort(function (a, b) {
      return compareStrings(a.name, b.name);
    });
    let colMembersS = colMembers.sort(function (a, b) {
      return compareStrings(a.name, b.name);
    });
    let drMembersS = drMembers.sort(function (a, b) {
      return compareStrings(a.name, b.name);
    });

    $.ajaxSetup({
      async: false,
    });


    $.each(instS, function (key, value) {
      let iid = value['uid'];
      let flag = $.inArray(iid, instToFlag) !== -1;

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
          if (flag) {
            html += ' <a href="https://ahim.org" target="_blank"><img src="images/flag.png" title="Miembro de la AHIM" alt="Miembro de la AHIM" style="height: 24px"></a>';
          }
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
          // Filter only col in
          icol[iid] = data['collections'].filter(itemA => colMembersS.some(itemB => itemB.uid === itemA.uid));

          html += '</div>';
          html += '</div>';
          html += '</div>';
        });
    });


    $('#accordion-home-institutions').html(html);
    $.ajaxSetup({
      async: true,
    });
    console.log(icol);
    for (const inst in icol) {
      let cohtml = '';
      $.each(icol[inst], function (key, val) {
        cohtml += '<ul id="filtered-list" style="padding-left:15px">';
        cohtml += `<li style="list-style: disc !important"><a href="${biocache}/occurrences/search?q=collection_uid%3A${val.uid}#tab_mapView">${val.name}</a></li>`;
        cohtml += `<span id="col-content-${val.uid}"></span>`;
        let drhtml = '';
        $.getJSON(`${collectory}/ws/collection/${val.uid}`, function (data) {
          let drs = data['linkedRecordProviders'].filter(itemA => drMembersS.some(itemB => itemB.uid === itemA.uid));
          drhtml += '<ul id="filtered-list" style="padding-left:30px;">';
          $.each(drs, function (drkey, drval) {
            // console.log(val);
            drhtml += `<li style="list-style: circle;"><a href="${biocache}/occurrences/search?q=data_resource_uid%3A${drval.uid}#tab_mapView">${drval.name}</a></li>`;
          });
          drhtml += '</ul>';
          $(`#col-content-${val.uid}`).html(drhtml);
        });
        cohtml += '</ul>';
        $(`#inst-content-${inst}`).html(cohtml);
      });
    }
    $("body").localize();
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
