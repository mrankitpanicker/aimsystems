-- aimsystem.in analytics and leads (D1: aimsystem-analytics)
-- Consent rules, enforced by the Worker:
--   without analytics consent: anonymous rows only (no session_id, visitor_id or ip)
--   with consent: session_id, visitor_id and ip are stored
--   leads are always stored: the visitor submits them to us on purpose

CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event TEXT NOT NULL,              -- pageview | contact_click | whatsapp_click | email_click
  consent INTEGER NOT NULL DEFAULT 0,
  session_id TEXT,
  visitor_id TEXT,
  path TEXT,
  title TEXT,
  service TEXT,                     -- contact_click: card or section the visitor clicked from
  target TEXT,                      -- link clicked, for click events
  referrer TEXT,
  utm_source TEXT, utm_medium TEXT, utm_campaign TEXT, utm_term TEXT, utm_content TEXT,
  screen TEXT, viewport TEXT, lang TEXT, timezone TEXT,
  ip TEXT,
  country TEXT, region TEXT, city TEXT, postal TEXT, org TEXT, asn INTEGER, colo TEXT,
  device TEXT,                      -- mobile | tablet | desktop
  user_agent TEXT,
  is_bot INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL          -- UTC ISO-8601
);
CREATE INDEX IF NOT EXISTS idx_events_created ON events (created_at);
CREATE INDEX IF NOT EXISTS idx_events_event ON events (event, created_at);
CREATE INDEX IF NOT EXISTS idx_events_visitor ON events (visitor_id, created_at);

CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL,
  tag TEXT NOT NULL DEFAULT 'AIM System',
  via TEXT,                         -- whatsapp | email
  page TEXT, path TEXT, service TEXT, region_choice TEXT,
  need TEXT, timeline TEXT,
  role TEXT,                        -- "What best describes you?" (optional)
  budget TEXT,                      -- budget range (optional)
  intent TEXT,                      -- e.g. architecture-review, from /contact?intent=
  name TEXT, company TEXT, email TEXT, message TEXT,
  consent INTEGER NOT NULL DEFAULT 0,
  session_id TEXT, visitor_id TEXT,
  journey TEXT,                     -- JSON list of pages this session (consent only)
  landing_page TEXT, first_referrer TEXT,
  utm_source TEXT, utm_medium TEXT, utm_campaign TEXT,
  ip TEXT,
  country TEXT, region TEXT, city TEXT, org TEXT, timezone TEXT, lang TEXT,
  device TEXT, user_agent TEXT
);
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads (created_at);

-- Migration for databases created before role/budget/intent existed (applied to aimsystem-analytics):
--   ALTER TABLE leads ADD COLUMN role TEXT;
--   ALTER TABLE leads ADD COLUMN budget TEXT;
--   ALTER TABLE leads ADD COLUMN intent TEXT;
