import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { MotionScope } from '@/animations/MotionScope';
import { SmoothScroll } from '@/animations/SmoothScroll';
import { WebVitalsReporter } from '@/components/analytics/WebVitalsReporter';
import { AgentTools } from '@/components/agents/AgentTools';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { UtilBar } from '@/components/layout/UtilBar';
import { JsonLd } from '@/components/seo/JsonLd';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { IconSprite } from '@/components/ui/Icon';
import { pages } from '@/content/routes';
import { site } from '@/content/site';
import { env } from '@/lib/env/server';
import { hospitalJsonLd, websiteJsonLd } from '@/lib/seo/jsonld';
import { figtree, newsreader } from './fonts';
import './globals.css';

const WEBMCP_TOKEN = process.env.NEXT_PUBLIC_WEBMCP_TOKEN;

export const metadata: Metadata = {
  metadataBase: new URL(env.siteUrl),
  title: { default: pages.home.title, template: `%s | ${site.name}` },
  description: site.description,
  applicationName: site.name,
  category: 'health',
  referrer: 'strict-origin-when-cross-origin',
  formatDetection: { telephone: false, email: false, address: false },
  robots: env.indexable
    ? {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
      }
    : { index: false, follow: false },
  openGraph: { type: 'website', siteName: site.name, locale: 'en_IN' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1E3A8A',
  colorScheme: 'light',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // suppressHydrationWarning: /scripts/intro-gate.js may set `data-intro="seen"` on <html>
    // before React hydrates. Only <html>'s own attributes are exempt.
    <html lang="en-IN" className={`${newsreader.variable} ${figtree.variable}`} suppressHydrationWarning>
      <head>
        {/* Must run before first paint: decides whether the opening shows. Same-origin, so script-src 'self' allows it. */}
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src="/scripts/intro-gate.js" />
        {/* WebMCP origin trial. Chrome only reads tokens from http-equiv, never from name="origin-trial". */}
        {WEBMCP_TOKEN ? <meta httpEquiv="origin-trial" content={WEBMCP_TOKEN} /> : null}
      </head>
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <IconSprite />
        <SmoothScroll />
        <UtilBar />
        <SiteHeader />
        <main id="main" tabIndex={-1} style={{ outline: 'none' }}>
          <QueryProvider>{children}</QueryProvider>
        </main>
        <SiteFooter />
        <MotionScope />
        <AgentTools />
        <JsonLd data={hospitalJsonLd(env.siteUrl)} />
        <JsonLd data={websiteJsonLd(env.siteUrl)} />
        <WebVitalsReporter />
      </body>
    </html>
  );
}
