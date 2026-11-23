import { markdownFor, markdownPaths } from '@/lib/ai/markdown';
import { env } from '@/lib/env/server';

export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  return markdownPaths().map((p) => ({ path: p === '/' ? [] : p.slice(1).split('/') }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ path?: string[] }> }) {
  const { path = [] } = await params;
  const body = markdownFor(`/${path.join('/')}`, env.siteUrl);
  if (!body) return new Response('Not found', { status: 404 });
  return new Response(body, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8', Vary: 'Accept', 'X-Robots-Tag': 'noindex' },
  });
}
