import { renderRobotsTxt } from '@/lib/ai/robots';
import { env } from '@/lib/env/server';

export const dynamic = 'force-static';

export function GET() {
  return new Response(renderRobotsTxt({ siteUrl: env.siteUrl, indexable: env.indexable }), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
