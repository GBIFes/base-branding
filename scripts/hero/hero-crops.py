# Hero crops of the chosen images: picks the most detailed 2.4:1 band of each and writes webp renditions
# never wider than the crop itself, so nothing is upscaled.
#   python3 -I hero-crops.py out/seleccion-hero.json out/crops [drop,codes]   (see README.md)
import json, os, sys
import numpy as np
from PIL import Image, ImageFile, ImageFilter

ImageFile.LOAD_TRUNCATED_IMAGES = True  # some originals miss a few trailing bytes

Image.MAX_IMAGE_PIXELS = None
RATIO = 2.4            # hero band, width / height
WIDTHS = [2560, 1920, 1280, 768]
sel = json.load(open(sys.argv[1]))
out = sys.argv[2]
# Images that looked soft at hero size (checked by eye on 1:1 tiles): left out
drop = set((sys.argv[3] if len(sys.argv) > 3 else '').split(','))
os.makedirs(out, exist_ok=True)

def gray(im, w=400):
    g = im.convert('L')
    g = g.resize((w, max(1, round(g.height * w / g.width))), Image.BILINEAR)
    return np.asarray(g).astype(float)

def best_band(im):
    """Crop box of the band with most edges on dark (subject) pixels."""
    W, H = im.size
    g = gray(im)
    s = W / g.shape[1]
    gy, gx = np.gradient(g)
    energy = np.hypot(gx, gy) * (255 - g) / 255
    portrait = H > W
    # Herbarium sheets: colour charts and labels sit on the margins, keep them out
    cw = int(W * (0.72 if portrait else 1.0))
    ch = int(cw / RATIO)
    if ch > H:
        ch, cw = H, int(H * RATIO)
    margin = int(W * 0.10) if portrait else 0
    # Keep out what is not the specimen: the labels and barcodes of the lower part of a herbarium sheet,
    # and the black data bar under a microscope image
    bottom = H
    if portrait:
        bottom = int(H * 0.72)
    else:
        rows = np.median(np.asarray(im.convert('L').resize((256, 400))), axis=1)
        k = len(rows)
        while k > 0 and rows[k - 1] < 25:
            k -= 1
        if k < len(rows):
            bottom = int(H * k / len(rows) * 0.97)
    if ch > bottom:
        ch = bottom
        cw = int(ch * RATIO)
    best, box = -1, None
    for y in range(0, bottom - ch + 1, max(1, (bottom - ch) // 40 or 1)):
        for x in range(margin, max(margin, W - cw - margin) + 1, max(1, (W - cw - 2 * margin) // 10 or 1)):
            e = energy[int(y / s):int((y + ch) / s), int(x / s):int((x + cw) / s)].sum()
            if e > best:
                best, box = e, (x, y, x + cw, y + ch)
    return box

# Hand-picked bands (left, top, right as fractions; the height follows from RATIO) where the automatic one
# catches colour charts, rulers, labels, logos or microscope data bars
MANUAL = {
    'dh8-8': (0.08, 0.62, 0.52), 'dh8-10': (0.12, 0.20, 0.70), 'dh8-11': (0.02, 0.22, 0.72),
    'dh8-12': (0.17, 0.46, 0.85), 'dh7-3': (0.08, 0.20, 1.00), 'dh7-5': (0.00, 0.24, 1.00),
    'dh7-10': (0.16, 0.08, 0.92), 'dh6-12': (0.16, 0.08, 0.92), 'dh6-3': (0.00, 0.10, 1.00),
    'dh6-6': (0.00, 0.30, 1.00), 'dh6-9': (0.02, 0.30, 0.98),
    'dh8-1': (0.06, 0.50, 0.76), 'dh8-3': (0.06, 0.33, 0.76), 'dh8-5': (0.06, 0.23, 0.76), 'dh8-7': (0.06, 0.21, 0.76),
}

def manual_box(im, f):
    W, H = im.size
    x0, y0, x1 = int(f[0] * W), int(f[1] * H), int(f[2] * W)
    return (x0, y0, x1, y0 + int((x1 - x0) / RATIO))

report = []
for dh, items in sel.items():
    for x in items:
        if x['code'] in drop:
            continue
        im = Image.open(f"orig/{x['imageId']}.jpg").convert('RGB')
        box = manual_box(im, MANUAL[x['code']]) if x['code'] in MANUAL else best_band(im)
        crop = im.crop(box)
        widths = [w for w in WIDTHS if w <= crop.width] or [crop.width]
        files = []
        for w in widths:
            r = crop.resize((w, round(w / RATIO)), Image.LANCZOS)
            if w < crop.width:
                r = r.filter(ImageFilter.UnsharpMask(radius=0.8, percent=50, threshold=2))
            f = f"{x['code']}-{w}.webp"
            r.save(os.path.join(out, f), 'WEBP', quality=82, method=6)
            files.append({'w': w, 'file': f, 'kb': os.path.getsize(os.path.join(out, f)) // 1024})
        report.append(dict(x, box=box, cropW=crop.width, files=files))
        print(x['code'], 'crop', crop.width, '->', [(f['w'], f['kb']) for f in files])
json.dump(report, open(os.path.join(out, 'report.json'), 'w'), indent=2, ensure_ascii=False)
