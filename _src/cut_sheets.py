"""Cut the transparent AIM sheets (characters, icons, illustrations) into
individual images in assets/img/{cto,ico,ill}-*.webp.

Each sheet is split on a grid. Inside a cell, any solid shape whose centre
lies in a neighbouring cell is erased, then the crop is trimmed to its alpha.
    python3 _src/cut_sheets.py      (needs Pillow, numpy, scipy)
"""
import os
import numpy as np
from PIL import Image
from scipy import ndimage

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, '..', 'assets', 'img')

CHARACTERS = ('sheet-characters.webp', 'cto', [
    ((0, 318), [(20, 285, 'blazer-pointing'), (290, 610, 'laptop'), (615, 875, 'thinking'), (885, 1140, 'tablet-notes'), (1185, 1490, 'blazer-thumbsup')]),
    ((318, 588), [(0, 275, 'explaining'), (275, 505, 'glasses-tablet'), (510, 760, 'idea'), (760, 1008, 'chart'), (1008, 1218, 'arms-crossed'), (1218, 1536, 'whiteboard')]),
    ((580, 832), [(0, 290, 'welcome'), (290, 545, 'laptop-chat'), (575, 805, 'walking'), (840, 1095, 'climbing'), (1140, 1290, 'backpack'), (1290, 1500, 'signpost')]),
    ((832, 1024), [(0, 272, 'pair-laptop'), (272, 515, 'pair-tablet'), (515, 785, 'team-meeting'), (785, 1050, 'presenting'), (1050, 1312, 'beanbag'), (1312, 1536, 'celebrate')]),
])
ILLUSTRATIONS = ('sheet-illustrations.webp', 'ill', [
    ((20, 282), [(0, 280, 'voice-robot'), (280, 515, 'cloud-db'), (515, 775, 'coder'), (775, 1025, 'automation'), (1025, 1265, 'analytics'), (1265, 1536, 'messaging')]),
    ((282, 482), [(0, 280, 'hub'), (280, 540, 'secure-servers'), (540, 770, 'rocket'), (770, 1020, 'growth'), (1020, 1220, 'target'), (1220, 1536, 'team')]),
    ((482, 660), [(0, 262, 'data-pipeline'), (262, 525, 'ai-chip'), (525, 770, 'cicd'), (770, 1015, 'mobile-chat'), (1015, 1268, 'api'), (1268, 1536, 'devices')]),
    ((660, 830), [(0, 255, 'storage'), (255, 525, 'monitoring'), (525, 750, 'globe'), (750, 1005, 'robot-checklist'), (1005, 1235, 'compliance'), (1235, 1536, 'support')]),
    ((830, 1000), [(0, 290, 'idea-to-app'), (290, 535, 'plan'), (535, 760, 'flowchart'), (760, 1000, 'qa'), (1000, 1255, 'cloud-sync'), (1255, 1536, 'team-settings')]),
])
ICON_NAMES = [
    'robot code gear cloud server database mic chat',
    'phone video mail bell bars pie trend shield',
    'chip cube link share cloud-sync globe mobile laptop',
    'calendar clock users user doc folder search filter',
    'checklist ok error warning info pause play stop',
    'refresh settings rack hierarchy nodes db-cloud upload download',
    'graduation bank medical cart card wallet money invoice',
    'megaphone target bulb puzzle rocket crown star heart',
    'bars-2 sliders image video-play music headphones chats org',
]
ICON_ROWS = [0, 162, 298, 437, 568, 693, 820, 945, 1082, 1207]
ICON_COLS = [0, 200, 350, 505, 662, 815, 975, 1130, 1303]
ICONS = ('sheet-icons.webp', 'ico', [
    ((ICON_ROWS[r], ICON_ROWS[r + 1]), [(ICON_COLS[c], ICON_COLS[c + 1], n) for c, n in enumerate(ICON_NAMES[r].split())])
    for r in range(9)
])


def cut(sheet):
    """Each grid cell only *selects* shapes (by their centre); the crop is the
    shapes' own outline plus their soft edge, so nothing is clipped by the grid."""
    fn, prefix, rows = sheet
    arr = np.array(Image.open(os.path.join(HERE, fn)).convert('RGBA'))
    solid = arr[:, :, 3] > 160
    lab, _ = ndimage.label(solid)
    ids = range(1, lab.max() + 1)
    centres = ndimage.center_of_mass(solid, lab, ids)
    sizes = ndimage.sum(solid, lab, ids)
    n = 0
    for (y0, y1), cols in rows:
        for x0, x1, name in cols:
            mine = [k for k in ids if sizes[k - 1] >= 30 and y0 <= centres[k - 1][0] < y1 and x0 <= centres[k - 1][1] < x1]
            mask = np.isin(lab, mine)
            soft = ndimage.binary_dilation(mask, iterations=6) & (arr[:, :, 3] > 0)
            ys, xs = np.nonzero(soft)
            t, b_, l, r = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
            piece = arr[t:b_, l:r].copy()
            piece[:, :, 3] = np.where(soft[t:b_, l:r], piece[:, :, 3], 0)
            pad = 6
            canvas = Image.new('RGBA', (r - l + pad * 2, b_ - t + pad * 2), (0, 0, 0, 0))
            canvas.paste(Image.fromarray(piece), (pad, pad))
            canvas.save(os.path.join(OUT, f'{prefix}-{name}.webp'), 'WEBP', quality=88, method=6)
            n += 1
    print(f'{fn}: {n} images')


if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    for s in (CHARACTERS, ILLUSTRATIONS, ICONS):
        cut(s)
