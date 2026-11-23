import type { Metadata } from 'next';
import { ButtonLink, MoreLink } from '@/components/ui/Button';

export const metadata: Metadata = { title: 'Page not found', robots: { index: false, follow: true } };

export default function NotFound() {
  return (
    <section className="wrap" style={{ paddingTop: 120, paddingBottom: 40 }}>
      <p className="eyebrow">Error 404</p>
      <h1 className="p-title" style={{ marginTop: 14, fontSize: 'clamp(42px,4.8vw,72px)', lineHeight: 1 }}>
        We couldn&apos;t find that page.
      </h1>
      <p className="lead" style={{ marginTop: 22, maxWidth: 620 }}>
        It may have moved. You can book an appointment, find a doctor, or go back to the home page.
      </p>
      <div style={{ marginTop: 30, display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
        <ButtonLink href="/book">Book an appointment</ButtonLink>
        <ButtonLink href="/doctors" variant="line">
          Find a doctor
        </ButtonLink>
        <MoreLink href="/">Home page</MoreLink>
      </div>
      <p className="note red" style={{ marginTop: 40, maxWidth: 620 }}>
        In an emergency, call +91 484 000 2112 or come to Gate 2, Market Road.
      </p>
    </section>
  );
}
