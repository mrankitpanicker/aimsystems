/**
 * CV upload endpoint for https://aimsystem.in/jobs
 *
 * The browser never sees a storage credential. It POSTs the file here; this
 * Worker validates it and writes to R2 through a binding. That is the whole
 * point of the indirection — an R2 key in client-side JavaScript would be as
 * public as the file it protects.
 *
 * Validation is done here rather than in the page because client-side checks
 * are advisory: anyone can POST directly to this endpoint, so size and type
 * have to be enforced somewhere the applicant cannot edit.
 */

const MAX_BYTES = 10 * 1024 * 1024;          // keep in step with the form's stated limit
const ALLOWED_ORIGINS = [
  'https://aimsystem.in',
  'https://www.aimsystem.in',
  'https://aimsystems.web.app',
];

function corsHeaders(origin) {
  // Echo the origin only when it is one of ours; otherwise send none, which
  // makes the browser reject the response.
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : '';
  const h = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Submission-Id, X-File-Name',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };
  if (allowed) h['Access-Control-Allow-Origin'] = allowed;
  return h;
}

const json = (body, status, origin) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
  });

// Submission ids are minted by the page as AIM-<base36>-<4 chars>. Anything
// else is rejected so the key space cannot be steered by the caller.
const SUBMISSION_RE = /^AIM-[A-Z0-9]{6,14}-[A-Z0-9]{4}$/;

function safeName(name) {
  return String(name || 'cv.pdf')
    .replace(/[^\w.\-]+/g, '_')
    .replace(/_{2,}/g, '_')
    .slice(-80);
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }
    if (request.method !== 'POST') {
      return json({ ok: false, error: 'method-not-allowed' }, 405, origin);
    }
    if (origin && !ALLOWED_ORIGINS.includes(origin)) {
      return json({ ok: false, error: 'origin-not-allowed' }, 403, origin);
    }

    const submissionId = request.headers.get('X-Submission-Id') || '';
    if (!SUBMISSION_RE.test(submissionId)) {
      return json({ ok: false, error: 'bad-submission-id' }, 400, origin);
    }

    // Reject on the declared length before reading anything, so an oversized
    // body is not streamed into the Worker at all.
    const declared = Number(request.headers.get('Content-Length') || 0);
    if (declared > MAX_BYTES) {
      return json({ ok: false, error: 'too-large' }, 413, origin);
    }

    const buf = await request.arrayBuffer();
    if (buf.byteLength === 0) return json({ ok: false, error: 'empty' }, 400, origin);
    if (buf.byteLength > MAX_BYTES) return json({ ok: false, error: 'too-large' }, 413, origin);

    // Trust the bytes, not the declared content type: a PDF starts with %PDF-.
    const head = new Uint8Array(buf.slice(0, 5));
    const isPdf = head[0] === 0x25 && head[1] === 0x50 && head[2] === 0x44 &&
                  head[3] === 0x46 && head[4] === 0x2d;
    if (!isPdf) return json({ ok: false, error: 'not-a-pdf' }, 415, origin);

    const key = `resumes/${submissionId}_${safeName(request.headers.get('X-File-Name'))}`;

    try {
      await env.CVS.put(key, buf, {
        httpMetadata: { contentType: 'application/pdf' },
        customMetadata: {
          submissionId,
          receivedAt: new Date().toISOString(),
          // Useful when triaging a suspicious upload; not personal data beyond
          // what the request already carries.
          country: request.cf?.country || 'unknown',
        },
      });
    } catch (err) {
      return json({ ok: false, error: 'store-failed' }, 502, origin);
    }

    // The object is never served publicly. Retrieval is via the R2 dashboard or
    // an authenticated tool, matching the write-only posture of the Firestore
    // rules: an applicant can add their CV and nobody can read it back.
    return json({ ok: true, key, bytes: buf.byteLength }, 200, origin);
  },
};
