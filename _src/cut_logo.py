"""Cut the AIM logo out of its source image.

The source has a checkerboard baked in, so the outline is found from the
logo itself: everything that is not a neutral checker square, cleaned up and
wrapped in its convex hull (the logo is a hexagon). The inner blue hexagon
is made transparent so the logo can sit on the navy tile; white strokes
inside it keep their anti-aliased edges by unmixing white from the blue.
    python3 _src/cut_logo.py      (needs Pillow, numpy, scipy)
"""
import os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage
from scipy.spatial import ConvexHull

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(HERE, '..')


def hull_mask(points, shape):
    hull = ConvexHull(points)
    poly = [tuple(points[v][::-1]) for v in hull.vertices]  # (x, y)
    m = Image.new('L', (shape[1], shape[0]), 0)
    ImageDraw.Draw(m).polygon(poly, fill=255)
    return np.array(m) > 0


def main():
    rgb = np.array(Image.open(os.path.join(HERE, 'logo-source.webp')).convert('RGB')).astype(int)
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    v = rgb.max(-1)
    neutral = (abs(r - g) < 6) & (abs(g - b) < 6)
    checker = neutral & (((v >= 185) & (v <= 212)) | (v >= 248))
    # the logo's shaded edges carry a slight blue tint; the checker and its
    # soft shadow are neutral, so the tint gives a tight outline
    body = ndimage.binary_opening(((b - r) >= 6) & ~checker, iterations=2)
    lab, _ = ndimage.label(body)
    sizes = ndimage.sum(body, lab, range(1, lab.max() + 1))
    logo = lab == (int(np.argmax(sizes)) + 1)
    outer = hull_mask(np.argwhere(logo), logo.shape)
    outer = ndimage.binary_erosion(outer, iterations=3)

    blue = (b - r) > 100
    inner = hull_mask(np.argwhere(blue), blue.shape)
    inner = ndimage.binary_dilation(inner, iterations=1)

    alpha = np.where(outer, 255.0, 0.0)
    # inside the inner hexagon: colour = t*white + (1-t)*blue, and blue has r≈0, so t = r/255
    t = np.clip(r / 255.0, 0, 1)
    alpha = np.where(inner, 255.0 * t, alpha)
    out = rgb.copy()
    out[inner] = 255

    a = Image.fromarray(alpha.astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.6))
    img = Image.fromarray(out.astype(np.uint8)).convert('RGBA')
    img.putalpha(a)
    img = img.crop(img.getbbox())
    side = max(img.size) + 24
    sq = Image.new('RGBA', (side, side), (0, 0, 0, 0))
    sq.paste(img, ((side - img.width) // 2, (side - img.height) // 2))

    sq.resize((256, 256), Image.LANCZOS).save(os.path.join(ROOT, 'assets/img/aim-logo.webp'), 'WEBP', quality=92, method=6)
    for n in (32, 180):
        tile = Image.new('RGBA', (n, n), (17, 40, 107, 255))  # navy tile so the open centre reads at icon size
        tile.alpha_composite(sq.resize((n, n), Image.LANCZOS))
        tile.save(os.path.join(ROOT, f'assets/img/aim-logo-{n}.png'))
    fav = Image.new('RGBA', (192, 192), (17, 40, 107, 255)); fav.alpha_composite(sq.resize((192, 192), Image.LANCZOS))
    fav.convert('RGB').save(os.path.join(ROOT, 'favicon.png'), optimize=True)
    og = Image.new('RGBA', (1200, 630), (17, 40, 107, 255))
    og.alpha_composite(sq.resize((420, 420), Image.LANCZOS), (390, 105))
    og.convert('RGB').save(os.path.join(ROOT, 'assets/img/og-aim.png'), optimize=True)
    print('logo written', sq.size)


if __name__ == '__main__':
    main()
