"""Remove stray specks and the bottom padding from the character cut-outs,
so each figure sits flush on the bottom edge of its .char-stage frame.
    python3 _src/trim_characters.py      (needs Pillow, numpy, scipy)
Safe to run more than once."""
import os, glob
import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
FILES = glob.glob(os.path.join(ROOT, 'assets/img/cto-*.webp')) + [os.path.join(ROOT, 'assets/img/ill-support.webp')]

for f in sorted(FILES):
    im = Image.open(f).convert('RGBA')
    a = np.array(im)
    solid = a[..., 3] > 40
    lab, n = ndimage.label(ndimage.binary_dilation(solid, iterations=2))
    sizes = ndimage.sum(solid, lab, range(1, n + 1))
    keep = np.zeros_like(solid)
    for k, sz in enumerate(sizes, 1):
        if sz >= sizes.max() * 0.01:  # drop specks smaller than 1% of the figure
            keep |= lab == k
    a[..., 3] = np.where(keep, a[..., 3], 0)
    ys, xs = np.nonzero(a[..., 3] > 8)
    top, bottom = max(ys.min() - 8, 0), ys.max() + 1  # no padding under the figure
    left, right = max(xs.min() - 8, 0), min(xs.max() + 9, a.shape[1])
    Image.fromarray(a[top:bottom, left:right]).save(f, 'WEBP', quality=90, method=6)
    print(os.path.basename(f), im.size, '->', (right - left, bottom - top))
