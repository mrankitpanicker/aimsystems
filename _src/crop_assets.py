"""Crop the AIM asset sheet into individual images.

Coordinates are in the 667x2000 reference sheet; they are scaled, so a
higher-resolution export of the same sheet re-crops cleanly:
    python3 _src/crop_assets.py path/to/sheet.webp
"""
import sys, os
from PIL import Image

SRC = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(__file__), 'asset-sheet.webp')
OUT = os.path.join(os.path.dirname(__file__), '..', 'assets', 'img')
REF_W, REF_H = 667, 2000

BOXES = {
  # main characters
  'char-presenting': (2, 104, 182, 308),
  'char-laptop':     (182, 104, 345, 308),
  'char-teaching':   (345, 104, 500, 308),
  'char-thumbsup':   (500, 104, 662, 308),
  # supporting
  'team-developer':  (10, 376, 182, 572),
  'team-voice':      (182, 376, 345, 572),
  'team-strategist': (345, 376, 500, 572),
  'team-analyst':    (500, 376, 662, 572),
  # scenes
  'scene-dashboard':  (2, 655, 245, 862),
  'scene-cloud':      (245, 655, 435, 862),
  'scene-automation': (435, 650, 662, 862),
  # service icons (large)
  'svc-voice':    (40, 945, 158, 1025),
  'svc-code':     (200, 945, 318, 1025),
  'svc-gear':     (356, 945, 474, 1025),
  'svc-cloud':    (514, 945, 632, 1025),
  # process
  'step-bulb':    (40, 1103, 158, 1176),
  'step-doc':     (200, 1103, 318, 1176),
  'step-code':    (356, 1103, 474, 1176),
  'step-rocket':  (514, 1103, 632, 1176),
  # feature icons (small)
  'f-mic':      (25, 1253, 83, 1305),
  'f-chat':     (105, 1253, 163, 1305),
  'f-db':       (186, 1253, 244, 1305),
  'f-cloud':    (266, 1253, 324, 1305),
  'f-share':    (346, 1253, 404, 1305),
  'f-bell':     (428, 1253, 486, 1305),
  'f-chart':    (508, 1253, 566, 1305),
  'f-shield':   (588, 1253, 646, 1305),
  # technology icons
  't-llm':      (25, 1370, 87, 1432),
  't-auto':     (105, 1370, 167, 1432),
  't-db':       (185, 1370, 247, 1432),
  't-cloud':    (264, 1370, 326, 1432),
  't-api':      (344, 1370, 406, 1432),
  't-voice':    (423, 1370, 485, 1432),
  't-infra':    (503, 1370, 565, 1432),
  't-monitor':  (583, 1370, 645, 1432),
  # product & UI icons
  'u-home':     (28, 1493, 88, 1548),
  'u-users':    (107, 1493, 167, 1548),
  'u-cal':      (187, 1493, 247, 1548),
  'u-phone':    (266, 1493, 326, 1548),
  'u-msg':      (346, 1493, 406, 1548),
  'u-chart':    (425, 1493, 485, 1548),
  'u-check':    (504, 1493, 564, 1548),
  'u-clock':    (583, 1493, 643, 1548),
  # decorative
  'd-robot':    (20, 1845, 135, 1985),
  'd-bubble':   (150, 1855, 228, 1930),
  'd-arrow':    (232, 1850, 305, 1935),
  'd-bars':     (312, 1855, 392, 1935),
  'd-folder':   (405, 1855, 482, 1935),
  'd-calendar': (500, 1850, 575, 1935),
  'd-plane':    (582, 1860, 645, 1935),
}

def main():
    im = Image.open(SRC).convert('RGB')
    sx, sy = im.width / REF_W, im.height / REF_H
    os.makedirs(OUT, exist_ok=True)
    for name, (l, t, r, b) in BOXES.items():
        c = im.crop((round(l*sx), round(t*sy), round(r*sx), round(b*sy)))
        # the reference sheet is small; upscale so crops survive 2x displays
        scale = max(1, round(480 / c.width)) if c.width < 300 else 1
        if scale > 1:
            c = c.resize((c.width*scale, c.height*scale), Image.LANCZOS)
        c.save(os.path.join(OUT, name + '.webp'), 'WEBP', quality=90)
    print(f'{len(BOXES)} crops -> {os.path.abspath(OUT)}')

if __name__ == '__main__':
    main()
