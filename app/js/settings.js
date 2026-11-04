export default {
  isDevel: false,
  inMante: false, // set to true and deploy if you want to set a maintenance message in all the services
  enabledLangs: ['en', 'es', 'ca'],
  mainDomain: 'gbif.es', // used for cookies (lang, and index)
  mainLAUrl: 'https://csic.gbif.es',
  baseFooterUrl: 'https://csic.gbif.es/csic-hub-demo',
  // 'clean' (the ALA commonui CSS), so the module pages take the CSIC red on their buttons too;
  // LA_THEME=<name> overrides it at build time
  theme: (typeof process !== 'undefined' && process.env.LA_THEME) || 'clean',
  // Cookie policy page for the cookie consent banner ({lang} is replaced); null: no banner
  cookiePolicyUrl: null,
  // Look of the header, footer and home in both builds (Bootstrap 3 and 5): the CSIC logo and its
  // red (#AE0E16, from the logo the ministry publishes), on white and charcoal
  brand: {
    logo: 'images/partners/csic.svg',
    logoWide: true,
    footerLogo: 'images/csic-white.svg', // on the footer background as it is, without the white box
    colors: {
      primary: '#ae0e16', // links, buttons and the big numbers
      primaryDark: '#2b2b2b', // footer background
      accent: '#ae0e16', // search button
      headerBg: '#ffffff',
      surface: '#f5f4f3', // the band of numbers, card placeholders
      page: '#ffffff'
    },
    font: 'Inter',
    headingFont: 'Manrope',
    radius: 4
  },
  home: {
    hero: {
      interval: 7000,
      // Specimens of the data hub in the image service, cut for every screen (scripts/hero/README.md)
      slides: [
        {
          image: 'images/hero/dh6-9-{w}.webp', widths: [1280, 1920, 2560, 3072], ratio: 2.4, narrow: { image: 'images/hero/dh6-9-n-{w}.webp', widths: [600, 900, 1069], ratio: 0.75 },
          species: 'Palinurus elephas', institution: 'Observadores del Mar, Institut de Ciències del Mar (CSIC)', author: 'Lenka Juskanicova', license: 'CC BY-NC 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-nc/4.0/', recordUrl: 'https://csic.gbif.es/registros/occurrences/02d059c8-ad74-42ad-aa40-4cd219d7ab79'
        },
        {
          image: 'images/hero/dh6-3-{w}.webp', widths: [1280, 1920, 2560, 3072], ratio: 2.4, narrow: { image: 'images/hero/dh6-3-n-{w}.webp', widths: [600, 900, 1260], ratio: 0.75 },
          species: 'Schizomavella linearis profunda', institution: 'Museo Nacional de Ciencias Naturales (CSIC)', author: 'Lais Vieira Ramalho', license: 'CC BY-NC 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-nc/4.0/', recordUrl: 'https://csic.gbif.es/registros/occurrences/9d770af1-921e-4b3b-9674-7dc7e9399a51'
        },
        {
          image: 'images/hero/dh6-12-{w}.webp', widths: [1280, 1920, 2136], ratio: 2.4, narrow: { image: 'images/hero/dh6-12-n-{w}.webp', widths: [600], ratio: 0.75 },
          species: 'Platymaia', institution: 'Colección de Crustáceos Marinos (CRUST-IEOCD), IEO Cádiz (CSIC)', license: 'CC BY 4.0', licenseUrl: 'https://creativecommons.org/licenses/by/4.0/', recordUrl: 'https://csic.gbif.es/registros/occurrences/4debfc0f-74eb-46fc-a97a-c26b55e02d67'
        },
        {
          image: 'images/hero/dh6-5-{w}.webp', widths: [1280, 1920, 2560, 3072], ratio: 2.4, narrow: { image: 'images/hero/dh6-5-n-{w}.webp', widths: [600, 900, 1120], ratio: 0.75 },
          species: 'Cryptosula pallasiana', institution: 'Museo Nacional de Ciencias Naturales (CSIC)', author: 'Ana Maria Bravo', license: 'CC BY-NC 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-nc/4.0/', recordUrl: 'https://csic.gbif.es/registros/occurrences/75841d5a-1ca0-4518-a79e-c5f2ec0e3e59'
        },
        {
          image: 'images/hero/dh6-4-{w}.webp', widths: [1280, 1920, 2560, 3072], ratio: 2.4, narrow: { image: 'images/hero/dh6-4-n-{w}.webp', widths: [600, 900, 1120], ratio: 0.75 },
          species: 'Frondipora', institution: 'Museo Nacional de Ciencias Naturales (CSIC)', author: 'Ana Maria Bravo', license: 'CC BY-NC 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-nc/4.0/', recordUrl: 'https://csic.gbif.es/registros/occurrences/8718894c-1523-4153-80aa-8d605a52549b'
        },
        {
          image: 'images/hero/dh6-6-{w}.webp', widths: [1280, 1920, 2048], ratio: 2.4, narrow: { image: 'images/hero/dh6-6-n-{w}.webp', widths: [600], ratio: 0.75 },
          species: 'Setosella vulnerata', institution: 'Museo Nacional de Ciencias Naturales (CSIC)', author: 'Javier Souto & Oscar Reverter', license: 'CC BY-NC 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-nc/4.0/', recordUrl: 'https://csic.gbif.es/registros/occurrences/b099bfeb-96c5-45a8-bcb8-54253e61d56c'
        }
      ],
      search: { url: '{biocache}/occurrences/search', param: 'q' },
      buttons: [
        { i18n: 'index.hero.records', url: '{biocache}/occurrences/search', style: 'primary' },
        { i18n: 'index.hero.collections', url: '#la-home-charts', style: 'ghost' }
      ]
    },
    cards: [
      { i18n: 'index.cards.area', image: 'images/hero/dh6-3-n-600.webp', url: '{biocache}/explore/your-area/' },
      { i18n: 'index.cards.species', image: 'images/hero/dh6-9-n-600.webp', url: '{bie}' },
      { i18n: 'index.cards.regions', image: 'images/hero/dh6-5-n-600.webp', url: '{regions}' }
    ],
    partners: [
      { name: 'Ministerio de Ciencia, Innovación y Universidades', logo: 'images/partners/mciu.png', url: 'https://www.ciencia.gob.es/' },
      { name: 'GBIF.ES', logo: 'images/partners/gbif-es.svg', url: 'https://gbif.es/' }
    ]
  },
  homeWidgets: { stats: true, taxoChart: true, instChart: true, institutions: true },
  // Data hub whose records, institutions and taxa the home page shows
  dataHub: 'dh6',
  // Institutions of this other data hub get a badge in the institutions widget (null: none)
  dataHubToFlag: null,
  institutionsExclude: [],
  institutionsShow: 12,
  // The two pies: CSIC red, and the grey of its logo darkened
  chartColors: { taxo: '#ae0e16', inst: '#6b6a6a' },
  footer: {
    links: [
      { i18n: 'footer.links.csic', url: 'https://www.csic.es/' },
      { i18n: 'footer.links.gbifes', url: 'https://gbif.es/' },
      { i18n: 'footer.links.contact', url: 'https://gbif.es/contacto/' },
      { i18n: 'footer.links.legal', url: 'https://gbif.es/aviso-legal/' },
      { i18n: 'footer.links.privacy', url: 'https://gbif.es/politica-de-privacidad/' }
    ],
    social: [
      { name: 'Bluesky', url: 'https://bsky.app/profile/gbif.es' },
      { name: 'LinkedIn', url: 'https://www.linkedin.com/company/gbif-spain/' },
      { name: 'YouTube', url: 'https://www.youtube.com/channel/UCv8tuNZLgEcGAJ1JUujVukg/videos' },
      { name: 'GitHub', url: 'https://github.com/GBIFes/' }
    ]
  },
  services: {
    collectory: { url: 'https://colecciones.gbif.es', title: 'Collections' },
    biocache: { url: 'https://csic.gbif.es/registros', title: 'Occurrence records' },
    biocacheService: { url: 'https://registros-ws.gbif.es', title: 'Occurrence records webservice' },
    bie: { url: 'https://csic.gbif.es/especies', title: 'Species' },
    bieService: { url: 'https://especies-ws.gbif.es', title: 'Species webservice' },
    regions: { url: 'https://csic.gbif.es/regiones', title: 'Regions' },
    lists: { url: 'https://listas.gbif.es', title: 'Species List' },
    spatial: { url: 'https://espacial.gbif.es', title: 'Spatial Portal' },
    images: { url: 'https://imagenes.gbif.es', title: 'Images Service' },
    cas: { url: 'https://auth.gbif.es', title: 'CAS' },
  },
  otherLinks: [
    { title: 'Datasets', url: 'https://colecciones.gbif.es/datasets' },
    { title: 'Explore your area', url: 'https://csic.gbif.es/registros/explore/your-area/' },
    { title: 'Datasets', url: 'https://colecciones.gbif.es/datasets' },
    { title: 'twitter', url: 'https://twitter.com/GbifEs', icon: 'twitter' },
  ],
  analytics: {
    googleId: null
  }
};
