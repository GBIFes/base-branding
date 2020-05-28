var Cookies = require('js-cookie');
const settings = require('./settings');
const authCookieName = 'ALA-Auth';
const loginClass = 'signedIn';
const logoutClass = 'signedOut';

var loginStatusInIndex = () => {
  if ((document.location.origin === settings.mainLAUrl || document.location.host === 'localhost:3333') && document.location.pathname === '/' ) {
    if (settings.isDevel) console.log("We are in the main url, let's see if we are authenticated");
    // As this page is plain html, we have to detect if with are authenticated via Cookies
    // NOTE: For make this work you need ala.cookie.httpOnly to false in /data/cas/config/application.yml
    // We should use another way to see if it's authenticated

    let authCookie = Cookies.get(authCookieName, { domain: settings.mainDomain, path: '/' });
    var in30Minutes = 1/48;

    if (typeof authCookie === 'undefined' && document.location.host === 'localhost:3333') {
      console.log("We set a test cookie if we are in development");
      Cookies.set(authCookieName, '/', { expires: in30Minutes });
    }

    if (typeof authCookie !== 'undefined') {
      // https://github.com/AtlasOfLivingAustralia/ala-bootstrap3/blob/master/grails-app/taglib/au/org/ala/bootstrap3/HeaderFooterTagLib.groovy
      if (settings.isDevel) console.log("Auth cookie present so logged in");
      $("#dropdown-auth-menu").removeClass("::loginStatus::").addClass("signedIn");
    } else {
      if (settings.isDevel) console.log("No auth cookie not present so not-logged in");
      $("#dropdown-auth-menu").removeClass("::loginStatus::").addClass("signedOut");
    }
  }
  else {
    if (settings.isDevel) console.log("We aren't in the main url");
  }
};

$(function() {
  // wait til drawer elements are visible
  var checkExist = setInterval(function() {
    if (window.jQuery) {
      clearInterval(checkExist);
      loginStatusInIndex();
    } else {
      if (settings.isDevel) console.log("jquery not loaded");
    }
  }, 1000);
});
