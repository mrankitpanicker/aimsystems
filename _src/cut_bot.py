"""Cut the chatbot robot out of its source (checkerboard baked in).
Background = neutral light pixels connected to the image border; the robot's
own whites are enclosed by blue/dark outlines, so a border flood fill leaves
them alone.   python3 _src/cut_bot.py   (Pillow, numpy, scipy)"""
import os
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

HERE = os.path.dirname(os.path.abspath(__file__))
rgb = np.array(Image.open(os.path.join(HERE, 'bot-source.webp')).convert('RGB')).astype(int)
r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
neutral = (abs(r - g) < 10) & (abs(g - b) < 10) & (rgb.min(-1) > 190)
lab, _ = ndimage.label(neutral)
edge = np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))
bg = np.isin(lab, edge[edge > 0])
fg = ndimage.binary_opening(~bg, iterations=2)
lab2, n = ndimage.label(fg)
sizes = ndimage.sum(fg, lab2, range(1, n + 1))
fg = np.isin(lab2, [k + 1 for k, s in enumerate(sizes) if s > sizes.max() * 0.002])
fg = ndimage.binary_fill_holes(fg)
# watermark streaks are thin and near-white: drop light pixels that a wide opening removes
light = rgb.min(-1) > 200
thick = ndimage.binary_opening(fg, iterations=7)
fg = fg & ~(light & ~thick)
fg = ndimage.binary_opening(fg, iterations=1)
lab3, n3 = ndimage.label(fg)
s3 = ndimage.sum(fg, lab3, range(1, n3 + 1))
fg = ndimage.binary_fill_holes(lab3 == int(np.argmax(s3)) + 1)
alpha = Image.fromarray((fg * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.0))
img = Image.fromarray(rgb.astype(np.uint8)).convert('RGBA')
img.putalpha(alpha)
img = img.crop(img.getbbox())
img.thumbnail((512, 512), Image.LANCZOS)
img.save(os.path.join(HERE, '..', 'assets/img/aim-bot.webp'), 'WEBP', quality=90, method=6)
print('bot', img.size)
