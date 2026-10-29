export default {
  isDevel: false,
  inMante: false, // set to true and deploy if you want to set a maintenance message in all the services
  enabledLangs: ['es'],
  mainDomain: 'gbif.es', // used for cookies (lang, and index)
  mainLAUrl: 'https://colecciones-botanicas.gbif.es',
  baseFooterUrl: 'https://colecciones-botanicas.gbif.es/brand-2023',
  theme: 'yeti',
  // Cookie policy page for the cookie consent banner ({lang} is replaced); null: no banner
  cookiePolicyUrl: null,
  // Data hub whose records, institutions and taxa the home page shows
  dataHub: 'dh8',
  // Optional: institutions of this other data hub get a flag in the home institution list
  dataHubToFlag: 'dh9',
  // Highcharts palette index used as the base colour of each home chart
  chartColors: { taxo: 2, inst: 2 },
  services: {
    collectory: { url: 'https://colecciones.gbif.es', title: 'Collections' },
    biocache: { url: 'https://colecciones-botanicas.gbif.es/registros', title: 'Occurrence records' },
    biocacheService: { url: 'https://registros-ws.gbif.es', title: 'Occurrence records webservice' },
    bie: { url: 'https://colecciones-botanicas.gbif.es/especies', title: 'Species' },
    bieService: { url: 'https://especies-ws.gbif.es', title: 'Species webservice' },
    regions: { url: 'https://colecciones-botanicas.gbif.es/regiones', title: 'Regions' },
    lists: { url: 'https://listas.gbif.es', title: 'Species List' },
    spatial: { url: 'https://espacial.gbif.es', title: 'Spatial Portal' },
    images: { url: 'https://imagenes.gbif.es', title: 'Images Service' },
    cas: { url: 'https://auth.gbif.es', title: 'CAS' },
  },
  otherLinks: [
    { title: 'Datasets', url: 'https://colecciones.gbif.es/datasets' },
    { title: 'Explore your area', url: 'https://colecciones-botanicas.gbif.es/registros/explore/your-area/' },
    { title: 'Datasets', url: 'https://colecciones.gbif.es/datasets' },
    { title: 'twitter', url: 'https://twitter.com/GbifEs', icon: 'twitter' },
  ],
  analytics: {
    googleId: null
  }
};
