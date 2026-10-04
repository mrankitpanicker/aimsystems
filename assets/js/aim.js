/* AIM — AI Infrastructure & Machines
   Shared interactions for every page. Each widget initialises only when its
   markup is present, so pages opt in by including the HTML. */
(function () {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const isDark = () => document.documentElement.classList.contains('dark');
  const icons = () => { if (window.lucide) window.lucide.createIcons(); };

  /* ---------- Toast ---------- */
  let toastTimer = null;
  function toast(msg) {
    const el = $('#toast'), text = $('#toastText');
    if (!el || !text) return;
    text.textContent = msg;
    el.classList.remove('translate-y-28', 'opacity-0');
    el.classList.add('translate-y-0', 'opacity-100');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      el.classList.add('translate-y-28', 'opacity-0');
      el.classList.remove('translate-y-0', 'opacity-100');
    }, 2400);
  }
  window.aimToast = toast;

  /* ---------- Theme ---------- */
  function paintThemeButtons() {
    $$('[data-theme-toggle]').forEach(btn => {
      const i = btn.querySelector('[data-theme-icon]');
      const l = btn.querySelector('[data-theme-label]');
      if (i) i.setAttribute('data-lucide', isDark() ? 'sun' : 'moon');
      if (l) l.textContent = isDark() ? 'Lilac Ice' : 'Midnight Cobalt';
      btn.setAttribute('aria-pressed', String(isDark()));
    });
    icons();
  }
  function toggleTheme() {
    const dark = !isDark();
    document.documentElement.classList.toggle('dark', dark);
    try { localStorage.setItem('aim-theme', dark ? 'dark' : 'light'); } catch (e) {}
    paintThemeButtons();
    placePill(activeLink());
    toast(dark ? 'Midnight Cobalt' : 'Lilac Ice');
  }

  /* ---------- Sliding nav pill ---------- */
  const track = $('#navbarTrack');
  const pill = $('#navIndicatorPill');
  const activeLink = () => $('#navbarTrack .nav-link[aria-current="page"]');
  function placePill(link) {
    if (!track || !pill) return;
    if (!link) { pill.style.width = '0px'; return; }
    const t = track.getBoundingClientRect(), r = link.getBoundingClientRect();
    pill.style.transform = `translateX(${r.left - t.left}px)`;
    pill.style.width = `${r.width}px`;
    $$('#navbarTrack .nav-link').forEach(a => {
      a.classList.toggle('text-white', a === link);
    });
  }
  if (track) {
    $$('.nav-link', track).forEach(a => a.addEventListener('mouseenter', () => placePill(a)));
    track.addEventListener('mouseleave', () => placePill(activeLink()));
  }

  /* ---------- Mobile menu ---------- */
  const menuBtn = $('#menuToggle'), menu = $('#mobileMenu');
  if (menuBtn && menu) {
    menuBtn.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', String(open));
      const i = menuBtn.querySelector('i,svg');
      if (i) { i.setAttribute('data-lucide', open ? 'x' : 'menu'); icons(); }
    });
  }

  /* ---------- Scroll reveal + counters ---------- */
  function countUp(el) {
    const target = parseFloat(el.dataset.count);
    const dec = (el.dataset.count.split('.')[1] || '').length;
    const pre = el.dataset.prefix || '', suf = el.dataset.suffix || '';
    const dur = 1400, t0 = performance.now();
    const step = now => {
      const p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = pre + (target * e).toLocaleString('en-IN', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suf;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        en.target.classList.add('revealed');
        $$('[data-count]', en.target).forEach(c => { if (!c.dataset.done) { c.dataset.done = 1; countUp(c); } });
        io.unobserve(en.target);
      });
    }, { threshold: 0.12 });
    $$('.reveal-on-scroll').forEach(el => io.observe(el));
  } else {
    $$('.reveal-on-scroll').forEach(el => el.classList.add('revealed'));
  }

  /* ---------- Press buttons (deploy-edge / convex pills) ---------- */
  $$('[data-press-toast]').forEach(btn => btn.addEventListener('click', () => {
    btn.classList.add('is-pressed');
    setTimeout(() => btn.classList.remove('is-pressed'), 350);
    toast(btn.dataset.pressToast);
  }));

  /* ---------- Monolith chassis + water ripple ---------- */
  $$('.monolith-outer-fillet').forEach(card => {
    const canvas = card.querySelector('.ripple-canvas');
    const toggle = () => {
      card.classList.toggle('is-pressed');
      if (card.dataset.toastOn) toast(card.classList.contains('is-pressed') ? card.dataset.toastOn : card.dataset.toastOff);
    };
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
    if (!canvas) { card.addEventListener('click', toggle); return; }
    const ctx = canvas.getContext('2d');
    let waves = [], running = false;
    function size() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = canvas.parentElement.getBoundingClientRect();
      canvas.width = r.width * dpr; canvas.height = r.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function frame() {
      const r = canvas.parentElement.getBoundingClientRect();
      ctx.clearRect(0, 0, r.width, r.height);
      const rgb = isDark() ? '139, 92, 246' : '22, 51, 135';
      waves = waves.filter(w => {
        w.r += 2; w.life -= 0.012;
        if (w.life <= 0) return false;
        ctx.beginPath(); ctx.arc(w.x, w.y, w.r, 0, Math.PI * 2);
        ctx.lineWidth = 3; ctx.strokeStyle = `rgba(${rgb}, ${(w.life * 0.35).toFixed(3)})`; ctx.stroke();
        return true;
      });
      if (waves.length) requestAnimationFrame(frame); else running = false;
    }
    size(); window.addEventListener('resize', size);
    card.addEventListener('click', e => {
      toggle();
      const r = canvas.parentElement.getBoundingClientRect();
      waves.push({ x: e.clientX - r.left, y: e.clientY - r.top, r: 4, life: 1 });
      if (!running) { running = true; requestAnimationFrame(frame); }
    });
  });

  /* ---------- Pressed-in cards: tap to pop on touch screens ---------- */
  $$('.card-sunk').forEach(card => card.addEventListener('click', e => {
    if (e.target.closest('a, button')) return;
    const was = card.classList.contains('is-popped');
    $$('.card-sunk.is-popped').forEach(c => c.classList.remove('is-popped'));
    if (!was) card.classList.add('is-popped');
  }));

  /* ---------- Accordion ---------- */
  $$('.accordion-card').forEach(card => {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-expanded', String(card.classList.contains('open')));
    const flip = () => {
      const group = card.closest('[data-accordion]') || document;
      const wasOpen = card.classList.contains('open');
      $$('.accordion-card', group).forEach(c => { c.classList.remove('open'); c.setAttribute('aria-expanded', 'false'); });
      if (!wasOpen) { card.classList.add('open'); card.setAttribute('aria-expanded', 'true'); }
    };
    card.addEventListener('click', e => { if (!e.target.closest('a')) flip(); });
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(); } });
  });

  /* ---------- Folder tabs ---------- */
  $$('[data-tabs]').forEach(group => {
    const tabs = $$('[data-tab]', group);
    const panels = $$('[data-panel]', group);
    const select = (tab, quiet) => {
      tabs.forEach(t => {
        const on = t === tab;
        t.classList.toggle('btn-deploy-edge', on);
        t.classList.toggle('tactile-convex-pill', !on);
        t.setAttribute('aria-selected', String(on));
      });
      panels.forEach(p => { p.hidden = p.dataset.panel !== tab.dataset.tab; });
      if (!quiet && group.dataset.tabsToast !== undefined) toast(tab.textContent.trim());
    };
    tabs.forEach(t => t.addEventListener('click', () => select(t)));
    const first = tabs.find(t => t.getAttribute('aria-selected') === 'true') || tabs[0];
    if (first) select(first, true);
  });

  /* ---------- Rotary dial: per-tenant call capacity ---------- */
  const dialBox = $('#rotaryContainer'), knob = $('#rotaryKnob');
  if (dialBox && knob) {
    const min = +dialBox.dataset.min || 0, max = +dialBox.dataset.max || 100;
    const cap = +dialBox.dataset.capacity || max;
    let angle = +dialBox.dataset.start || 120, dragging = false;
    const valueEl = $('#dialValue'), angleEl = $('#dialAngle'), stateEl = $('#dialState');
    function render(a) {
      angle = Math.max(0, Math.min(270, a));
      knob.style.transform = `rotate(${angle - 135}deg)`;
      const v = Math.round(min + (angle / 270) * (max - min));
      if (valueEl) valueEl.textContent = v.toLocaleString('en-IN');
      if (angleEl) angleEl.textContent = Math.max(0, v - cap).toLocaleString('en-IN');
      if (stateEl) {
        const over = v > cap;
        stateEl.textContent = over ? `Capacity reached — ${v - cap} calls held in the tenant queue` : `Admitted — ${cap - v} slots free for this tenant`;
        stateEl.className = 'text-sm font-black ' + (over ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400');
      }
      dialBox.setAttribute('aria-valuenow', String(v));
    }
    function fromPointer(e) {
      const r = dialBox.getBoundingClientRect();
      const p = e.touches ? e.touches[0] : e;
      let deg = Math.atan2(p.clientY - (r.top + r.height / 2), p.clientX - (r.left + r.width / 2)) * 180 / Math.PI + 90;
      if (deg < 0) deg += 360;
      // map the 270° sweep that starts at -135°
      deg = (deg + 135) % 360;
      render(deg > 270 ? (deg > 315 ? 0 : 270) : deg);
    }
    dialBox.addEventListener('pointerdown', e => { dragging = true; dialBox.setPointerCapture(e.pointerId); fromPointer(e); });
    dialBox.addEventListener('pointermove', e => { if (dragging) fromPointer(e); });
    dialBox.addEventListener('pointerup', () => { dragging = false; });
    dialBox.addEventListener('wheel', e => { e.preventDefault(); render(angle + (e.deltaY > 0 ? -12 : 12)); }, { passive: false });
    dialBox.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { e.preventDefault(); render(angle + 9); }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { e.preventDefault(); render(angle - 9); }
    });
    render(angle);
  }

  /* ---------- Rocker switch ---------- */
  $$('[data-rocker]').forEach(rocker => {
    const sides = $$('[data-side]', rocker);
    const status = $(rocker.dataset.status), desc = $(rocker.dataset.desc);
    const set = (btn, quiet) => {
      sides.forEach(s => {
        const on = s === btn;
        s.classList.toggle('rocker-side-active', on);
        s.classList.toggle('rocker-side-inactive', !on);
        s.setAttribute('aria-pressed', String(on));
        const dot = s.querySelector('[data-dot]');
        if (dot) dot.style.opacity = on ? '1' : '.3';
      });
      if (status) { status.textContent = btn.dataset.title; status.style.color = btn.dataset.color || ''; }
      if (desc) desc.textContent = btn.dataset.text;
      if (!quiet) toast(btn.dataset.title);
    };
    sides.forEach(s => s.addEventListener('click', () => set(s)));
    if (sides[0]) set(sides[0], true);
  });

  /* ---------- Laser-etched circuit ---------- */
  $$('[data-circuit]').forEach(box => {
    const label = $('[data-circuit-label]', box);
    const idle = label ? label.textContent : '';
    const traces = $$('.laser-trace', box);
    $$('[data-pin]', box).forEach(pin => {
      const on = () => { if (label) label.textContent = pin.dataset.pin; traces.forEach(t => t.classList.add('laser-trace-active')); };
      const off = () => { if (label) label.textContent = idle; traces.forEach(t => t.classList.remove('laser-trace-active')); };
      pin.addEventListener('mouseenter', on); pin.addEventListener('focus', on);
      pin.addEventListener('mouseleave', off); pin.addEventListener('blur', off);
      pin.addEventListener('click', on);
    });
  });

  /* ---------- Acoustic speaker grille ---------- */
  const grille = $('#speakerGrille');
  if (grille) {
    for (let i = 0; i < 72; i++) {
      const d = document.createElement('div');
      d.className = 'speaker-dot w-3 h-3 rounded-full justify-self-center';
      grille.appendChild(d);
    }
    const dots = $$('.speaker-dot', grille);
    const btn = $('#audioWaveBtn'), txt = $('#speakerBtnText'), st = $('#speakerStatus');
    const lines = (grille.dataset.lines || '').split('|').filter(Boolean);
    let timer = null, tick = 0;
    btn && btn.addEventListener('click', () => {
      if (timer) {
        clearInterval(timer); timer = null;
        dots.forEach(d => d.classList.remove('dot-active'));
        txt.textContent = btn.dataset.idle; st.textContent = 'Line idle · waiting for a call';
        return;
      }
      txt.textContent = 'Hang up';
      timer = setInterval(() => {
        tick++;
        // a travelling wave reads more like speech than pure noise
        dots.forEach((d, i) => {
          const col = i % 12, amp = Math.abs(Math.sin((col + tick) / 2.2));
          d.classList.toggle('dot-active', Math.random() < amp * 0.6);
        });
        if (lines.length && tick % 14 === 1) st.textContent = lines[Math.floor(tick / 14) % lines.length];
      }, 110);
    });
  }

  /* ---------- Web Audio keypad ---------- */
  let audioCtx = null;
  function click() {
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      const o = audioCtx.createOscillator(), g = audioCtx.createGain(), t = audioCtx.currentTime;
      o.type = 'triangle';
      o.frequency.setValueAtTime(440, t); o.frequency.exponentialRampToValueAtTime(120, t + 0.035);
      g.gain.setValueAtTime(0.12, t); g.gain.exponentialRampToValueAtTime(0.01, t + 0.035);
      o.connect(g); g.connect(audioCtx.destination); o.start(); o.stop(t + 0.035);
    } catch (e) {}
  }
  $$('[data-pad]').forEach(b => b.addEventListener('click', () => {
    click();
    const log = $('#padLog'), detail = $('#padDetail');
    if (log) log.textContent = b.dataset.pad;
    if (detail) detail.textContent = b.dataset.detail || '';
    b.classList.add('is-pressed'); setTimeout(() => b.classList.remove('is-pressed'), 200);
  }));

  /* ---------- Trench slider: backpressure ---------- */
  const sTrack = $('#sliderTrack'), thumb = $('#sliderThumb');
  if (sTrack && thumb) {
    const cap = +sTrack.dataset.capacity || 60, max = +sTrack.dataset.max || 150;
    const label = $('#sliderValueLabel'), acc = $('#bpAccepted'), q = $('#bpQueued'), shed = $('#bpShed'), note = $('#bpNote');
    const qmax = +sTrack.dataset.queue || 40;
    let dragging = false, pct = 0.35;
    function render() {
      thumb.style.left = `calc(${pct * 100}% - 16px)`;
      const load = Math.round(pct * max);
      const a = Math.min(load, cap), qq = Math.min(Math.max(0, load - cap), qmax), sh = Math.max(0, load - cap - qmax);
      if (label) label.textContent = `${load} jobs / sec offered`;
      if (acc) acc.textContent = a; if (q) q.textContent = qq; if (shed) shed.textContent = sh;
      if (note) note.textContent = sh ? 'Over capacity and queue full: new work is rejected with a retry hint, so the workers keep running.' :
        qq ? 'Above worker capacity: the extra work waits in the bounded queue.' : 'Within capacity: every job is admitted straight away.';
      sTrack.setAttribute('aria-valuenow', String(load));
    }
    const move = x => { const r = sTrack.getBoundingClientRect(); pct = Math.max(0, Math.min(1, (x - r.left) / r.width)); render(); };
    sTrack.addEventListener('pointerdown', e => { dragging = true; sTrack.setPointerCapture(e.pointerId); move(e.clientX); });
    sTrack.addEventListener('pointermove', e => { if (dragging) move(e.clientX); });
    sTrack.addEventListener('pointerup', () => { dragging = false; });
    sTrack.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') { pct = Math.min(1, pct + 0.04); render(); }
      if (e.key === 'ArrowLeft') { pct = Math.max(0, pct - 0.04); render(); }
    });
    render();
  }

  /* ---------- Fluid reservoir (VRAM) ---------- */
  $$('[data-fill]').forEach(b => b.addEventListener('click', () => {
    const pct = +b.dataset.fill, bar = $('#fluidTankBar');
    if (bar) bar.style.height = pct + '%';
    const l = $('#fluidPercentLabel'); if (l) l.textContent = pct + '%';
    const v = $('#fluidValue'); if (v) v.textContent = b.dataset.gb;
    const n = $('#fluidNote'); if (n) n.textContent = b.dataset.note || '';
  }));

  /* ---------- Circuit breaker lab ---------- */
  const lab = $('#breakerLab');
  if (lab) {
    const THRESH = 3, COOL = 4000;
    let state = 'CLOSED', fails = 0, openedAt = 0, timer = null;
    const log = $('#breakerLog'), failEl = $('#breakerFails');
    function paint() {
      $$('[data-state]', lab).forEach(s => s.classList.toggle('on', s.dataset.state === state));
      if (failEl) failEl.textContent = `${fails} / ${THRESH}`;
    }
    function write(msg) {
      if (!log) return;
      const li = document.createElement('li');
      li.textContent = `${new Date().toLocaleTimeString([], { hour12: false })}  ${msg}`;
      log.prepend(li);
      while (log.children.length > 6) log.lastChild.remove();
    }
    function open() {
      state = 'OPEN'; openedAt = Date.now(); write('OPEN — failing fast; callers get the fallback, not silence');
      clearTimeout(timer);
      timer = setTimeout(() => { state = 'HALF_OPEN'; write('HALF-OPEN — next request is a trial'); paint(); }, COOL);
    }
    function call(ok) {
      if (state === 'OPEN') { write(`rejected in 0 ms — cooling down (${Math.ceil((COOL - (Date.now() - openedAt)) / 1000)}s)`); return paint(); }
      if (ok) {
        if (state === 'HALF_OPEN') write('trial succeeded → CLOSED');
        else write('provider call ok');
        state = 'CLOSED'; fails = 0;
      } else {
        fails++;
        write(`provider call failed (${fails})`);
        if (state === 'HALF_OPEN' || fails >= THRESH) { fails = THRESH; open(); }
      }
      paint();
    }
    $('#breakerOk').addEventListener('click', () => call(true));
    $('#breakerFail').addEventListener('click', () => call(false));
    $('#breakerReset').addEventListener('click', () => { clearTimeout(timer); state = 'CLOSED'; fails = 0; if (log) log.innerHTML = ''; write('reset'); paint(); });
    paint();
  }

  /* ---------- Staged pipeline run ---------- */
  $$('[data-pipeline]').forEach(box => {
    const chips = $$('.stage-chip', box), out = $('[data-pipeline-out]', box);
    const run = failAt => {
      chips.forEach(c => c.classList.remove('is-done', 'is-fail'));
      let i = 0;
      const next = () => {
        if (i >= chips.length) { if (out) out.textContent = 'Rendered. Timing recorded for every stage.'; return; }
        const c = chips[i];
        if (i === failAt) {
          c.classList.add('is-fail');
          if (out) out.textContent = `${c.dataset.stage} failed — classified, retried on its own; earlier stages are kept, not redone.`;
          return;
        }
        c.classList.add('is-done');
        if (out) out.textContent = `${c.dataset.stage} · ${c.dataset.ms} ms`;
        i++; setTimeout(next, 520);
      };
      next();
    };
    const go = $('[data-run]', box), bad = $('[data-run-fail]', box);
    go && go.addEventListener('click', () => run(-1));
    bad && bad.addEventListener('click', () => run(1 + Math.floor(Math.random() * (chips.length - 1))));
  });

  /* ---------- Copy buttons ---------- */
  $$('[data-copy]').forEach(b => b.addEventListener('click', () => {
    const done = () => toast('Copied: ' + b.dataset.copy);
    if (navigator.clipboard) navigator.clipboard.writeText(b.dataset.copy).then(done, done); else done();
  }));

  /* ---------- Contact form → prefilled email ---------- */
  const form = $('#contactForm');
  if (form) form.addEventListener('submit', e => {
    e.preventDefault();
    const f = new FormData(form);
    const subject = `[AIM] ${f.get('scope')} — ${f.get('org')}`;
    const body = [`Name: ${f.get('name')}`, `Organisation: ${f.get('org')}`, `Email: ${f.get('email')}`, `Scope: ${f.get('scope')}`, `Timeline: ${f.get('timeline')}`, '', f.get('message')].join('\n');
    window.location.href = `mailto:ankit@aimsystem.in?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    toast('Opening your email app with the brief filled in');
  });

  /* ---------- Boot ---------- */
  $$('[data-theme-toggle]').forEach(b => b.addEventListener('click', toggleTheme));
  $$('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
  paintThemeButtons();
  const settle = () => placePill(activeLink());
  window.addEventListener('resize', settle);
  window.addEventListener('load', settle);
  setTimeout(settle, 60);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(settle);
})();
