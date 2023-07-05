module.exports = {
  isDevel: false,
  inMante: false,
  enabledLangs: ['es'],
  mainDomain: 'gbif.es', // used for cookies (lang, and index)
  mainLAUrl: 'https://colecciones-marinas.gbif.es',
  baseFooterUrl: 'https://colecciones-marinas.gbif.es/brand-2023',
  theme: 'sandstone',
  dataHub: 'dh7',
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
    cas: { url: 'https://auth.gbif.es', title: 'CAS' }
  },
  otherLinks: [
    { title: 'Datasets', url: 'https://colecciones.gbif.es/datasets' },
    { title: 'Explore your area', url: 'https://colecciones-marinas.gbif.es/registros/explore/your-area/' },
    { title: 'Datasets', url: 'https://colecciones.gbif.es/datasets' },
    { title: 'twitter', url: 'https://twitter.com/GbifEs', icon: 'twitter' }
  ]
}
