require('./settings.js').default;
require('./index-auth.js');
require('./i18next-config.js');
require('./mante.js');
require('./stats.js');
require('./load-inst.js');
require('./autocomplete-conf.js');
require('./taxo-graph.js');
require('./inst-graph.js');

document.addEventListener('DOMContentLoaded', () => {
  console.log('LA skin initialized');
});
