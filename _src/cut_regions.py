"""Cut the "UK US EU Global Teamwork" sheet (3 rows x 3 columns, real alpha)
into the nine /international region images.

Rows: UK, US, EU. Columns: data, hours, rhythm. The hours column is cropped to
the globe alone: the sheet's clocks and time labels would show a fixed time,
while the page shows live clocks. Shapes whose centre lies in a neighbouring
row band (tall landmarks overlap the bands) are erased before trimming.
    py _src/cut_regions.py "path/to/UK US EU Global Teamwork.png"
Writes assets/img/region-{uk,us,eu}-{data,hours,rhythm}.webp
"""
import os, sys
import numpy as np
from PIL import Image
from scipy import ndimage

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, '..', 'assets', 'img')
ROWS = [('uk', 0, 260), ('us', 260, 493), ('eu', 493, 724)]
# The hours images come from their own sheet (cut_hours.py).
COLS = [('data', 27, 743), ('rhythm', 1458, 2143)]


def main(src):
    im = Image.open(src).convert('RGBA')
    full = np.asarray(im)
    for region, y0, y1 in ROWS:
        for card, x0, x1 in COLS:
            pad = 40  # look a little past the band so shapes crossing it are judged by their centre
            ty0, ty1 = max(0, y0 - pad), min(im.height, y1 + pad)
            tile = full[ty0:ty1, x0:x1].copy()
            solid = tile[:, :, 3] > 20
            lab, n = ndimage.label(solid)
            if n:
                centres = ndimage.center_of_mass(solid, lab, range(1, n + 1))
                for i, (cy, _) in enumerate(centres, start=1):
                    if not (y0 <= cy + ty0 < y1):
                        tile[lab == i, 3] = 0
            if card == 'hours':
                # The globe is cut straight at both sides; fade those edges out.
                ramp = np.ones(tile.shape[1], np.float32)
                edge = 46
                ramp[:edge] = np.linspace(0, 1, edge)
                ramp[-edge:] = np.linspace(1, 0, edge)
                tile[:, :, 3] = (tile[:, :, 3] * ramp[None, :]).astype(np.uint8)
            out = Image.fromarray(tile)
            box = out.getbbox()
            out = out.crop(box) if box else out
            out.thumbnail((720, 720), Image.LANCZOS)
            path = os.path.join(OUT, f'region-{region}-{card}.webp')
            out.save(path, 'WEBP', quality=88, method=6)
            print(f'{region}-{card}', out.size, os.path.getsize(path) // 1024, 'KB')


if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, 'regions-source.png'))
