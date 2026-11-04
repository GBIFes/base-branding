# Contact sheet from a candidates JSON. Usage:
#   python3 -I sheet.py <in.json> <out.html> <title> [--neutral] [--ids=a,b,c] [--compact]
import html, json, sys

args = sys.argv[1:]
src, out, title = args[:3]
flags = {a.split('=')[0]: (a.split('=', 1)[1] if '=' in a else True) for a in args[3:]}
cands = json.load(open(src))
if flags.get('--ids'):
    order = flags['--ids'].split(',')
    by = {c['occurrenceId']: c for c in cands}
    cands = [by[i] for i in order if i in by]
elif flags.get('--neutral'):
    cands = [c for c in cands if c.get('bgSat', 1) < 0.3 and 0.06 < c.get('fill', 0) < 0.75]

e = lambda s: html.escape(str(s or ''))
compact = flags.get('--compact')
cards = []
for i, c in enumerate(cands, 1):
    credit = c.get('creator') or c.get('rightsHolder') or ''
    cap = f"<b>#{i}</b>" if compact else (
        f"<b>#{i}</b> <i>{e(c.get('scientificName'))}</i><br>{e(c.get('institution'))}<br>"
        f"{c['width']}×{c['height']} · {e(c['license'])}{' · ' + e(credit) if credit else ''}<br>"
        f"<a href='{e(c['occurrenceUrl'])}' target='_blank'>registro</a> · <code>{e(c['occurrenceId'])}</code>")
    cards.append(f"<figure><a href='{e(c['original'])}' target='_blank'><img src='{e(c['thumb'])}' alt=''></a><figcaption>{cap}</figcaption></figure>")

size = (110, 82) if compact else (300, 225)
open(out, 'w').write(f"""<!doctype html><meta charset="utf-8"><title>{e(title)}</title>
<style>
body{{font:13px/1.4 system-ui,sans-serif;margin:16px;background:#f4f4f2;color:#222}}
.grid{{display:grid;grid-template-columns:repeat(auto-fill,minmax({size[0]}px,1fr));gap:{4 if compact else 12}px}}
figure{{margin:0;background:#fff;border-radius:6px;overflow:hidden;box-shadow:0 1px 3px #0002}}
img{{width:100%;height:{size[1]}px;object-fit:cover;display:block;background:#ddd}}
figcaption{{padding:{'1px 4px' if compact else '8px'};font-size:{10 if compact else 13}px}} code{{font-size:11px;word-break:break-all}}
</style><h1>{e(title)}</h1><p>{len(cands)} imágenes. Pulsa una miniatura para ver el original.</p>
<div class="grid">{''.join(cards)}</div>""")
print(len(cands), 'in', out)
