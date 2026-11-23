/**
 * Security headers applied to every response from `next.config.ts`.
 *
 * Pages are statically generated, so a per-request nonce is not available
 * (nonces force dynamic rendering of every page). Verified in a real browser:
 * Next.js SRI (`experimental.sri`) adds integrity hashes to external chunks but
 * NOT to the inline RSC flight-data scripts, so `script-src 'self'` alone blocks
 * hydration. The policy therefore allows inline scripts while everything else
 * stays locked down: no third-party script origins, no eval, no plugins, no
 * framing, no foreign form targets, SRI on every external chunk. All rendered
 * content comes from the repository and React escapes output, so there is no
 * user-generated HTML to inject into. See docs/SECURITY.md for the nonce option.
 * Inline styles stay allowed because React, next/image, GSAP and Motion write
 * style attributes; style injection cannot execute script.
 */

export interface SecurityHeaderOptions {
  isDev: boolean;
  /** Add `upgrade-insecure-requests` (only when the canonical origin is HTTPS). */
  httpsOrigin: boolean;
  /** Deployment is a preview / non-indexable build. */
  indexable: boolean;
}

export function buildContentSecurityPolicy({ isDev, httpsOrigin }: SecurityHeaderOptions) {
  const directives: Record<string, string[]> = {
    'default-src': ["'self'"],
    // Dev needs eval + inline for React Refresh / Turbopack HMR.
    'script-src': ["'self'", "'unsafe-inline'", ...(isDev ? ["'unsafe-eval'"] : [])],
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", 'data:', 'blob:'],
    'font-src': ["'self'"],
    'connect-src': ["'self'", ...(isDev ? ['ws:', 'wss:'] : [])],
    'media-src': ["'self'"],
    'worker-src': ["'self'", 'blob:'],
    'frame-src': ["'none'"],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'none'"],
    'manifest-src': ["'self'"],
  };

  const policy = Object.entries(directives).map(([name, values]) => `${name} ${values.join(' ')}`);
  if (httpsOrigin && !isDev) policy.push('upgrade-insecure-requests');
  return policy.join('; ');
}

export function buildSecurityHeaders(options: SecurityHeaderOptions) {
  const headers = [
    { key: 'Content-Security-Policy', value: buildContentSecurityPolicy(options) },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
    {
      key: 'Permissions-Policy',
      value:
        'camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=(), interest-cohort=()',
    },
    { key: 'X-DNS-Prefetch-Control', value: 'on' },
  ];

  if (options.httpsOrigin && !options.isDev) {
    headers.push({ key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' });
  }
  if (!options.indexable) {
    headers.push({ key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' });
  }
  return headers;
}
