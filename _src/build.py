"""Assemble the AIM site.

Each file in _src/pages/ is a page body. Its first line is a JSON comment:
    <!--meta {"title": "...", "description": "...", "nav": "home"} -->
This script wraps every body in the shared head, header and footer and writes
<name>.html to the repository root. Normally run through `npm run build` in
_src/, which also compiles Tailwind and the icon subset.
"""
import json, os, re, html

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
PAGES = os.path.join(os.path.dirname(__file__), 'pages')
SITE = 'https://aimsystem.in'

NAV = [
    ('home', '/', 'Home'),
    ('products', '/products', 'Products'),
    ('engineering', '/engineering', 'Engineering'),
    ('work', '/work', 'Work'),
    ('about', '/about', 'CTO'),
    ('engage', '/engage', 'Engage'),
    ('contact', '/contact', 'Contact'),
]

HEAD = """<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title}</title>
  <meta name="description" content="{description}">
  <link rel="canonical" href="{url}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="AIM — AI Infrastructure &amp; Machines">
  <meta property="og:title" content="{title}">
  <meta property="og:description" content="{description}">
  <meta property="og:url" content="{url}">
  <meta property="og:image" content="{site}/assets/img/og-aim.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="theme-color" content="#E6EEF8">
  <link rel="icon" href="/assets/img/aim-logo-32.png" sizes="32x32" type="image/png">
  <link rel="icon" href="/favicon.png" sizes="192x192" type="image/png">
  <link rel="apple-touch-icon" href="/assets/img/aim-logo-180.png">

  <script>
    (function () {{
      var t = null;
      try {{ t = localStorage.getItem('aim-theme'); }} catch (e) {{}}
      if (t === 'dark' || (!t && window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches)) {{
        document.documentElement.classList.add('dark');
      }}
    }})();
  </script>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@700;800;900&family=JetBrains+Mono:wght@600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/assets/css/aim.css">
  <link rel="stylesheet" href="/assets/css/tw.css">
{extra_head}</head>
<body class="min-h-screen py-6 sm:py-8 px-4 sm:px-6 lg:px-12 flex flex-col items-center">
  <a href="#main" class="skip-link btn-deploy-edge px-4 py-2 text-xs">Skip to content</a>
"""

HEADER = """
  <header class="tactile-raised rounded-3xl p-3.5 sm:p-4 w-full max-w-6xl sticky top-3 z-50 backdrop-blur-md">
    <div class="flex items-center justify-between gap-3">
      <a href="/" class="flex items-center gap-3 min-w-0" aria-label="AIM home">
        <span class="logo-tile w-11 h-11 rounded-2xl flex items-center justify-center shrink-0">
          <img src="/assets/img/aim-logo.webp" alt="" class="w-9 h-9">
        </span>
        <span class="min-w-0 inline-grid gap-1">
          <span class="flex items-center justify-between gap-2 px-0.5">
            <span class="text-[22px] font-black font-display tracking-tight leading-none">AIM</span>
            <span class="brand-pill hidden sm:inline-flex items-center px-2.5 py-[4px] rounded-full text-[10.5px] font-black font-display tracking-[0.2em] uppercase text-white leading-none">Systems</span>
          </span>
          <span class="brand-groove block tactile-inset-sm rounded-full px-2 sm:px-2.5 py-0.5 text-[8.5px] sm:text-[10px] text-[var(--text-muted)] font-semibold whitespace-nowrap">AI Infrastructure &amp; Machines</span>
        </span>
      </a>

      <nav id="navbarTrack" aria-label="Main" class="relative hidden xl:flex items-center p-1.5 rounded-full tactile-inset-sm text-xs font-bold text-[var(--text-muted)]">
        <div id="navIndicatorPill"></div>
{nav_links}
      </nav>

      <div class="flex items-center gap-2.5">
        <button type="button" data-sound-toggle class="tactile-convex-pill w-10 h-10 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-main)]" aria-label="Mute sound effects">
          <i data-sound-icon data-lucide="volume-2" class="w-4 h-4 text-[#7952EC] dark:text-[#A78BFA]"></i>
        </button>
        <button type="button" data-theme-toggle class="tactile-convex-pill px-3.5 py-2 text-xs flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-main)]" aria-label="Toggle dark mode">
          <i data-theme-icon data-lucide="moon" class="w-4 h-4 text-[#7952EC] dark:text-[#A78BFA]"></i>
          <span data-theme-label class="hidden md:inline">Midnight Cobalt</span>
        </button>
        <a href="/contact" class="btn-deploy-edge px-4 sm:px-5 py-2.5 text-xs tracking-wide hidden sm:inline-flex">
          <i data-lucide="zap" class="w-3.5 h-3.5 opacity-90"></i>
          <span>Start a project</span>
        </a>
        <button type="button" id="menuToggle" class="xl:hidden tactile-convex-pill w-10 h-10 flex items-center justify-center" aria-expanded="false" aria-controls="mobileMenu" aria-label="Open menu">
          <i data-lucide="menu" class="w-4 h-4"></i>
        </button>
      </div>
    </div>

    <nav id="mobileMenu" aria-label="Mobile" class="xl:hidden grid-cols-2 sm:grid-cols-4 gap-2.5 pt-4">
{mobile_links}
    </nav>
  </header>

  <main id="main" class="w-full max-w-6xl space-y-16 sm:space-y-24 pt-10 sm:pt-14">
"""

FOOTER = """
  </main>

  <footer class="w-full max-w-6xl mt-20 sm:mt-28">
    <div class="tactile-raised rounded-3xl p-6 sm:p-8 grid grid-cols-2 md:grid-cols-12 gap-8">
      <div class="col-span-2 md:col-span-4 space-y-4">
        <div class="flex items-center gap-3">
          <span class="logo-tile w-11 h-11 rounded-2xl flex items-center justify-center"><img src="/assets/img/aim-logo.webp" alt="" class="w-9 h-9"></span>
          <div>
            <div class="text-base font-black font-display">AIM</div>
            <div class="text-[11px] text-[var(--text-muted)]">AI Infrastructure &amp; Machines</div>
          </div>
        </div>
        <p class="text-xs text-[var(--text-muted)] leading-relaxed">Infrastructure behind real-world software: voice AI, automation, queues, workers, offline-first systems and the failure paths in between. Built in Madhya Pradesh, India.</p>
        <p class="inline-flex items-center gap-2 tactile-inset-sm rounded-full px-3 py-1.5 text-[10px] font-mono font-bold"><img src="/assets/img/ico-bank.webp" alt="" class="w-4 h-4 object-contain">Registered by Govt. of India · Udyam MSME</p>
        <p class="text-xs font-mono font-bold text-[#163387] dark:text-[#A78BFA]">Build for the failure path first.</p>
      </div>
      <div class="md:col-span-2 space-y-2.5 text-xs">
        <div class="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)]">Company</div>
        <a class="block hover:text-[#7952EC]" href="/about">About the CTO</a>
        <a class="block hover:text-[#7952EC]" href="/work">Production work</a>
        <a class="block hover:text-[#7952EC]" href="/engage">Engagements</a>
        <a class="block hover:text-[#7952EC]" href="/jobs">Careers</a>
        <a class="block hover:text-[#7952EC]" href="/contact">Contact</a>
      </div>
      <div class="md:col-span-3 space-y-2.5 text-xs">
        <div class="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)]">Products</div>
        <a class="block hover:text-[#7952EC]" href="/products#apex-connect">APEX Connect</a>
        <a class="block hover:text-[#7952EC]" href="/products#aim-remote">AIM · Remote AI (free)</a>
        <a class="block hover:text-[#7952EC]" href="/products#apex-hms">APEX HMS</a>
        <a class="block hover:text-[#7952EC]" href="/products#shortz">Shortz AI Pipeline</a>
        <a class="block hover:text-[#7952EC]" href="/products#apex-core">Apex Core</a>
        <a class="block hover:text-[#7952EC]" href="https://aimstudio.co.in/freetools/" target="_blank" rel="noopener">Free Tools ↗</a>
      </div>
      <div class="col-span-2 md:col-span-3 space-y-2.5 text-xs">
        <div class="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)]">Reach us</div>
        <button type="button" data-contact="email" class="tactile-convex-pill px-3.5 py-1.5 text-[11px] inline-flex items-center gap-1.5"><i data-lucide="mail" class="w-3.5 h-3.5"></i>Copy email</button>
        <button type="button" data-contact="phone" hidden class="tactile-convex-pill px-3.5 py-1.5 text-[11px] inline-flex items-center gap-1.5"><i data-lucide="phone" class="w-3.5 h-3.5"></i>Copy phone</button>
        <a class="block hover:text-[#7952EC]" href="https://aimstudio.co.in/" target="_blank" rel="noopener">aimstudio.co.in ↗</a>
        <a class="block hover:text-[#7952EC]" href="https://aimstudio.co.in/developer-docs" target="_blank" rel="noopener">Developer docs ↗</a>
        <p class="text-[var(--text-muted)]">Madhya Pradesh, India · IST (UTC+5:30)<br>UK/EU morning overlap · Registered by Govt. of India</p>
      </div>
    </div>
    <div class="text-center text-[11px] font-mono text-[var(--text-muted)] py-6 space-y-1">
      <div>© <span data-year>2026</span> AIM — AI Infrastructure &amp; Machines · Registered by Govt. of India · Ankit Panicker, CTO</div>
      <div class="opacity-70">aimsystem.in · aimstudio.co.in · aimmarketing.in</div>
    </div>
  </footer>

  <!-- Chat assistant -->
  <div id="aimBot" class="aimbot">
    <section id="aimBotPanel" class="aimbot-panel" role="dialog" aria-modal="false" aria-labelledby="aimBotTitle" hidden>
      <header class="aimbot-head">
        <span class="aimbot-avatar"><img src="/assets/img/aim-bot.webp" alt=""></span>
        <span class="min-w-0 flex-1">
          <b id="aimBotTitle" class="block text-sm">AIM Assistant</b>
          <span class="flex items-center gap-1.5 text-[10px] font-mono text-[#B9C8FF]"><span class="status-dot live bg-emerald-400"></span>Answers from this site</span>
        </span>
        <button type="button" id="aimBotClose" class="aimbot-x" aria-label="Close chat"><i data-lucide="x" class="w-4 h-4"></i></button>
      </header>
      <div id="aimBotLog" class="aimbot-log" aria-live="polite"></div>
      <div id="aimBotChips" class="aimbot-chips"></div>
      <form id="aimBotForm" class="aimbot-form">
        <label for="aimBotInput" class="sr-only">Your question</label>
        <input id="aimBotInput" type="text" autocomplete="off" placeholder="Ask about pricing, products, hiring…" class="aimbot-input">
        <button type="submit" class="btn-deploy-edge w-10 h-10 shrink-0" aria-label="Send"><i data-lucide="send" class="w-4 h-4"></i></button>
      </form>
    </section>
    <button type="button" id="aimBotToggle" class="aimbot-fab" aria-expanded="false" aria-controls="aimBotPanel" aria-label="Open chat with the AIM assistant">
      <span id="aimBotHint" class="aimbot-hint">Hi! Ask me anything</span>
      <img src="/assets/img/aim-bot.webp" alt="" class="aimbot-img">
      <span class="aimbot-dot"></span>
    </button>
  </div>

  <div id="toast" role="status" aria-live="polite" class="fixed bottom-6 right-6 left-6 sm:left-auto transform translate-y-28 opacity-0 pointer-events-none z-50 px-5 py-3 rounded-full text-xs font-bold flex items-center gap-2.5 transition-all duration-300 text-white shadow-lg" style="background: var(--deploy-gradient); box-shadow: 0 8px 20px rgba(11, 28, 77, 0.35);">
    <div class="w-2.5 h-2.5 rounded-full bg-blue-300 animate-ping"></div>
    <span id="toastText">Ready</span>
  </div>

  <script src="/assets/js/icons.js"></script>
  <script src="/assets/js/aim.js"></script>
{extra_foot}</body>
</html>
"""


def nav_html(active):
    links, mobile = [], []
    for key, href, label in NAV:
        cur = ' aria-current="page"' if key == active else ''
        links.append(f'        <a href="{href}"{cur} class="nav-link relative z-10 px-3.5 py-2 rounded-full transition-colors">{label}</a>')
        cls = 'btn-deploy-edge' if key == active else 'tactile-convex-pill'
        mobile.append(f'      <a href="{href}"{cur} class="{cls} px-4 py-2.5 text-xs text-center">{label}</a>')
    mobile.append('      <a href="/jobs" class="tactile-convex-pill px-4 py-2.5 text-xs text-center">Careers</a>')
    return '\n'.join(links), '\n'.join(mobile)


def build():
    built = []
    for fn in sorted(os.listdir(PAGES)):
        if not fn.endswith('.html'):
            continue
        raw = open(os.path.join(PAGES, fn), encoding='utf-8').read()
        m = re.match(r'<!--meta\s+(\{.*?\})\s*-->\n', raw, re.S)
        if not m:
            raise SystemExit(f'{fn}: missing meta line')
        meta = json.loads(m.group(1))
        body = raw[m.end():]
        name = fn[:-5]
        path = '/' if name == 'index' else f'/{name}'
        links, mobile = nav_html(meta.get('nav', name))
        page = (
            HEAD.format(title=html.escape(meta['title']), description=html.escape(meta['description']),
                        url=SITE + path, site=SITE, extra_head=meta.get('head', ''))
            + HEADER.format(nav_links=links, mobile_links=mobile)
            + body.rstrip() + '\n'
            + FOOTER.format(extra_foot=meta.get('foot', ''))
        )
        open(os.path.join(ROOT, fn), 'w', encoding='utf-8').write(page)
        built.append(path)
    print('built:', ', '.join(built))


if __name__ == '__main__':
    build()
