export default {
  isDevel: false,
  inMante: false, // set to true and deploy if you want to set a maintenance message in all the services
  enabledLangs: ['es'],
  mainDomain: 'gbif.es', // used for cookies (lang, and index)
  mainLAUrl: 'https://colecciones-botanicas.gbif.es',
  baseFooterUrl: 'https://colecciones-botanicas.gbif.es/brand-2023',
  // A Bootswatch theme built on 'clean' (see the README); LA_THEME=<name> overrides it at build time
  theme: (typeof process !== 'undefined' && process.env.LA_THEME) || 'yeti',
  // Cookie policy page for the cookie consent banner ({lang} is replaced); null: no banner
  cookiePolicyUrl: null,
  // Look of the header, footer and home in both builds (Bootstrap 3 and 5): herbarium green on
  // paper, a serif for the titles
  brand: {
    logo: 'images/gbif-es.svg',
    logoWide: true,
    colors: {
      primary: '#2f6b3a', // links, buttons and the big numbers
      primaryDark: '#1f3d26', // footer background
      accent: '#c99a2e', // search button
      headerBg: '#ffffff',
      surface: '#f4f1e8', // the band of numbers, card placeholders
      page: '#fbfaf6'
    },
    font: 'Figtree',
    headingFont: 'Fraunces',
    radius: 4
  },
  home: {
    hero: {
      interval: 7000,
      // Sheets of the data hub in the image service, cut for every screen (scripts/hero/README.md)
      slides: [
        {
          image: 'images/hero/dh8-1-{w}.webp', widths: [1280, 1920, 2560, 3072], ratio: 2.4, narrow: { image: 'images/hero/dh8-1-n-{w}.webp', widths: [600, 900, 1260], ratio: 0.75 },
          species: 'Dryopteris dilatata', institution: 'Herbario de la Facultad de Ciencias Biológicas de la Universidad Complutense de Madrid (MACB)', license: 'CC BY-NC 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-nc/4.0/', recordUrl: 'https://colecciones-botanicas.gbif.es/registros/occurrences/4d45652f-9eda-459a-a8af-c56695a702c3'
        },
        {
          image: 'images/hero/dh8-12-{w}.webp', widths: [1280, 1920, 2560, 3072], ratio: 2.4, narrow: { image: 'images/hero/dh8-12-n-{w}.webp', widths: [600, 900, 1260], ratio: 0.75 },
          species: 'Margyricarpus pinnatus', institution: 'Institut Botànic de Barcelona (IBB, CSIC-Ajuntament de Barcelona)', author: 'Noemí Montes', license: 'CC BY-NC 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-nc/4.0/', recordUrl: 'https://colecciones-botanicas.gbif.es/registros/occurrences/6e475dd8-2418-44e4-89cf-9a9c47a1e7ad'
        },
        {
          image: 'images/hero/dh8-3-{w}.webp', widths: [1280, 1920, 2560, 3072], ratio: 2.4, narrow: { image: 'images/hero/dh8-3-n-{w}.webp', widths: [600, 900, 1260], ratio: 0.75 },
          species: 'Dryopteris tyrrhena', institution: 'Herbario de la Facultad de Ciencias Biológicas de la Universidad Complutense de Madrid (MACB)', license: 'CC BY-NC 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-nc/4.0/', recordUrl: 'https://colecciones-botanicas.gbif.es/registros/occurrences/ee0b0a91-59eb-40dc-b4ef-401c416da86b'
        },
        {
          image: 'images/hero/dh8-10-{w}.webp', widths: [1280, 1920, 2560, 3072], ratio: 2.4, narrow: { image: 'images/hero/dh8-10-n-{w}.webp', widths: [600, 900, 1241], ratio: 0.75 },
          species: 'Pouteria lucuma', institution: 'Institut Botànic de Barcelona (IBB, CSIC-Ajuntament de Barcelona)', author: 'Noemí Montes', license: 'CC BY-NC 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-nc/4.0/', recordUrl: 'https://colecciones-botanicas.gbif.es/registros/occurrences/66f08e23-ddcf-4d48-8cc1-66b893147e33'
        },
        {
          image: 'images/hero/dh8-5-{w}.webp', widths: [1280, 1920, 2560, 3072], ratio: 2.4, narrow: { image: 'images/hero/dh8-5-n-{w}.webp', widths: [600, 900, 1260], ratio: 0.75 },
          species: 'Dryopteris oreades', institution: 'Herbario de la Facultad de Ciencias Biológicas de la Universidad Complutense de Madrid (MACB)', license: 'CC BY-NC 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-nc/4.0/', recordUrl: 'https://colecciones-botanicas.gbif.es/registros/occurrences/fd1bc382-da2f-4b8b-8391-5069d1b1373a'
        },
        {
          image: 'images/hero/dh8-8-{w}.webp', widths: [1280, 1920, 2560, 3059], ratio: 2.4, narrow: { image: 'images/hero/dh8-8-n-{w}.webp', widths: [600, 900], ratio: 0.75 },
          species: 'Gonzalagunia congesta', institution: 'Institut Botànic de Barcelona (IBB, CSIC-Ajuntament de Barcelona)', author: 'Noemí Montes', license: 'CC BY-NC 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-nc/4.0/', recordUrl: 'https://colecciones-botanicas.gbif.es/registros/occurrences/ad1d8a9e-a1da-41ee-aa10-fa73120eb2d2'
        },
        {
          image: 'images/hero/dh8-7-{w}.webp', widths: [1280, 1920, 2560, 3072], ratio: 2.4, narrow: { image: 'images/hero/dh8-7-n-{w}.webp', widths: [600, 900, 1260], ratio: 0.75 },
          species: 'Dryopteris affinis var. affinis', institution: 'Herbario de la Facultad de Ciencias Biológicas de la Universidad Complutense de Madrid (MACB)', license: 'CC BY-NC 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-nc/4.0/', recordUrl: 'https://colecciones-botanicas.gbif.es/registros/occurrences/6e3822dd-669d-4f18-9be4-5f1d83f21831'
        },
        {
          image: 'images/hero/dh8-11-{w}.webp', widths: [1280, 1920, 2560, 3072], ratio: 2.4, narrow: { image: 'images/hero/dh8-11-n-{w}.webp', widths: [600, 900, 1260], ratio: 0.75 },
          species: 'Solanum triplinervium', institution: 'Institut Botànic de Barcelona (IBB, CSIC-Ajuntament de Barcelona)', license: 'CC BY-NC 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-nc/4.0/', recordUrl: 'https://colecciones-botanicas.gbif.es/registros/occurrences/57145f36-b758-46e7-81cb-e1e158ac8546'
        }
      ],
      search: { url: '{biocache}/occurrences/search', param: 'q' },
      buttons: [
        { i18n: 'index.hero.records', url: '{biocache}/occurrences/search', style: 'primary' },
        { i18n: 'index.hero.collections', url: '#la-home-charts', style: 'ghost' }
      ]
    },
    cards: [
      { i18n: 'index.cards.area', image: 'images/hero/dh8-7-n-600.webp', url: '{biocache}/explore/your-area/' },
      { i18n: 'index.cards.species', image: 'images/hero/dh8-12-n-600.webp', url: '{bie}' },
      { i18n: 'index.cards.regions', image: 'images/hero/dh8-10-n-600.webp', url: '{regions}' }
    ],
    partners: [
      { name: 'AHIM', logo: 'images/partners/ahim.png', url: 'https://ahim.org/' },
      { name: 'CSIC', logo: 'images/partners/csic.svg', url: 'https://www.csic.es/' },
      { name: 'Ministerio de Ciencia, Innovación y Universidades', logo: 'images/partners/mciu.png', url: 'https://www.ciencia.gob.es/' }
    ]
  },
  homeWidgets: { stats: true, taxoChart: true, instChart: true, institutions: true },
  // Data hub whose records, institutions and taxa the home page shows
  dataHub: 'dh8',
  // Institutions of this other data hub (the AHIM members) get the badge in the institutions widget
  dataHubToFlag: 'dh9',
  flagBadge: { image: 'images/flag.png', title: 'Miembro de la AHIM', url: 'https://ahim.org/' },
  institutionsExclude: [],
  institutionsShow: 12,
  footer: {
    links: [
      { i18n: 'footer.links.gbifes', url: 'https://gbif.es/' },
      { i18n: 'footer.links.ahim', url: 'https://ahim.org/' },
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
