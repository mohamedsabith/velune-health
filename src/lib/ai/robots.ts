import { crawlerPolicy, privatePaths, type CrawlerGroup } from './crawlers';

interface RobotsOptions {
  siteUrl: string;
  indexable: boolean;
  policy?: CrawlerGroup[];
}

/**
 * Renders robots.txt (RFC 9309) with one documented group per crawler purpose.
 * A Route Handler is used instead of `app/robots.ts` so the file can carry
 * comments and the Content-Signal line, which the metadata API cannot express.
 */
export function renderRobotsTxt({ siteUrl, indexable, policy = crawlerPolicy }: RobotsOptions): string {
  const lines: string[] = [
    `# robots.txt for ${siteUrl}`,
    '# Velune Hospital crawler policy: search, AI answer engines, user-triggered AI fetchers',
    '# and AI training crawlers are all allowed on public pages. /api/ is private.',
    '# Machine-readable summaries: /llms.txt, /llms-full.txt, /doctors.json, and a',
    '# Markdown rendition of every page under /md (or send "Accept: text/markdown").',
    '',
  ];

  if (!indexable) {
    lines.push('# Non-production deployment: nothing may be crawled.', 'User-agent: *', 'Disallow: /', '');
    return lines.join('\n');
  }

  for (const group of policy) {
    lines.push(`# ${group.label}`);
    for (const agent of group.agents) {
      lines.push(`User-agent: ${agent.token}`);
    }
    if (group.allow) {
      lines.push('Allow: /');
      lines.push('Allow: /api/availability');
      for (const path of privatePaths) lines.push(`Disallow: ${path}`);
    } else {
      lines.push('Disallow: /');
    }
    lines.push('');
  }

  lines.push('# Everyone else');
  lines.push('User-agent: *');
  lines.push('Allow: /');
  lines.push('Allow: /api/availability');
  for (const path of privatePaths) lines.push(`Disallow: ${path}`);
  // Content Signals (contentsignals.org): explicit usage preferences.
  lines.push('Content-Signal: search=yes, ai-input=yes, ai-train=yes');
  lines.push('');
  lines.push(`Sitemap: ${siteUrl}/sitemap.xml`);
  lines.push('');
  return lines.join('\n');
}
