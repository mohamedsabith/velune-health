import { describe, expect, it } from 'vitest';
import { createMemoryRateLimiter } from '@/lib/security/rate-limit';

describe('rate limiter', () => {
  it('allows up to the limit in a window, then blocks until the window resets', async () => {
    let t = 0;
    const limiter = createMemoryRateLimiter({ prefix: 'booking', limit: 2, windowMs: 1000 }, () => t);
    expect((await limiter.limit('a')).success).toBe(true);
    expect((await limiter.limit('a')).success).toBe(true);
    expect((await limiter.limit('a')).success).toBe(false);
    expect((await limiter.limit('b')).success).toBe(true);
    t = 1000;
    expect((await limiter.limit('a')).success).toBe(true);
  });
});
