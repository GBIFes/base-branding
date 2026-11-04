// Hero image candidates for a data hub: samples images of every institution of the hub, keeps the
// large and licensed ones and writes a contact sheet (HTML) plus the raw list (JSON).
//
//   node hero-candidates.mjs <dataHub> <outDir> [--min-width=1600] [--per-inst=150]
import fs from 'fs';
import path from 'path';

const BIOCACHE = 'https://registros-ws.gbif.es';
const IMAGES = 'https://imagenes.gbif.es';
const REGISTROS = { dh6: 'https://csic.gbif.es/registros', dh7: 'https://colecciones-marinas.gbif.es/registros', dh8: 'https://colecciones-botanicas.gbif.es/registros' };

const [dh, outDir, ...rest] = process.argv.slice(2);
const opt = Object.fromEntries(rest.map(a => a.replace(/^--/, '').split('=')));
const minWidth = Number(opt['min-width'] || 1600);
const perInst = Number(opt['per-inst'] || 150);
if (!dh || !outDir) { console.error('usage: hero-candidates.mjs <dataHub> <outDir>'); process.exit(1); }

const getJson = async (url) => {
  for (let i = 0; i < 3; i++) {
    try {
      const r = await fetch(url);
      if (r.ok) return await r.json();
    } catch { /* retry */ }
    await new Promise(res => setTimeout(res, 1000 * (i + 1)));
  }
  return null;
};

const pool = async (items, n, fn) => {
  const out = [];
  let i = 0;
  await Promise.all(Array.from({ length: n }, async () => {
    while (i < items.length) { const k = i++; out[k] = await fn(items[k]); }
  }));
  return out;
};

const base = `${BIOCACHE}/occurrences/search?fq=data_hub_uid:${dh}&fq=multimedia:Image`;
const facets = await getJson(`${base}&pageSize=0&facets=institution_uid&flimit=200`);
const insts = facets.facetResults[0]?.fieldResult || [];
console.error(`${dh}: ${facets.totalRecords} records with images in ${insts.length} institutions`);

// Sample: random pages of each institution, at most perInst records each
const occs = [];
for (const inst of insts) {
  const pages = Math.min(Math.ceil(perInst / 50), Math.ceil(inst.count / 50));
  const starts = new Set();
  while (starts.size < pages) starts.add(Math.floor(Math.random() * Math.max(1, inst.count - 50)));
  if (inst.count <= perInst) { starts.clear(); for (let s = 0; s < inst.count; s += 50) starts.add(s); }
  for (const start of starts) {
    const d = await getJson(`${base}&fq=${encodeURIComponent(inst.fq)}&pageSize=50&start=${start}&facet=off`);
    for (const o of d?.occurrences || []) occs.push(o);
  }
}

// One image per record, at most two records per species
const seen = new Set();
const perSpecies = {};
const sample = [];
for (const o of occs) {
  const img = o.image || (o.images || [])[0];
  if (!img || seen.has(img)) continue;
  const sp = o.scientificName || o.raw_scientificName || '?';
  if ((perSpecies[sp] = (perSpecies[sp] || 0) + 1) > 2) continue;
  seen.add(img);
  sample.push({ o, img });
}
console.error(`${sample.length} images sampled, reading their metadata...`);

const metas = await pool(sample, 8, ({ img }) => getJson(`${IMAGES}/ws/image/${img}`));
const candidates = [];
sample.forEach(({ o, img }, k) => {
  const m = metas[k];
  if (!m || !m.width) return;
  const license = m.recognisedLicence?.acronym || m.license || o.license;
  if (!license || m.width < minWidth) return;
  candidates.push({
    imageId: img,
    occurrenceId: o.uuid,
    width: m.width,
    height: m.height,
    orientation: m.width >= m.height ? 'landscape' : 'portrait',
    scientificName: o.scientificName || o.raw_scientificName,
    institution: o.institutionName,
    collection: o.collectionName,
    creator: m.creator || '',
    rightsHolder: m.rightsHolder || '',
    license,
    thumb: `${IMAGES}/image/${img}/large`,
    original: m.imageUrl,
    occurrenceUrl: `${REGISTROS[dh] || BIOCACHE}/occurrences/${o.uuid}`
  });
});
candidates.sort((a, b) => (b.orientation === 'landscape') - (a.orientation === 'landscape') || b.width - a.width);
console.error(`${candidates.length} candidates with width >= ${minWidth} and a licence`);

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, `${dh}-candidates.json`), JSON.stringify(candidates, null, 2));

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const card = (c, i) => `
  <figure>
    <a href="${esc(c.original)}" target="_blank"><img loading="lazy" src="${esc(c.thumb)}" alt=""></a>
    <figcaption>
      <b>#${i + 1}</b> <i>${esc(c.scientificName)}</i><br>
      ${esc(c.institution)}<br>
      ${c.width}×${c.height} · ${esc(c.license)}${c.creator ? ' · ' + esc(c.creator) : ''}<br>
      <a href="${esc(c.occurrenceUrl)}" target="_blank">registro</a> · <code>${esc(c.occurrenceId)}</code>
    </figcaption>
  </figure>`;
fs.writeFileSync(path.join(outDir, `${dh}-candidates.html`), `<!doctype html><meta charset="utf-8">
<title>Candidatas ${dh}</title>
<style>
  body{font:13px/1.4 system-ui,sans-serif;margin:16px;background:#f4f4f2;color:#222}
  .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:12px}
  figure{margin:0;background:#fff;border-radius:6px;overflow:hidden;box-shadow:0 1px 3px #0002}
  img{width:100%;height:220px;object-fit:cover;display:block;background:#ddd}
  figcaption{padding:8px} code{font-size:11px;word-break:break-all}
</style>
<h1>Candidatas para el hero de ${dh}</h1>
<p>${candidates.length} imágenes de al menos ${minWidth}px de ancho y con licencia, de ${sample.length} muestreadas
(${facets.totalRecords} registros con imagen en el hub). Primero las apaisadas, de mayor a menor.
La miniatura recorta: pulsa en ella para ver el original.</p>
<div class="grid">${candidates.map(card).join('')}</div>`);
