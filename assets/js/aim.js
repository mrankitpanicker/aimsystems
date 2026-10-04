/* AIM — AI Infrastructure & Machines
   Shared interactions for every page. Each widget initialises only when its
   markup is present, so pages opt in by including the HTML. */
(function () {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const isDark = () => document.documentElement.classList.contains('dark');
  const icons = () => { if (window.lucide) window.lucide.createIcons(); };

  /* ---------- Every page opens at the top (unless the link targets a section) ---------- */
  try { if ('scrollRestoration' in history) history.scrollRestoration = 'manual'; } catch (e) {}
  const toTop = () => { if (!location.hash) window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); };
  toTop();
  window.addEventListener('pageshow', toTop);

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

  /* ---------- Sound ----------
     Small synthesised UI sounds (no files). The browser only allows audio
     after the visitor interacts, so the context starts on the first tap.
     A header button mutes them; the choice is remembered per browser. */
  let actx = null, lastTick = 0;
  let soundOn = true;
  try { soundOn = localStorage.getItem('aim-sound') !== 'off'; } catch (e) {}
  function tone(freq, to, dur, gain, type, delay) {
    const t = actx.currentTime + (delay || 0);
    const o = actx.createOscillator(), g = actx.createGain();
    o.type = type || 'sine';
    o.frequency.setValueAtTime(freq, t);
    if (to) o.frequency.exponentialRampToValueAtTime(to, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(actx.destination); o.start(t); o.stop(t + dur + 0.02);
  }
  const SOUNDS = {
    tap: () => tone(520, 260, 0.045, 0.05, 'sine'),
    press: () => { tone(320, 140, 0.08, 0.08, 'triangle'); tone(1800, 900, 0.02, 0.015, 'sine'); },
    key: () => tone(440, 120, 0.035, 0.12, 'triangle'),
    pop: () => tone(300, 720, 0.07, 0.05, 'sine'),
    toggleOn: () => { tone(660, 0, 0.05, 0.05, 'sine'); tone(990, 0, 0.06, 0.05, 'sine', 0.055); },
    toggleOff: () => { tone(990, 0, 0.05, 0.05, 'sine'); tone(660, 0, 0.06, 0.05, 'sine', 0.055); },
    success: () => { tone(660, 0, 0.07, 0.045, 'sine'); tone(880, 0, 0.07, 0.045, 'sine', 0.07); tone(1320, 0, 0.12, 0.04, 'sine', 0.14); },
    error: () => { tone(200, 120, 0.14, 0.035, 'square'); tone(160, 110, 0.14, 0.03, 'square', 0.12); },
    tick: () => tone(1500, 0, 0.012, 0.018, 'square'),
  };
  function sound(name) {
    if (!soundOn || document.hidden || !SOUNDS[name]) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      if (actx.state === 'suspended') actx.resume();
      if (name === 'tick') { const n = performance.now(); if (n - lastTick < 45) return; lastTick = n; }
      SOUNDS[name]();
    } catch (e) {}
  }
  window.aimSound = sound;
  function paintSoundButtons() {
    $$('[data-sound-toggle]').forEach(b => {
      const i = b.querySelector('[data-sound-icon]');
      if (i) i.setAttribute('data-lucide', soundOn ? 'volume-2' : 'volume-x');
      b.setAttribute('aria-pressed', String(soundOn));
      b.setAttribute('aria-label', soundOn ? 'Mute sound effects' : 'Turn on sound effects');
    });
    icons();
  }
  $$('[data-sound-toggle]').forEach(b => b.addEventListener('click', () => {
    soundOn = !soundOn;
    try { localStorage.setItem('aim-sound', soundOn ? 'on' : 'off'); } catch (e) {}
    paintSoundButtons();
    if (soundOn) sound('toggleOn');
    toast(soundOn ? 'Sound on' : 'Sound off');
  }));
  // one delegated listener gives every control a sound that matches its weight
  document.addEventListener('pointerdown', e => {
    const t = e.target.closest('button, a, [role="button"], [role="tab"], .card-sunk, .monolith-outer-fillet, [data-pin]');
    if (!t || t.matches('[data-sound-toggle], [data-pad], [data-theme-toggle], [data-tab], [data-side], [data-contact], #breakerOk, #breakerFail, [data-run], [data-run-fail]')) return;
    if (t.matches('.btn-deploy-edge, .monolith-outer-fillet')) sound('press');
    else if (t.matches('.card-sunk')) sound('pop');
    else sound('tap');
  }, { passive: true });

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
    sound(dark ? 'toggleOn' : 'toggleOff');
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
    const ripple = (x, y) => {
      waves.push({ x, y, r: 4, life: 1 });
      if (!running) { running = true; requestAnimationFrame(frame); }
    };
    card.addEventListener('click', e => {
      toggle();
      const r = canvas.parentElement.getBoundingClientRect();
      ripple(e.clientX - r.left, e.clientY - r.top);
    });
    // optional self-press: presses in, sends one wave from the centre, releases
    const every = +card.dataset.autopress;
    if (every && !(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)) {
      let hovering = false;
      card.addEventListener('mouseenter', () => { hovering = true; });
      card.addEventListener('mouseleave', () => { hovering = false; });
      setInterval(() => {
        if (hovering || document.hidden || card.classList.contains('is-pressed')) return;
        const r = canvas.parentElement.getBoundingClientRect();
        if (r.bottom < 0 || r.top > innerHeight) return;
        card.classList.add('is-pressed');
        ripple(r.width / 2, r.height / 2);
        setTimeout(() => card.classList.remove('is-pressed'), 900);
      }, every);
    }
  });

  /* ---------- Pressed-in cards: tap to pop on touch screens ---------- */
  $$('.card-sunk').forEach(card => card.addEventListener('click', e => {
    if (e.target.closest('a, button')) return;
    const was = card.classList.contains('is-popped');
    $$('.card-sunk.is-popped').forEach(c => c.classList.remove('is-popped'));
    if (!was) card.classList.add('is-popped');
  }));

  /* ---------- Cycling cards: one presses in at a time ---------- */
  $$('[data-cycle]').forEach(group => {
    const cards = $$('.cycle-card', group);
    if (!cards.length) return;
    const ms = +group.dataset.cycle || 3600;
    group.style.setProperty('--cycle-ms', ms + 'ms');
    const still = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    let i = 0, timer = null;
    const show = k => { i = k; cards.forEach((c, n) => c.classList.toggle('is-active', n === k)); };
    const start = () => { if (still) return; clearInterval(timer); timer = setInterval(() => show((i + 1) % cards.length), ms); };
    cards.forEach((c, n) => {
      c.addEventListener('mouseenter', () => { clearInterval(timer); show(n); });
      c.addEventListener('focusin', () => { clearInterval(timer); show(n); });
      c.addEventListener('click', () => { clearInterval(timer); show(n); });
    });
    group.addEventListener('mouseleave', start);
    show(0); start();
  });

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
    tabs.forEach(t => t.addEventListener('click', () => { sound('toggleOn'); select(t); }));
    const first = tabs.find(t => t.getAttribute('aria-selected') === 'true') || tabs[0];
    if (first) select(first, true);
  });

  /* ---------- Rotary dial: per-tenant call capacity ---------- */
  const dialBox = $('#rotaryContainer'), knob = $('#rotaryKnob');
  if (dialBox && knob) {
    const min = +dialBox.dataset.min || 0, max = +dialBox.dataset.max || 100;
    const cap = +dialBox.dataset.capacity || max;
    let angle = +dialBox.dataset.start || 120, dragging = false, dialReady = false;
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
      if (dialBox.dataset.last !== String(v)) { dialBox.dataset.last = String(v); if (dialReady) sound('tick'); }
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
    render(angle); dialReady = true;
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
    let held = false;
    sides.forEach(s => s.addEventListener('click', () => { held = true; sound(s === sides[0] ? 'toggleOff' : 'toggleOn'); set(s); }));
    if (sides[0]) set(sides[0], true);
    // optional auto-flip, stopped for good once the visitor picks a side
    const every = +rocker.dataset.rockerAuto;
    if (every && sides.length > 1) {
      let hovering = false;
      rocker.addEventListener('mouseenter', () => { hovering = true; });
      rocker.addEventListener('mouseleave', () => { hovering = false; });
      setInterval(() => {
        if (held || hovering || document.hidden) return;
        const cur = sides.findIndex(x => x.classList.contains('rocker-side-active'));
        set(sides[(cur + 1) % sides.length], true);
      }, every);
    }
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
        txt.textContent = btn.dataset.idle; st.textContent = 'Line idle · waiting for a call'; sound('toggleOff');
        return;
      }
      txt.textContent = 'Hang up'; sound('toggleOn');
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
  $$('[data-pad]').forEach(b => b.addEventListener('click', () => {
    sound('key');
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
    let dragging = false, pct = 0.35, sliderReady = false;
    function render() {
      thumb.style.left = `calc(${pct * 100}% - 16px)`;
      const load = Math.round(pct * max);
      const a = Math.min(load, cap), qq = Math.min(Math.max(0, load - cap), qmax), sh = Math.max(0, load - cap - qmax);
      if (label) label.textContent = `${load} jobs / sec offered`;
      if (acc) acc.textContent = a; if (q) q.textContent = qq; if (shed) shed.textContent = sh;
      if (note) note.textContent = sh ? 'Over capacity and queue full: new work is rejected with a retry hint, so the workers keep running.' :
        qq ? 'Above worker capacity: the extra work waits in the bounded queue.' : 'Within capacity: every job is admitted straight away.';
      sTrack.setAttribute('aria-valuenow', String(load));
      if (sliderReady) sound('tick');
    }
    const move = x => { const r = sTrack.getBoundingClientRect(); pct = Math.max(0, Math.min(1, (x - r.left) / r.width)); render(); };
    sTrack.addEventListener('pointerdown', e => { dragging = true; sTrack.setPointerCapture(e.pointerId); move(e.clientX); });
    sTrack.addEventListener('pointermove', e => { if (dragging) move(e.clientX); });
    sTrack.addEventListener('pointerup', () => { dragging = false; });
    sTrack.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') { pct = Math.min(1, pct + 0.04); render(); }
      if (e.key === 'ArrowLeft') { pct = Math.max(0, pct - 0.04); render(); }
    });
    render(); sliderReady = true;
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
    $('#breakerOk').addEventListener('click', () => { const was = state; call(true); sound(state === 'OPEN' ? 'error' : was === 'HALF_OPEN' ? 'success' : 'tap'); });
    $('#breakerFail').addEventListener('click', () => { call(false); sound(state === 'OPEN' ? 'error' : 'press'); });
    $('#breakerReset').addEventListener('click', () => { clearTimeout(timer); state = 'CLOSED'; fails = 0; if (log) log.innerHTML = ''; write('reset'); paint(); });
    // one click plays the full story: three failures, breaker opens, a call
    // fails fast, cool-down, half-open trial, recovered
    const runBtn = $('#breakerRun');
    let scenario = [];
    runBtn && runBtn.addEventListener('click', () => {
      scenario.forEach(clearTimeout); scenario = [];
      clearTimeout(timer); state = 'CLOSED'; fails = 0; if (log) log.innerHTML = ''; paint();
      sound('press');
      runBtn.disabled = true; runBtn.style.opacity = '.7';
      const at = (ms, fn) => scenario.push(setTimeout(fn, ms));
      at(300, () => { write('provider slows down: requests start failing'); });
      at(900, () => { call(false); sound('tick'); });
      at(1500, () => { call(false); sound('tick'); });
      at(2100, () => { call(false); sound('error'); });
      at(2900, () => { call(true); });
      at(2100 + COOL + 300, () => { call(true); sound('success'); });
      at(2100 + COOL + 900, () => { runBtn.disabled = false; runBtn.style.opacity = ''; });
    });
    paint();
  }

  /* ---------- Staged pipeline run ---------- */
  $$('[data-pipeline]').forEach(box => {
    const chips = $$('.stage-chip', box), out = $('[data-pipeline-out]', box);
    const run = failAt => {
      chips.forEach(c => c.classList.remove('is-done', 'is-fail'));
      let i = 0;
      const next = () => {
        if (i >= chips.length) { if (out) out.textContent = 'Rendered. Timing recorded for every stage.'; sound('success'); return; }
        const c = chips[i];
        if (i === failAt) {
          c.classList.add('is-fail'); sound('error');
          if (out) out.textContent = `${c.dataset.stage} failed — classified, retried on its own; earlier stages are kept, not redone.`;
          return;
        }
        c.classList.add('is-done'); sound('tick');
        if (out) out.textContent = `${c.dataset.stage} · ${c.dataset.ms} ms`;
        i++; setTimeout(next, 520);
      };
      next();
    };
    const go = $('[data-run]', box), bad = $('[data-run-fail]', box);
    go && go.addEventListener('click', () => { sound('press'); run(-1); });
    bad && bad.addEventListener('click', () => { sound('press'); run(1 + Math.floor(Math.random() * (chips.length - 1))); });
  });

  /* ---------- Contact details: copied on click, never printed in the page ----------
     Stored encoded so the address isn't sitting in the HTML for scrapers.
     To show the phone buttons, set phone to the base64 of the number. */
  const CONTACT = { email: 'YW5raXRAYWltc3lzdGVtLmlu', phone: '' };
  const contactValue = k => { try { return CONTACT[k] ? atob(CONTACT[k]) : ''; } catch (e) { return ''; } };
  $$('[data-contact]').forEach(btn => {
    const kind = btn.dataset.contact, value = contactValue(kind);
    if (!value) { btn.hidden = true; return; }
    btn.hidden = false;
    btn.addEventListener('click', () => {
      const label = kind === 'phone' ? 'Phone number' : 'Email address';
      const ok = () => { sound('success'); toast(label + ' copied'); };
      // the clipboard can be refused in some embedded views; then show it once
      const fail = () => toast(label + ': ' + value);
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(value).then(ok, fail); else fail();
    });
  });

  /* =================== Live automation ===================
     Each widget runs itself on a timer, only while it is on screen and the
     tab is visible, never for reduced-motion users, and pauses on hover.
     Automatic runs are silent; a visitor's own click gets a sound. */
  const stillMotion = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  function autoplay(el, ms, fn, opts) {
    let visible = false, hovering = false;
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(es => es.forEach(en => {
        const was = visible; visible = en.isIntersecting;
        if (visible && !was && opts && opts.onEnter) opts.onEnter();
      }), { threshold: 0.35 }).observe(el);
    } else visible = true;
    el.addEventListener('mouseenter', () => { hovering = true; });
    el.addEventListener('mouseleave', () => { hovering = false; });
    if (stillMotion) return;
    setInterval(() => { if (visible && !hovering && !document.hidden) fn(); }, ms);
  }
  const clock = () => new Date().toLocaleTimeString([], { hour12: false });

  /* Packet pipeline */
  $$('[data-packet]').forEach(box => {
    const nodes = $$('.pk-node', box), dot = $('.pk-dot', box), fill = $('.pk-fill', box), row = $('.pk-row', box);
    const status = $('[data-pk-status]', box), log = $('[data-pk-log]', box);
    const step = +box.dataset.step || 520;
    let running = false;
    const centre = n => n.offsetLeft + n.offsetWidth / 2;
    function write(msg) {
      if (status) status.textContent = msg;
      if (!log) return;
      const d = document.createElement('div');
      d.textContent = `${clock()}  ${msg}`;
      log.appendChild(d);
      while (log.children.length > 5) log.firstChild.remove();
    }
    function reset() {
      nodes.forEach(n => n.classList.remove('is-hit', 'is-done'));
      if (fill) fill.style.width = '0';
      if (dot) dot.classList.remove('on', 'ok');
    }
    function run(manual) {
      if (running) return;
      running = true; reset();
      if (manual) sound('press');
      if (dot && nodes[0]) { dot.style.transition = 'none'; dot.style.left = centre(nodes[0]) + 'px'; dot.offsetWidth; dot.style.transition = ''; dot.classList.add('on'); }
      nodes.forEach((n, i) => setTimeout(() => {
        if (i) { nodes[i - 1].classList.remove('is-hit'); nodes[i - 1].classList.add('is-done'); }
        n.classList.add('is-hit');
        if (dot) dot.style.left = centre(n) + 'px';
        if (fill && row) {
          const first = centre(nodes[0]), last = centre(nodes[nodes.length - 1]);
          fill.style.width = (((centre(n) - first) / (last - first)) * 100) + '%';
        }
        write(n.dataset.msg || n.textContent.trim());
        if (manual) sound('tick');
      }, i * step));
      setTimeout(() => {
        const lastN = nodes[nodes.length - 1];
        lastN.classList.remove('is-hit'); lastN.classList.add('is-done');
        if (dot) dot.classList.add('ok');
        write(box.dataset.done || 'Done');
        if (manual) sound('success');
        setTimeout(() => { running = false; reset(); if (status && box.dataset.idle) status.textContent = box.dataset.idle; }, 2200);
      }, nodes.length * step + 200);
    }
    const btn = $('[data-pk-run]', box);
    btn && btn.addEventListener('click', () => run(true));
    if (box.hasAttribute('data-pk-hover')) box.addEventListener('mouseenter', () => run(false));
    autoplay(box, +box.dataset.every || 6000, () => run(false), { onEnter: () => setTimeout(() => run(false), 400) });
  });

  /* Intent router */
  $$('[data-router]').forEach(box => {
    const dests = $$('.rt-dest', box), lines = $$('.rt-line', box);
    const utter = $('.rt-utter', box), status = $('[data-rt-status]', box);
    let k = -1;
    function go(n, manual) {
      k = n;
      dests.forEach((d, i) => d.classList.toggle('on', i === k));
      lines.forEach((l, i) => l.classList.toggle('on', i === k));
      const d = dests[k];
      if (utter) { utter.style.opacity = '0'; setTimeout(() => { utter.textContent = d.dataset.utter; utter.style.opacity = '1'; }, 380); }
      if (status) status.textContent = d.dataset.why;
      if (manual) sound('toggleOn');
    }
    dests.forEach((d, i) => d.addEventListener('click', () => go(i, true)));
    const btn = $('[data-rt-next]', box);
    btn && btn.addEventListener('click', () => go((k + 1) % dests.length, true));
    go(0);
    autoplay(box, +box.dataset.every || 3400, () => go((k + 1) % dests.length));
  });

  /* Scaling tiers */
  $$('[data-scale]').forEach(box => {
    const tiers = $$('[data-tier]', box), pills = $$('.sc-pill', box), badge = $('[data-sc-badge]', box);
    let k = 0;
    function go(n, manual) {
      k = n;
      tiers.forEach((t, i) => { t.hidden = i !== k; });
      pills.forEach((p, i) => p.classList.toggle('on', i === k));
      if (badge) badge.textContent = tiers[k].dataset.tier;
      if (manual) sound('toggleOn');
    }
    pills.forEach((p, i) => p.addEventListener('click', () => go(i, true)));
    go(0);
    autoplay(box, +box.dataset.every || 3800, () => go((k + 1) % tiers.length));
  });

  /* Laser circuit: steps through its pins on its own */
  $$('[data-circuit][data-auto]').forEach(box => {
    const pins = $$('[data-pin]', box), label = $('[data-circuit-label]', box), traces = $$('.laser-trace', box);
    let k = -1;
    autoplay(box, +box.dataset.auto || 1500, () => {
      pins.forEach(p => p.classList.remove('btn-pressed-in'));
      k = (k + 1) % pins.length;
      pins[k].classList.add('btn-pressed-in');
      if (label) label.textContent = pins[k].dataset.pin;
      traces.forEach(t => t.classList.add('laser-trace-active'));
    });
  });

  /* ---------- Copy buttons ---------- */
  $$('[data-copy]').forEach(b => b.addEventListener('click', () => {
    const done = () => { sound('success'); toast('Copied'); };
    if (navigator.clipboard) navigator.clipboard.writeText(b.dataset.copy).then(done, done); else done();
  }));

  /* ---------- Contact form → prefilled email ---------- */
  const form = $('#contactForm');
  if (form) form.addEventListener('submit', e => {
    e.preventDefault();
    const f = new FormData(form);
    const subject = `[AIM] ${f.get('scope')} — ${f.get('org')}`;
    const body = [`Name: ${f.get('name')}`, `Organisation: ${f.get('org')}`, `Email: ${f.get('email')}`, `Scope: ${f.get('scope')}`, `Timeline: ${f.get('timeline')}`, '', f.get('message')].join('\n');
    window.location.href = `mailto:${contactValue('email')}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    sound('success');
    toast('Opening your email app with the brief filled in');
  });

  /* ---------- Boot ---------- */
  $$('[data-theme-toggle]').forEach(b => b.addEventListener('click', toggleTheme));
  $$('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
  paintThemeButtons();
  paintSoundButtons();
  const settle = () => placePill(activeLink());
  window.addEventListener('resize', settle);
  window.addEventListener('load', settle);
  setTimeout(settle, 60);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(settle);
})();
