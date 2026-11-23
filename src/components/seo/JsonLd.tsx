import { serializeJsonLd } from '@/lib/utils';

/**
 * Inline JSON-LD. `application/ld+json` is a data block, not executable script,
 * so it is unaffected by the strict `script-src` CSP. Content is escaped so a
 * stray "</script>" in data can never break out of the element.
 */
export function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }} />;
}
