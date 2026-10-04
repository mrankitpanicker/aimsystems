/**
 * aimsystem.in analytics and leads — https://aimsystem.in/api/track, /api/lead
 *
 * Writes to D1 (aimsystem-analytics, schema.sql). Consent is decided in the
 * browser and re-applied here: without analytics consent nothing that
 * identifies a person (session, visitor id, IP) is stored, only an anonymous
 * row. Leads are always stored because the visitor submits them on purpose,
 * and each new lead is emailed straight away through Cloudflare Email Routing.
 * Location comes from Cloudflare (request.cf), never from the browser.
 */
import { EmailMessage } from 'cloudflare:email';

const ALERT_FROM = 'leads@aimsystem.in';
const ALERT_TO = 'mr.ankitpanicker@gmail.com'; // must stay a verified Email Routing destination
const ALLOWED_ORIGINS = ['https://aimsystem.in', 'https://www.aimsystem.in', 'https://aimsystems.web.app'];
const EVENTS = new Set(['pageview', 'contact_click', 'whatsapp_click', 'email_click']);
const MAX_BODY = 16 * 1024;
const BOT_RE = /bot|crawl|spider|slurp|preview|headless|lighthouse|monitor|curl|wget|python-requests|httpclient/i;

const str = (v, n = 300) => (v == null || v === '' ? null : String(v).slice(0, n));
const device = ua => (/ipad|tablet/i.test(ua) ? 'tablet' : /mobi|android|iphone/i.test(ua) ? 'mobile' : 'desktop');

function cors(origin) {
  const h = { 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Vary': 'Origin' };
  if (ALLOWED_ORIGINS.includes(origin)) h['Access-Control-Allow-Origin'] = origin;
  return h;
}
const json = (body, status, origin) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', ...cors(origin) } });

function where(request) {
  const cf = request.cf || {};
  return {
    country: str(cf.country, 8), region: str(cf.region, 80), city: str(cf.city, 80), postal: str(cf.postalCode, 20),
    org: str(cf.asOrganization, 120), asn: Number.isFinite(cf.asn) ? cf.asn : null, colo: str(cf.colo, 8),
  };
}

async function readBody(request) {
  const text = await request.text();
  if (text.length > MAX_BODY) throw new Error('too-large');
  return JSON.parse(text || '{}');
}

async function track(request, env, b) {
  const event = EVENTS.has(b.event) ? b.event : null;
  if (!event) return 'bad-event';
  const consent = b.consent === true ? 1 : 0;
  const ua = request.headers.get('User-Agent') || '';
  const w = where(request);
  await env.DB.prepare(
    `INSERT INTO events (event, consent, session_id, visitor_id, path, title, service, target, referrer,
      utm_source, utm_medium, utm_campaign, utm_term, utm_content, screen, viewport, lang, timezone, ip,
      country, region, city, postal, org, asn, colo, device, user_agent, is_bot, created_at)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
  ).bind(
    event, consent,
    consent ? str(b.session_id, 64) : null, consent ? str(b.visitor_id, 64) : null,
    str(b.path, 200), str(b.title, 200), str(b.service, 200), str(b.target, 300),
    consent ? str(b.referrer, 300) : str((b.referrer || '').split('/').slice(0, 3).join('/'), 120),
    str(b.utm_source, 100), str(b.utm_medium, 100), str(b.utm_campaign, 150), str(b.utm_term, 150), str(b.utm_content, 150),
    str(b.screen, 20), str(b.viewport, 20), str(b.lang, 20), str(b.timezone, 60),
    consent ? str(request.headers.get('CF-Connecting-IP'), 64) : null,
    w.country, w.region, w.city, consent ? w.postal : null, w.org, w.asn, w.colo,
    device(ua), consent ? str(ua, 300) : null, BOT_RE.test(ua) ? 1 : 0, new Date().toISOString()
  ).run();
  return null;
}

async function lead(request, env, b) {
  if (b.website) return {}; // honeypot: bots fill every field; pretend success, store nothing
  const email = str(b.email, 200), name = str(b.name, 120), message = str(b.message, 4000);
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || !name || !message) return { error: 'missing-fields' };
  const consent = b.consent === true ? 1 : 0;
  const ua = request.headers.get('User-Agent') || '';
  const w = where(request);
  let journey = null;
  if (consent && Array.isArray(b.journey)) journey = JSON.stringify(b.journey.slice(-30).map(p => str(p, 200)));
  const r = {
    via: str(b.via, 16), page: str(b.page, 120), path: str(b.path, 200), service: str(b.service, 200), region_choice: str(b.region_choice, 8),
    need: str(b.need, 120), timeline: str(b.timeline, 60), name, company: str(b.company, 160), email, message,
    consent, journey, landing_page: consent ? str(b.landing_page, 200) : null, first_referrer: consent ? str(b.first_referrer, 300) : null,
    utm_source: str(b.utm_source, 100), utm_medium: str(b.utm_medium, 100), utm_campaign: str(b.utm_campaign, 150),
    timezone: str(b.timezone, 60), lang: str(b.lang, 20), device: device(ua), ...w,
  };
  await env.DB.prepare(
    `INSERT INTO leads (created_at, via, page, path, service, region_choice, need, timeline, name, company, email, message,
      consent, session_id, visitor_id, journey, landing_page, first_referrer, utm_source, utm_medium, utm_campaign,
      ip, country, region, city, org, timezone, lang, device, user_agent)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
  ).bind(
    new Date().toISOString(), r.via, r.page, r.path, r.service, r.region_choice, r.need, r.timeline, name, r.company, email, message,
    consent, consent ? str(b.session_id, 64) : null, consent ? str(b.visitor_id, 64) : null, journey,
    r.landing_page, r.first_referrer, r.utm_source, r.utm_medium, r.utm_campaign,
    consent ? str(request.headers.get('CF-Connecting-IP'), 64) : null,
    w.country, w.region, w.city, w.org, r.timezone, r.lang, r.device, str(ua, 300)
  ).run();
  return { record: r };
}

// ---- Instant alert email ----
const oneLine = v => String(v == null ? '' : v).replace(/[\r\n]+/g, ' ').trim();
const b64 = s => { const bytes = new TextEncoder().encode(s); let bin = ''; for (const x of bytes) bin += String.fromCharCode(x); return btoa(bin); };
const encWord = s => '=?UTF-8?B?' + b64(s) + '?=';

function alertEmail(r) {
  const subject = '[AIM System] New lead — ' + oneLine(r.service || r.need || 'Enquiry') + ' — ' + oneLine(r.company || r.name);
  const place = [r.city, r.region, r.country].filter(Boolean).join(', ');
  let journey = '';
  try { journey = r.journey ? JSON.parse(r.journey).join(' → ') : ''; } catch (e) {}
  const lines = [
    '[AIM System] New project enquiry', '',
    'Name:      ' + oneLine(r.name),
    'Company:   ' + oneLine(r.company),
    'Email:     ' + oneLine(r.email),
    'Need:      ' + oneLine(r.need),
    'Timeline:  ' + oneLine(r.timeline),
    '', 'Came from', '---------',
    'Page:      ' + oneLine(r.page) + (r.path ? ' (aimsystem.in' + oneLine(r.path) + ')' : ''),
    r.service ? 'Service:   ' + oneLine(r.service) : null,
    r.region_choice ? 'Region:    ' + oneLine(r.region_choice) : null,
    'Sent via:  ' + oneLine(r.via),
    'Location:  ' + (place || 'unknown') + (r.org ? ' · ' + oneLine(r.org) : ''),
    r.timezone ? 'Time zone: ' + oneLine(r.timezone) : null,
    'Device:    ' + oneLine(r.device),
    (r.utm_source || r.utm_campaign) ? 'Campaign:  ' + [r.utm_source, r.utm_campaign].filter(Boolean).map(oneLine).join(' / ') : null,
    r.consent ? 'Journey:   ' + (journey || '-') : 'Analytics: declined (no journey recorded)',
    r.consent && r.landing_page ? 'Landing:   ' + oneLine(r.landing_page) + ' from ' + oneLine(r.first_referrer || '(direct)') : null,
    '', 'Message', '-------', String(r.message || ''), '',
    'Reply to this email to answer ' + oneLine(r.name) + ' directly.',
  ].filter(x => x !== null);
  const text = lines.join('\n').replace(/\r?\n/g, '\r\n');
  const replyTo = /^[^@\s<>"]+@[^@\s<>"]+$/.test(r.email) ? r.email : ALERT_FROM;
  const body = b64(text).replace(/.{1,76}/g, '$&\r\n');
  const raw = [
    'From: ' + encWord('AIM System Leads') + ' <' + ALERT_FROM + '>',
    'To: <' + ALERT_TO + '>',
    'Reply-To: <' + replyTo + '>',
    'Subject: ' + encWord(subject),
    'Date: ' + new Date().toUTCString(),
    'Message-ID: <' + crypto.randomUUID() + '@aimsystem.in>',
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    body,
  ].join('\r\n');
  return new EmailMessage(ALERT_FROM, ALERT_TO, raw);
}

export default {
  async fetch(request, env, ctx) {
    const origin = request.headers.get('Origin') || '';
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors(origin) });
    if (request.method !== 'POST') return json({ ok: false, error: 'method-not-allowed' }, 405, origin);
    if (!ALLOWED_ORIGINS.includes(origin)) return json({ ok: false, error: 'origin-not-allowed' }, 403, origin);
    let body;
    try { body = await readBody(request); } catch (e) { return json({ ok: false, error: 'bad-body' }, 400, origin); }
    const path = new URL(request.url).pathname.replace(/\/+$/, '');
    try {
      let err = null;
      if (path === '/api/track') err = await track(request, env, body);
      else if (path === '/api/lead') {
        const res = await lead(request, env, body);
        err = res.error || null;
        if (res.record && env.ALERT) {
          ctx.waitUntil(env.ALERT.send(alertEmail(res.record)).catch(e => console.error('alert failed', e && e.message)));
        }
      } else err = 'not-found';
      if (err) return json({ ok: false, error: err }, err === 'not-found' ? 404 : 400, origin);
      return json({ ok: true }, 200, origin);
    } catch (e) {
      console.error(path, e && e.message);
      return json({ ok: false, error: 'server-error' }, 500, origin);
    }
  },

  // Retention promised on /privacy: analytics events older than 13 months are deleted.
  async scheduled(event, env) {
    await env.DB.prepare("DELETE FROM events WHERE created_at < strftime('%Y-%m-%dT%H:%M:%fZ', 'now', '-13 months')").run();
  },
};
