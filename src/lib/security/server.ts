import 'server-only';
import { createHash } from 'node:crypto';
import { createMemoryRateLimiter, type RateLimiter, type RateLimitOptions } from './rate-limit';

const limiters = new Map<string, RateLimiter>();

/** Returns a memoised in-memory limiter for the given prefix. */
export function getRateLimiter(options: RateLimitOptions): RateLimiter {
  const existing = limiters.get(options.prefix);
  if (existing) return existing;
  const limiter = createMemoryRateLimiter(options);
  limiters.set(options.prefix, limiter);
  return limiter;
}

/**
 * Client identifier for rate limiting. Uses the platform-set forwarding header
 * (trusted on Vercel/Netlify/Cloudflare) and hashes it so raw IPs are never stored.
 */
export function clientKey(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  const ip = forwarded || headers.get('x-real-ip') || headers.get('cf-connecting-ip') || 'unknown';
  return createHash('sha256').update(ip).digest('hex').slice(0, 24);
}

/** CSRF guard for state-changing Route Handlers: the Origin must match the Host. */
export function isSameOrigin(headers: Headers): boolean {
  const origin = headers.get('origin');
  const host = headers.get('x-forwarded-host') ?? headers.get('host');
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
