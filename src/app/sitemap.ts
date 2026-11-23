import type { MetadataRoute } from 'next';
import { allPages } from '@/content/routes';
import { env } from '@/lib/env/server';

export default function sitemap(): MetadataRoute.Sitemap {
  if (!env.indexable) return [];
  return allPages()
    .filter((p) => !p.noindex)
    .map((p) => ({
      url: `${env.siteUrl}${p.path}`,
      changeFrequency: 'monthly',
      priority: p.priority ?? 0.5,
    }));
}
