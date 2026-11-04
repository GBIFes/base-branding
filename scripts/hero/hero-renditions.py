# Hero renditions of the approved crops (out/crops/report.json): the wide 2.4:1 band at several
# widths, and a narrow 3:4 cut of the same band for phones, never wider than the source.
#   python3 -I hero-renditions.py out/crops/report.json <outDir>
import json, os, sys
import numpy as np
from PIL import Image, ImageFile, ImageFilter

ImageFile.LOAD_TRUNCATED_IMAGES = True
Image.MAX_IMAGE_PIXELS = None
WIDE = [1280, 1920, 2560, 3072]
NARROW = [600, 900, 1260]
NARROW_RATIO = 0.75
report = json.load(open(sys.argv[1]))
out = sys.argv[2]
os.makedirs(out, exist_ok=True)

def widths(avail, wanted):
    ws = [w for w in wanted if w <= avail]
    if avail < wanted[-1] and (not ws or avail - ws[-1] > 120):
        ws.append(avail)
    return ws

def save(img, ratio, ws, stem):
    files = []
    for w in ws:
        h = round(w / ratio)
        r = img.resize((w, h), Image.LANCZOS)
        if w < img.width:
            r = r.filter(ImageFilter.UnsharpMask(radius=0.8, percent=50, threshold=2))
        f = f'{stem}-{w}.webp'
        r.save(os.path.join(out, f), 'WEBP', quality=82, method=6)
        files.append({'file': f, 'w': w, 'h': h, 'kb': os.path.getsize(os.path.join(out, f)) // 1024})
    return files

def narrow_x(band):
    """Left edge of the 3:4 window of the band with most detail on dark (subject) pixels."""
    g = np.asarray(band.convert('L').resize((400, max(1, round(band.height * 400 / band.width))))).astype(float)
    gy, gx = np.gradient(g)
    col = (np.hypot(gx, gy) * (255 - g) / 255).sum(0)
    win = max(1, round(band.height * NARROW_RATIO * 400 / band.width))
    sums = np.convolve(col, np.ones(win), 'valid')
    return round(int(sums.argmax()) * band.width / 400)

# Left edge of the phone cut, as a fraction of the band, where the automatic one shows only a plain leaf
NARROW_AT = {'dh8-8': 1.0, 'dh8-10': 0.429}

res = []
for x in report:
    im = Image.open(f"orig/{x['imageId']}.jpg").convert('RGB')
    band = im.crop(tuple(x['box']))
    wide = save(band, 2.4, widths(band.width, WIDE), f"{x['code']}")
    nw = round(band.height * NARROW_RATIO)
    nx = narrow_x(band)
    if x['code'] in NARROW_AT:
        nx = min(band.width - nw, round(NARROW_AT[x['code']] * band.width))
    narrow_img = band.crop((nx, 0, nx + nw, band.height))
    narrow = save(narrow_img, NARROW_RATIO, widths(nw, NARROW), f"{x['code']}-n")
    res.append(dict(code=x['code'], wide=wide, narrow=narrow, narrowX=nx))
    print(x['code'], [f['w'] for f in wide], [f['w'] for f in narrow], sum(f['kb'] for f in wide + narrow), 'KB')
json.dump(res, open(os.path.join(out, 'renditions.json'), 'w'), indent=2)
