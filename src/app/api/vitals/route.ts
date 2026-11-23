import { z } from 'zod';
import { clientKey, getRateLimiter, isSameOrigin } from '@/lib/security/server';

const metric = z.object({
  name: z.enum(['CLS', 'FCP', 'INP', 'LCP', 'TTFB', 'FID']),
  value: z.number().finite().nonnegative(),
  rating: z.enum(['good', 'needs-improvement', 'poor']).optional(),
  id: z.string().max(80),
  navigationType: z.string().max(40).optional(),
  path: z.string().max(200).regex(/^\//),
});

const limiter = () => getRateLimiter({ prefix: 'vitals', limit: 120, windowMs: 60_000 });

/**
 * Core Web Vitals collection endpoint (field data from real visitors).
 * Logs to the platform's function logs; forward to an analytics store as needed.
 */
export async function POST(request: Request) {
  if (!isSameOrigin(request.headers)) return new Response(null, { status: 403 });
  const length = Number(request.headers.get('content-length') ?? 0);
  if (length > 2048) return new Response(null, { status: 413 });

  const rate = await limiter().limit(clientKey(request.headers));
  if (!rate.success) return new Response(null, { status: 429 });

  let payload: unknown;
  try {
    payload = JSON.parse(await request.text());
  } catch {
    return new Response(null, { status: 400 });
  }
  const parsed = metric.safeParse(payload);
  if (!parsed.success) return new Response(null, { status: 400 });

  console.info('[web-vitals]', JSON.stringify(parsed.data));
  return new Response(null, { status: 204 });
}
