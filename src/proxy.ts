import { NextResponse, type NextRequest } from 'next/server';
import { prefersMarkdown } from '@/lib/ai/negotiation';

/**
 * Content negotiation for AI agents: a page request that prefers `text/markdown`
 * is rewritten to that page's Markdown rendition under /md. Normal browser
 * requests pass straight through.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (prefersMarkdown(request.headers.get('accept'))) {
    const target = pathname === '/' ? '/md' : `/md${pathname}`;
    return NextResponse.rewrite(new URL(target, request.url));
  }
  return NextResponse.next();
}

export const config = {
  // Pages only: skip assets, API routes, the Markdown routes themselves and metadata files.
  matcher: ['/((?!_next/|api/|md|scripts/|.*\\.(?:txt|xml|json|svg|png|jpg|webp|avif|ico|woff2?)$).*)'],
};
