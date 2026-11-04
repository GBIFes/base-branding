# Hero images of a data hub

One-off tools to choose the hero photos of a hub home from its own records in the image service,
and to cut them sharp for every screen. They are not part of the build: run them from an empty
working folder and copy the result to `app/assets/images/hero/`. Node 18+ and Python 3 with Pillow
and numpy.

1. `node hero-candidates.mjs dh8 out` samples the records with images of every institution of the
   data hub and keeps the licensed ones at least 1600 px wide: `out/dh8-candidates.{json,html}`.
2. `python3 -I bg-score.py out/dh8-candidates.json` adds the background colour and how much of the
   frame the specimen fills; `python3 -I sheet.py out/dh8-candidates.json out/sheet.html dh8 --neutral`
   is a contact sheet of the ones on a plain background.
3. Pick the ones you want into `out/seleccion-hero.json` (`{"dh8": [candidate + "code"], ...}`) and
   download each original to `orig/<imageId>.jpg`.
4. `python3 -I hero-crops.py out/seleccion-hero.json out/crops` cuts the 2.4:1 band of each one:
   the most detailed band, or the hand-picked box of `MANUAL` where that catches labels, colour
   charts, logos or microscope data bars. Check them by eye at 1:1.
5. `python3 -I hero-renditions.py out/crops/report.json out/rend` writes the webp renditions, never
   wider than the source: the band at 1280-3072 px and a 3:4 cut of it for phones at 600-1260 px.

Each slide of `settings.home.hero.slides` then names them with `{w}` (see the README, "Hero").
The credit is the image's creator or rights holder, else the institution, never the collector
(`recordedBy`).
