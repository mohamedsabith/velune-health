import { describe, expect, it } from 'vitest';
import { renderLlmsTxt } from '@/lib/ai/llms';
import { markdownFor, markdownPaths } from '@/lib/ai/markdown';
import { prefersMarkdown } from '@/lib/ai/negotiation';
import { buildContentSecurityPolicy } from '@/lib/security/headers';

const url = 'https://example.org';

describe('agent readiness', () => {
  it('renders llms.txt with an H1, summary and sections', () => {
    const txt = renderLlmsTxt(url);
    expect(txt.startsWith('# Velune Hospital\n\n> ')).toBe(true);
    expect(txt).toContain('## Departments');
    expect(txt).toContain(`${url}/doctors.json`);
  });

  it('has Markdown for every indexable page', () => {
    for (const p of markdownPaths()) expect(markdownFor(p, url), p).toBeTruthy();
    expect(markdownFor('/nowhere', url)).toBeNull();
  });

  it('only serves Markdown when it is preferred', () => {
    expect(prefersMarkdown('text/markdown')).toBe(true);
    expect(prefersMarkdown('text/html,application/xhtml+xml,*/*;q=0.8')).toBe(false);
  });

  it('keeps a strict content security policy', () => {
    const csp = buildContentSecurityPolicy({ isDev: false, httpsOrigin: true, indexable: true });
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).not.toContain('unsafe-eval');
  });
});

describe('agentic resource discovery', () => {
  it('publishes a manifest that meets the ARD entry rules', async () => {
    const { renderArdManifest, renderOpenApi } = await import('@/lib/ai/ard');
    const { entries } = renderArdManifest(url);
    expect(entries.length).toBeGreaterThan(0);
    for (const e of entries) {
      expect(e.identifier).toMatch(/^urn:air:[a-zA-Z0-9.-]+(:[a-zA-Z0-9._-]+)+$/);
      expect(e.displayName).toBeTruthy();
      expect(e.type).toMatch(/^application\//);
      expect('url' in e && !('data' in e)).toBe(true);
      expect(e.representativeQueries.length).toBeGreaterThanOrEqual(2);
      expect(e.representativeQueries.length).toBeLessThanOrEqual(5);
    }
    expect(Object.keys(renderOpenApi(url).paths)).toEqual(['/doctors.json', '/api/availability']);
  });
});
