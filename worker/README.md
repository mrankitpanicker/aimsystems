# CV upload Worker

Receives the CV from `https://aimsystem.in/jobs` and writes it to R2. The page
holds no storage credential; this Worker owns the bucket binding.

Everything here is free-tier: Workers allows 100,000 requests/day and R2 allows
10 GB of storage with 1M writes/month and no egress fees. A jobs page uses a
rounding error of that.

## Why it exists

The form previously uploaded straight to Firebase Storage. Two problems:

1. Cloud Storage for Firebase needs a paid plan on new projects, while Firestore
   does not — so the free half of the flow was blocked by the paid half.
2. The cross-origin upload failed CORS preflight, and the Firebase SDK retries
   that forever, which hung the submit button with nothing saved.

Serving the endpoint from `aimsystem.in` itself makes the upload same-origin, so
there is no preflight to fail.

## Setup

Run once, in this directory.

```bash
npx wrangler login                      # opens a browser
npx wrangler r2 bucket create aim-cvs
npx wrangler deploy
```

### DNS: the record must be proxied

`aimsystem.in` currently resolves straight to Firebase Hosting (199.36.158.100)
— DNS-only, the grey cloud. A Worker route cannot intercept a request that never
reaches Cloudflare.

In the Cloudflare dashboard, set the `aimsystem.in` A record to **Proxied**
(orange cloud), and SSL/TLS mode to **Full (strict)**. Firebase serves a valid
certificate, so strict verification passes.

`aimstudio.co.in` already runs proxied in front of Firebase, so this is a proven
arrangement on this account rather than a new risk.

Only `aimsystem.in/api/cv` routes to the Worker. Every other path continues to
be served by Firebase Hosting untouched.

## Behaviour

`POST /api/cv`

| Header | Purpose |
|---|---|
| `X-Submission-Id` | Must match `AIM-<base36>-<4>`; forms the object key |
| `X-File-Name` | Original filename, sanitised before use |

Body is the raw PDF. Responses are JSON: `{ ok: true, key, bytes }` or
`{ ok: false, error }` with 400/403/413/415/502.

Validation happens here rather than in the page because the page's checks are
advisory — anyone can POST to this endpoint directly:

- rejects on declared `Content-Length` before reading the body
- re-checks actual byte length (10 MB cap)
- verifies the file really starts with `%PDF-` rather than trusting the
  declared content type
- rejects submission ids that do not match the expected shape, so the key space
  cannot be steered by the caller

## Reading the CVs

Objects are never publicly readable. There is no GET route. Retrieve them from
the R2 dashboard or with an authenticated tool:

```bash
npx wrangler r2 object get aim-cvs/resumes/<key> --file cv.pdf
```

This matches the Firestore rules, which are write-only for the same reason: an
applicant may add their own data and nobody can read it back out.

## If the Worker is not deployed

`/api/cv` returns 404, the upload fails fast, and the application is still
written to Firestore with `resumeStatus: "unavailable"`. The confirmation then
asks the candidate to email their CV quoting their reference. Nothing is lost
and nothing hangs.
