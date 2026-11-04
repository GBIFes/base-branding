# Adds background stats to <dh>-candidates.json from the /large thumbnail: border mean colour, saturation
# and how much the subject fills the frame. Usage: python3 -I bg-score.py out/dh7-candidates.json
import io, json, sys, colorsys, urllib.request
from concurrent.futures import ThreadPoolExecutor
import numpy as np
from PIL import Image

path = sys.argv[1]
cands = json.load(open(path))

def score(c):
    try:
        data = urllib.request.urlopen(c['thumb'], timeout=30).read()
        im = np.asarray(Image.open(io.BytesIO(data)).convert('RGB').resize((160, 120))).astype(float)
    except Exception as e:
        return {'err': str(e)}
    border = np.concatenate([im[:8].reshape(-1, 3), im[-8:].reshape(-1, 3), im[:, :8].reshape(-1, 3), im[:, -8:].reshape(-1, 3)])
    r, g, b = border.mean(0) / 255
    h, s, v = colorsys.rgb_to_hsv(r, g, b)
    # Pixels far from the border colour = subject
    dist = np.linalg.norm(im - border.mean(0), axis=2)
    fill = float((dist > 60).mean())
    return {'bgHex': '#%02x%02x%02x' % (int(r * 255), int(g * 255), int(b * 255)), 'bgSat': round(s, 2), 'bgVal': round(v, 2),
            'bgUniform': round(float(border.std(0).mean()), 1), 'fill': round(fill, 2)}

with ThreadPoolExecutor(8) as ex:
    for c, sc in zip(cands, ex.map(score, cands)):
        c.update(sc)
json.dump(cands, open(path, 'w'), indent=2)
print(len(cands), 'scored')
