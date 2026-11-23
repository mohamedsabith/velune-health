import { renderArdManifest } from '@/lib/ai/ard';
import { env } from '@/lib/env/server';

export const dynamic = 'force-static';

export function GET() {
  return Response.json(renderArdManifest(env.siteUrl), {
    headers: { 'Access-Control-Allow-Origin': '*' },
  });
}
