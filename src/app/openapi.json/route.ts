import { renderOpenApi } from '@/lib/ai/ard';
import { env } from '@/lib/env/server';

export const dynamic = 'force-static';

export function GET() {
  return Response.json(renderOpenApi(env.siteUrl), {
    headers: { 'Access-Control-Allow-Origin': '*' },
  });
}
