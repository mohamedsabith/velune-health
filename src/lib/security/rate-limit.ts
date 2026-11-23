/**
 * Fixed-window rate limiting kept in memory. On serverless hosts each instance has
 * its own window, so this is a best-effort guard against form spam rather than a
 * hard global limit. No external service is needed.
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
