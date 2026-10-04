"""Cut the "Global Remote Work Timezone Icon Set" (3 rows, real alpha) into the
/international hours images: globe, flags and clocks for UK, US and EU.
    py _src/cut_hours.py "path/to/Global Remote Work Timezone Icon Set1.png"
Writes assets/img/region-{uk,us,eu}-hours.webp
"""
import os, sys
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, '..', 'assets', 'img')
ROWS = [('uk', 30, 276), ('us', 276, 508), ('eu', 508, 724)]


def main(src):
    im = Image.open(src).convert('RGBA')
    for region, y0, y1 in ROWS:
        tile = im.crop((0, y0, im.width, y1))
        tile = tile.crop(tile.getbbox())
        path = os.path.join(OUT, f'region-{region}-hours.webp')
        tile.save(path, 'WEBP', quality=90, method=6)
        print(region, tile.size, os.path.getsize(path) // 1024, 'KB')


if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, 'hours-source.png'))
