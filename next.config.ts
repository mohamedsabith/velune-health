import type { NextConfig } from 'next';
import { resolveEnv } from './src/lib/env/schema';
import { buildSecurityHeaders } from './src/lib/security/headers';

// Fail the build early if the environment is invalid.
const env = resolveEnv(process.env);
const isDev = process.env.NODE_ENV === 'development';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  typedRoutes: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [480, 640, 768, 1024, 1280, 1600, 1920, 2560],
    imageSizes: [112, 160, 260, 330, 420],
    qualities: [75, 82],
  },
  experimental: {
    sri: { algorithm: 'sha256' },
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: buildSecurityHeaders({
          isDev,
          httpsOrigin: env.siteUrl.startsWith('https://'),
          indexable: env.indexable,
        }),
      },
      {
        // Advertise each page's Markdown rendition to agents (RFC 8288 Link header).
        source: '/((?!_next/|api/|md|scripts/).*)',
        headers: [
          {
            key: 'Link',
            value:
              '</llms.txt>; rel="describedby"; type="text/plain", </.well-known/ard.json>; rel="ard"; type="application/json"',
          },
        ],
      },
    ];
  },
  async redirects() {
    // Paths from the previous static site.
    return [
      { source: '/index.html', destination: '/', permanent: true },
      { source: '/appointment', destination: '/book', permanent: true },
      { source: '/appointments', destination: '/book', permanent: true },
      { source: '/find-a-doctor', destination: '/doctors', permanent: true },
      { source: '/blog', destination: '/health-library', permanent: true },
      { source: '/blog/:slug', destination: '/health-library/:slug', permanent: true },
      { source: '/packages', destination: '/health-packages', permanent: true },
    ];
  },
};

export default nextConfig;
