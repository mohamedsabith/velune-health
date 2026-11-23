/**
 * Fixed-window rate limiting.
 *
 * - `memory`: per-instance Map. On serverless hosts each instance has its own
 *   window, so this is a best-effort guard rather than a hard global limit.
 * - `upstash`: shared counter via the Upstash Redis REST API (works on the free tier),
 *   no SDK dependency. Falls back to memory if Redis is unreachable.
 */

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
}

export interface RateLimiter {
  limit(key: string): Promise<RateLimitResult>;
}

export interface RateLimitOptions {
  /** Requests allowed per window. */
  limit: number;
  windowMs: number;
  prefix: string;
}

export function createMemoryRateLimiter(
  { limit, windowMs, prefix }: RateLimitOptions,
  now: () => number = Date.now,
): RateLimiter {
  const buckets = new Map<string, { count: number; resetAt: number }>();
  const MAX_KEYS = 10_000;

  return {
    async limit(key) {
      const t = now();
      const id = `${prefix}:${key}`;
      let bucket = buckets.get(id);
      if (!bucket || bucket.resetAt <= t) {
        if (buckets.size >= MAX_KEYS) {
          for (const [k, b] of buckets) if (b.resetAt <= t) buckets.delete(k);
          if (buckets.size >= MAX_KEYS) buckets.clear();
        }
        bucket = { count: 0, resetAt: t + windowMs };
        buckets.set(id, bucket);
      }
      bucket.count += 1;
      return {
        success: bucket.count <= limit,
        limit,
        remaining: Math.max(0, limit - bucket.count),
        resetAt: bucket.resetAt,
      };
    },
  };
}

export function createUpstashRateLimiter(
  options: RateLimitOptions & { url: string; token: string },
  fallback: RateLimiter = createMemoryRateLimiter(options),
  fetcher: typeof fetch = fetch,
): RateLimiter {
  const { url, token, limit, windowMs, prefix } = options;
  return {
    async limit(key) {
      const windowStart = Math.floor(Date.now() / windowMs) * windowMs;
      const redisKey = `rl:${prefix}:${key}:${windowStart}`;
      try {
        const response = await fetcher(`${url.replace(/\/$/, '')}/pipeline`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify([
            ['INCR', redisKey],
            ['PEXPIRE', redisKey, String(windowMs)],
          ]),
          signal: AbortSignal.timeout(1500),
          cache: 'no-store',
        });
        if (!response.ok) throw new Error(`Upstash responded ${response.status}`);
        const [incr] = (await response.json()) as [{ result?: number; error?: string }];
        if (typeof incr?.result !== 'number') throw new Error(incr?.error ?? 'Unexpected Upstash response');
        return {
          success: incr.result <= limit,
          limit,
          remaining: Math.max(0, limit - incr.result),
          resetAt: windowStart + windowMs,
        };
      } catch (error) {
        console.warn('[rate-limit] Upstash unavailable, using in-memory limiter:', (error as Error).message);
        return fallback.limit(key);
      }
    },
  };
}
