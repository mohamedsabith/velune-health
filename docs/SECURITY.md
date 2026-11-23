# Security

## Headers (every response, `next.config.ts` → `src/lib/security/headers.ts`)

- **Content-Security-Policy**: `default-src 'self'`; scripts from self only (no third-party origins, no eval); images from self, `data:` and `blob:`; `connect-src 'self'`; `object-src 'none'`; `frame-src 'none'`; `frame-ancestors 'none'`; `form-action 'self'`; `base-uri 'self'`; `upgrade-insecure-requests` on HTTPS.
- **Strict-Transport-Security** (2 years, includeSubDomains, preload) on HTTPS origins.
- `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY`, `Cross-Origin-Opener-Policy: same-origin`, a restrictive `Permissions-Policy`, and no `X-Powered-By`.
- Preview deployments add `X-Robots-Tag: noindex, nofollow, noarchive`.

### Why `script-src` includes `'unsafe-inline'`

Pages are statically generated, so per-request nonces are impossible without making every page dynamic. Subresource Integrity (`experimental.sri`) covers every external chunk but not the inline RSC data scripts Next.js writes into each page, and `script-src 'self'` alone blocks hydration. Everything else stays closed: no foreign script origins, no eval (Zod runs jitless), SRI on external chunks, and no user-generated HTML anywhere.

To move to nonces: generate one in `src/proxy.ts`, widen its matcher to all page routes, set the CSP there and call `await connection()` in the pages (they become dynamic). See `node_modules/next/dist/docs/01-app/02-guides/content-security-policy.md`.

## Inputs

| Surface                     | Protections                                                                                                                                                                 |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Booking Server Action       | Encrypted action IDs and Next's Origin/Host check; Zod validation shared with the browser; consent required; honeypot; slot re-checked on the server; 6 requests per 10 min |
| Contact Server Action       | Zod validation, honeypot, 5 requests per 10 min                                                                                                                             |
| `GET /api/availability`     | Zod query validation (400), 120 requests per minute (429 + `Retry-After`), `no-store`                                                                                       |
| `POST /api/vitals`          | Same-origin check (403), 2 KB body limit (413), Zod schema (400), 120 per minute                                                                                            |
| JSON-LD                     | Escaped (`<`, `>`, `&`, U+2028/2029) so data cannot break out of the script element                                                                                         |
| WebMCP tools and form hints | Read-only, or pre-fill only. No tool or annotated form submits on its own; a person confirms every booking and message                                                      |

Rate-limit keys are a SHA-256 hash of the platform-provided client IP; raw IPs are never stored. Limits are per instance by default; set the Upstash variables for shared limits. If Redis is unreachable the limiter falls back to memory.

## Health information

The booking and contact forms ask people not to include detailed medical information, and the reason field is optional and capped at 500 characters. Before a real launch, decide where requests are stored, who can read them and for how long, and update `/privacy` to match.

## Secrets and environment

Validated at build (`src/lib/env/schema.ts`). Server-only modules import `server-only`, so importing them into a Client Component fails the build. Booking webhooks are signed with HMAC-SHA256 (`X-Velune-Signature: sha256=…`).

## Supply chain

CI runs `npm audit --omit=dev --audit-level=high`, CodeQL (`codeql.yml`) and the full lint, type, unit and browser test suite on every pull request.
