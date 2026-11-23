import type { Metadata } from 'next';
import type { PageInfo } from '@/content/routes';
import { site } from '@/content/site';

/** Markdown rendition of a page, for AI agents (see src/app/md). */
export const markdownPath = (path: string) => (path === '/' ? '/md' : `/md${path}`);

/** Page-level metadata. `metadataBase` (root layout) resolves relative URLs. */
export function pageMetadata(page: PageInfo, extra: Partial<Metadata> = {}): Metadata {
  const isHome = page.path === '/';
  return {
    title: isHome ? { absolute: page.title } : page.title,
    description: page.description,
    alternates: {
      canonical: page.path,
      types: { 'text/markdown': markdownPath(page.path) },
    },
    openGraph: {
      type: 'website',
      siteName: site.name,
      title: page.title,
      description: page.description,
      url: page.path,
      locale: 'en_IN',
    },
    twitter: { card: 'summary_large_image', title: page.title, description: page.description },
    ...(page.noindex ? { robots: { index: false, follow: true } } : {}),
    ...extra,
  };
}
