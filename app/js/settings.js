export default {
  isDevel: false,
  inMante: false, // set to true and deploy if you want to set a maintenance message in all the services
  enabledLangs: ['es'],
  mainDomain: 'gbif.es', // used for cookies (lang, and index)
  mainLAUrl: 'https://colecciones-marinas.gbif.es',
  baseFooterUrl: 'https://colecciones-marinas.gbif.es/brand-2023',
  // A Bootswatch theme built on 'clean' (see the README); LA_THEME=<name> overrides it at build time
  theme: (typeof process !== 'undefined' && process.env.LA_THEME) || 'flatly',
  // Cookie policy page for the cookie consent banner ({lang} is replaced); null: no banner
  cookiePolicyUrl: null,
  // Look of the header, footer and home in both builds (Bootstrap 3 and 5): deep sea blue and
  // turquoise, a technical sans
  brand: {
    logo: 'images/gbif-es.svg',
    logoWide: true,
    footerLogo: 'images/gbif-es.svg', // on the footer background as it is, without the white box
    colors: {
      primary: '#0e5a7e', // links, buttons and the big numbers
      primaryDark: '#0a2a3d', // footer background
      accent: '#1bb5a6', // search button
      headerBg: '#ffffff',
      surface: '#eef5f7', // the band of numbers, card placeholders
      page: '#ffffff'
    },
    font: 'IBM Plex Sans',
    headingFont: 'Sora',
    radius: 8
  },
  home: {
    hero: {
      interval: 7000,
      // Specimens of the data hub in the image service, cut for every screen (scripts/hero/README.md)
      slides: [
        {
          image: 'images/hero/dh7-4-{w}.webp', widths: [1280, 1920, 2560, 3072], ratio: 2.4, narrow: { image: 'images/hero/dh7-4-n-{w}.webp', widths: [600, 900, 1154], ratio: 0.75 },
          species: 'Nephropsis stewarti', institution: 'Colección de Crustáceos Marinos (CRUST-IEOCD), IEO Cádiz (CSIC)', license: 'CC BY 4.0', licenseUrl: 'https://creativecommons.org/licenses/by/4.0/', recordUrl: 'https://colecciones-marinas.gbif.es/registros/occurrences/d74f9de5-5cf8-483b-a055-179952bc6d7e'
        },
        {
          image: 'images/hero/dh7-3-{w}.webp', widths: [1280, 1920, 2560, 3072], ratio: 2.4, narrow: { image: 'images/hero/dh7-3-n-{w}.webp', widths: [600, 900, 1168], ratio: 0.75 },
          species: 'Systellaspis pellucida', institution: 'Colección de Crustáceos Marinos (CRUST-IEOCD), IEO Cádiz (CSIC)', license: 'CC BY 4.0', licenseUrl: 'https://creativecommons.org/licenses/by/4.0/', recordUrl: 'https://colecciones-marinas.gbif.es/registros/occurrences/2db4f00c-cddd-4ba9-ab80-3a40f20f1a49'
        },
        {
          image: 'images/hero/dh7-5-{w}.webp', widths: [1280, 1920, 2560, 3072], ratio: 2.4, narrow: { image: 'images/hero/dh7-5-n-{w}.webp', widths: [600, 900, 1078], ratio: 0.75 },
          species: 'Lithodes mamillifer', institution: 'Colección de Crustáceos Marinos (CRUST-IEOCD), IEO Cádiz (CSIC)', license: 'CC BY 4.0', licenseUrl: 'https://creativecommons.org/licenses/by/4.0/', recordUrl: 'https://colecciones-marinas.gbif.es/registros/occurrences/e7936ed5-f273-4b8b-a793-18be01e9dc05'
        },
        {
          image: 'images/hero/dh7-10-{w}.webp', widths: [1280, 1920, 2136], ratio: 2.4, narrow: { image: 'images/hero/dh7-10-n-{w}.webp', widths: [600], ratio: 0.75 },
          species: 'Platymaia', institution: 'Colección de Crustáceos Marinos (CRUST-IEOCD), IEO Cádiz (CSIC)', license: 'CC BY 4.0', licenseUrl: 'https://creativecommons.org/licenses/by/4.0/', recordUrl: 'https://colecciones-marinas.gbif.es/registros/occurrences/4debfc0f-74eb-46fc-a97a-c26b55e02d67'
        }
      ],
      search: { url: '{biocache}/occurrences/search', param: 'q' },
      buttons: [
        { i18n: 'index.hero.records', url: '{biocache}/occurrences/search', style: 'primary' },
        { i18n: 'index.hero.collections', url: '#la-home-charts', style: 'ghost' }
      ]
    },
    cards: [
      { i18n: 'index.cards.area', image: 'images/hero/dh7-3-n-600.webp', url: '{biocache}/explore/your-area/' },
      { i18n: 'index.cards.species', image: 'images/hero/dh7-5-n-600.webp', url: '{bie}' },
      { i18n: 'index.cards.regions', image: 'images/hero/dh7-10-n-600.webp', url: '{regions}' }
    ],
    partners: [
      { name: 'CSIC', logo: 'images/partners/csic.svg', url: 'https://www.csic.es/' },
      { name: 'Ministerio de Ciencia, Innovación y Universidades', logo: 'images/partners/mciu.png', url: 'https://www.ciencia.gob.es/' }
    ]
  },
  homeWidgets: { stats: true, taxoChart: true, instChart: true, institutions: true },
  // Data hub whose records, institutions and taxa the home page shows
  dataHub: 'dh7',
  // Institutions of this other data hub get a badge in the institutions widget (null: none)
  dataHubToFlag: null,
  institutionsExclude: [],
  institutionsShow: 12,
  footer: {
    links: [
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
    biocache: { url: 'https://colecciones-marinas.gbif.es/registros', title: 'Occurrence records' },
    biocacheService: { url: 'https://registros-ws.gbif.es', title: 'Occurrence records webservice' },
    bie: { url: 'https://colecciones-marinas.gbif.es/especies', title: 'Species' },
    bieService: { url: 'https://especies-ws.gbif.es', title: 'Species webservice' },
    regions: { url: 'https://colecciones-marinas.gbif.es/regiones', title: 'Regions' },
    lists: { url: 'https://listas.gbif.es', title: 'Species List' },
    spatial: { url: 'https://espacial.gbif.es', title: 'Spatial Portal' },
    images: { url: 'https://imagenes.gbif.es', title: 'Images Service' },
    cas: { url: 'https://auth.gbif.es', title: 'CAS' },
  },
  otherLinks: [
    { title: 'Datasets', url: 'https://colecciones.gbif.es/datasets' },
    { title: 'Explore your area', url: 'https://colecciones-marinas.gbif.es/registros/explore/your-area/' },
    { title: 'Datasets', url: 'https://colecciones.gbif.es/datasets' },
    { title: 'twitter', url: 'https://twitter.com/GbifEs', icon: 'twitter' },
  ],
  analytics: {
    googleId: null
  }
};
