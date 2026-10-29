import './settings.js';
import './index-auth.js';
import './i18next-config.js';
import './mante.js';
import './stats.js';
import './load-inst.js';
import './taxo-graph.js';
import './inst-graph.js';
// import './autocomplete-conf.js'; // off in this hub, as in its brunch branch
import 'url-polyfill'; // for URL() usage in older browsers

// ALA's commonui application.js (bs3 and bs5) calls fathom.trackEvent() on BIE tab clicks without
// checking Fathom is loaded; LA portals don't load it, so give it a no-op unless a real one exists.
window.fathom = window.fathom || { trackEvent() {}, trackPageview() {}, trackGoal() {} };
