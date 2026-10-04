# AIM — AI Infrastructure & Machines

Multi-page website for **AIM (AI Infrastructure & Machines)** at [aimsystem.in](https://aimsystem.in), with Ankit Panicker as CTO.
Covers the products (APEX Connect, AIM / Remote AI, APEX HMS, Shortz, Apex Core, Free Tools), engineering approach,
production work, engagement models and contact.

## Pages
| Path | File |
|---|---|
| `/` | `index.html` |
| `/products` | `products.html` |
| `/engineering` | `engineering.html` (interactive reliability lab) |
| `/work` | `work.html` |
| `/about` | `about.html` (CTO) |
| `/engage` | `engage.html` |
| `/contact` | `contact.html` |
| `/jobs` | `jobs.html` (careers, unchanged) |

## Editing
Pages are generated. Edit the page bodies in `_src/pages/`, and the shared head, header, nav and footer in
`_src/build.py`, then rebuild:

```bash
cd _src
npm install        # once
npm run build      # writes the root *.html, assets/css/tw.css and assets/js/icons.js
```

`npm run build` runs three steps: `build.py` wraps each page in the shared layout, Tailwind compiles only the
classes the pages use into `assets/css/tw.css`, and `icons.js` writes the Lucide icons the pages use into
`assets/js/icons.js`. The site has no runtime CDN dependencies apart from Google Fonts.

## Design & assets
- `assets/css/aim.css` holds the tactile neumorphic design system (light "Lilac Ice" and dark "Midnight Cobalt") verbatim, with site additions at the end.
- `assets/js/aim.js` holds all interactions: sliding nav pill, theme toggle (remembered per browser), monolith press with water ripple, folder tabs, accordions, rotary dial, rocker switch, laser-etched trace, speaker grille, Web Audio keypad, trench slider, fluid tank, circuit-breaker lab, pipeline runner and counters.
- `assets/img/` holds transparent art cut from three sheets in `_src/`: `cto-*` (the CTO character; blazer poses are used only where the CTO is the subject), `ill-*` (illustrations) and `ico-*` (3D icons). Re-cut with `python3 _src/cut_sheets.py` (needs Pillow, numpy, scipy).
- The logo (`assets/img/aim-logo.webp`, favicons, share image) is cut from `_src/logo-source.webp` by `python3 _src/cut_logo.py`; the inner hexagon is transparent so it sits on the navy tile.
- Contact details are never printed in the pages. Buttons marked `data-contact="email"` / `"phone"` copy them to the clipboard; the values live base64-encoded in `CONTACT` at the top of the contact section in `assets/js/aim.js`. Phone buttons stay hidden until `phone` is filled in.
- UI sounds are synthesised with Web Audio in `aim.js` (no audio files); the speaker button in the header mutes them and the choice is remembered per browser.
- Cards follow three tones: raised (`.tactile-raised`), pressed-in (`.card-sunk`, rests sunk and lifts out on hover or tap) and the navy accent (`.tactile-navy`, the button gradient) for one featured block per section. Anything inside a navy card picks up navy tokens automatically; `.price-strip` is the light inverse used inside navy.

## Deploy
Firebase Hosting (`firebase deploy --only hosting`). `cleanUrls` serves `/products` from `products.html`; `_src/`, `worker/` and `tmp_zip/` are not deployed.
