import { renderLlmsFullTxt } from '@/lib/ai/llms';
import { env } from '@/lib/env/server';

export const dynamic = 'force-static';

export function GET() {
  return new Response(renderLlmsFullTxt(env.siteUrl), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
