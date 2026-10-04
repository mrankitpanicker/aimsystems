"""AI-upscale the cut-out art (characters, illustrations, icons) 2x.

Uses Real-ESRGAN's realesr-general-x4v3 model (SRVGGNetCompact) at 4x, then
downsamples to 2x with Lanczos, which keeps the detail and removes the soft,
blurry look of the small source crops. Transparency is preserved: colour
under transparent pixels is filled from the nearest opaque pixel before
upscaling, and the alpha mask is upscaled separately.

    pip install torch numpy scipy pillow
    curl -L -o realesr-general-x4v3.pth \
      https://github.com/xinntao/Real-ESRGAN/releases/download/v0.2.5.0/realesr-general-x4v3.pth
    python3 _src/upscale.py path/to/realesr-general-x4v3.pth [prefix ...]

Run it once, on the output of cut_sheets.py; running it twice upscales twice.
"""
import os, sys, glob, time
import numpy as np
import torch, torch.nn as nn, torch.nn.functional as F
from PIL import Image
from scipy import ndimage

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')


class SRVGGNetCompact(nn.Module):
    def __init__(self, num_feat=64, num_conv=32, upscale=4):
        super().__init__()
        self.upscale = upscale
        self.body = nn.ModuleList([nn.Conv2d(3, num_feat, 3, 1, 1), nn.PReLU(num_parameters=num_feat)])
        for _ in range(num_conv):
            self.body.append(nn.Conv2d(num_feat, num_feat, 3, 1, 1))
            self.body.append(nn.PReLU(num_parameters=num_feat))
        self.body.append(nn.Conv2d(num_feat, 3 * upscale * upscale, 3, 1, 1))
        self.upsampler = nn.PixelShuffle(upscale)

    def forward(self, x):
        out = x
        for layer in self.body:
            out = layer(out)
        out = self.upsampler(out)
        return out + F.interpolate(x, scale_factor=self.upscale, mode='nearest')


def load(weights):
    net = SRVGGNetCompact()
    sd = torch.load(weights, map_location='cpu')
    net.load_state_dict(sd.get('params', sd), strict=True)
    return net.eval()


@torch.no_grad()
def sr(net, rgb):
    t = torch.from_numpy(rgb.astype(np.float32) / 255).permute(2, 0, 1)[None]
    out = net(t).clamp(0, 1)[0].permute(1, 2, 0).numpy()
    return (out * 255 + 0.5).astype(np.uint8)


def upscale_file(net, path):
    im = Image.open(path).convert('RGBA')
    a = np.array(im)
    rgb, alpha = a[..., :3], a[..., 3]
    # fill hidden colour from the nearest visible pixel so edges don't pick up junk
    hidden = alpha < 8
    if hidden.any() and (~hidden).any():
        idx = ndimage.distance_transform_edt(hidden, return_distances=False, return_indices=True)
        rgb = rgb[idx[0], idx[1]]
    up = Image.fromarray(sr(net, rgb))
    w, h = im.width * 2, im.height * 2
    up = up.resize((w, h), Image.LANCZOS)
    al = Image.fromarray(alpha).resize((w, h), Image.LANCZOS)
    up.putalpha(al)
    up.save(path, 'WEBP', quality=90, method=6)
    return im.size, (w, h)


def main():
    weights = sys.argv[1]
    prefixes = sys.argv[2:] or ['cto', 'ill', 'ico']
    torch.set_num_threads(os.cpu_count() or 4)
    net = load(weights)
    files = sorted(f for p in prefixes for f in glob.glob(os.path.join(ROOT, 'assets', 'img', f'{p}-*.webp')))
    for i, f in enumerate(files, 1):
        t = time.time()
        a, b = upscale_file(net, f)
        print(f'[{i}/{len(files)}] {os.path.basename(f)} {a} -> {b} {time.time() - t:.1f}s', flush=True)


if __name__ == '__main__':
    main()
