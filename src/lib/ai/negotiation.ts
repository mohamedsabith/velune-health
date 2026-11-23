/**
 * HTTP content negotiation for agents that send `Accept: text/markdown`.
 * Browsers always rank text/html first, so they are never affected.
 */

interface MediaRange {
  type: string;
  q: number;
}

export function parseAccept(header: string | null | undefined): MediaRange[] {
  if (!header) return [];
  return header
    .split(',')
    .map((part) => {
      const [type = '', ...params] = part.trim().toLowerCase().split(';');
      const qParam = params.map((p) => p.trim()).find((p) => p.startsWith('q='));
      const q = qParam ? Number(qParam.slice(2)) : 1;
      return { type: type.trim(), q: Number.isFinite(q) ? q : 0 };
    })
    .filter((range) => range.type.length > 0);
}

/** True when the client explicitly prefers Markdown over HTML. */
export function prefersMarkdown(header: string | null | undefined): boolean {
  const ranges = parseAccept(header);
  const markdown = ranges.find((r) => r.type === 'text/markdown' || r.type === 'text/x-markdown');
  if (!markdown || markdown.q <= 0) return false;
  const html = ranges.find((r) => r.type === 'text/html' || r.type === 'application/xhtml+xml');
  return !html || markdown.q > html.q;
}
