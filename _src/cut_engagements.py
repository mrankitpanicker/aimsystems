"""Cut the Build / Fix / Integrate / Operate sheet into four transparent webp illustrations.
Source: a 4-up PNG sheet. Usage: py cut_engagements.py "<sheet.png>"
Writes assets/img/eng-build.webp, eng-fix.webp, eng-integrate.webp, eng-operate.webp."""
import sys, os
from PIL import Image

src = sys.argv[1]
OUT = os.path.join(os.path.dirname(__file__), '..', 'assets', 'img')
im = Image.open(src).convert('RGBA')
w, h = im.size
px = im.load()

# a column is "empty" when it has no visible, non-white pixel
def solid(x, y):
    r, g, b, a = px[x, y]
    return a > 24 and not (r > 245 and g > 245 and b > 245)

filled = [sum(solid(x, y) for y in range(0, h, 3)) > 2 for x in range(w)]
runs, start = [], None
for x, f in enumerate(filled + [False]):
    if f and start is None: start = x
    if not f and start is not None:
        runs.append([start, x]); start = None
# artwork that touches its neighbour leaves fewer than four runs: split the widest run
# at its emptiest column near the middle
counts = [sum(solid(x, y) for y in range(0, h, 3)) for x in range(w)]
while len(runs) < 4:
    i = max(range(len(runs)), key=lambda k: runs[k][1] - runs[k][0])
    a, b = runs[i]
    lo, hi = a + (b - a) // 3, b - (b - a) // 3
    cut = int(sys.argv[2]) if len(sys.argv) > 2 else min(range(lo, hi), key=lambda x: counts[x])  # optional explicit cut column
    runs[i:i + 1] = [[a, cut], [cut, b]]
# merge runs separated by small gaps until four remain
while len(runs) > 4:
    gaps = [runs[i + 1][0] - runs[i][1] for i in range(len(runs) - 1)]
    i = gaps.index(min(gaps))
    runs[i] = [runs[i][0], runs[i + 1][1]]; del runs[i + 1]
print('columns:', runs, 'alpha min:', im.getextrema()[3])

names = ['build', 'fix', 'integrate', 'operate']
for name, (x0, x1) in zip(names, runs):
    tile = im.crop((x0, 0, x1, h))
    # knock out a white background if the sheet has one
    if im.getextrema()[3][0] == 255:
        data = [(r, g, b, 0) if r > 248 and g > 248 and b > 248 else (r, g, b, a) for r, g, b, a in tile.getdata()]
        tile.putdata(data)
    # drop slivers of the neighbouring artwork: keep only the largest connected shape
    # (found on a 1/4-scale mask; anything touching only the side edges is removed)
    s = 4
    m = tile.getchannel('A').resize((tile.width // s, tile.height // s)).point(lambda a: 1 if a > 24 else 0)
    mw, mh = m.size; mp = m.load(); label = [[0] * mh for _ in range(mw)]; sizes = {}; n = 0
    for sx in range(mw):
        for sy in range(mh):
            if mp[sx, sy] and not label[sx][sy]:
                n += 1; stack = [(sx, sy)]; label[sx][sy] = n; c = 0
                while stack:
                    x, y = stack.pop(); c += 1
                    for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
                        if 0 <= nx < mw and 0 <= ny < mh and mp[nx, ny] and not label[nx][ny]:
                            label[nx][ny] = n; stack.append((nx, ny))
                sizes[n] = c
    if sizes:
        main = max(sizes, key=sizes.get)
        edge = {label[x][y] for y in range(mh) for x in (0, 1, mw - 2, mw - 1) if label[x][y]}
        drop = {k for k in edge if k != main and sizes[k] < sizes[main] * 0.05}
        if drop:
            a = tile.getchannel('A'); ap = a.load()
            for x in range(tile.width):
                for y in range(tile.height):
                    lx, ly = min(x // s, mw - 1), min(y // s, mh - 1)
                    if label[lx][ly] in drop: ap[x, y] = 0
            tile.putalpha(a)
    bbox = tile.getchannel('A').point(lambda a: 255 if a > 24 else 0).getbbox()
    tile = tile.crop(bbox)
    side = int(max(tile.size) * 1.06)
    canvas = Image.new('RGBA', (side, side), (0, 0, 0, 0))
    canvas.paste(tile, ((side - tile.width) // 2, (side - tile.height) // 2), tile)
    canvas = canvas.resize((640, 640), Image.LANCZOS)
    path = os.path.join(OUT, f'eng-{name}.webp')
    canvas.save(path, 'WEBP', quality=86, method=6)
    print(name, (x0, x1), bbox, os.path.getsize(path), 'bytes')
