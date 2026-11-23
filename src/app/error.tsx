'use client';

import { useEffect } from 'react';
import { Button, MoreLink } from '@/components/ui/Button';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[app] route error', error.digest ?? error.message);
  }, [error]);
  return (
    <section className="wrap" style={{ paddingTop: 120, paddingBottom: 40 }}>
      <p className="eyebrow">Something went wrong</p>
      <h1 className="p-title" style={{ marginTop: 14, fontSize: 'clamp(42px,4.8vw,72px)', lineHeight: 1 }}>
        We couldn&apos;t load this page.
      </h1>
      <p className="lead" style={{ marginTop: 22, maxWidth: 620 }}>
        Please try again. In an emergency, call +91 484 000 2112.
      </p>
      <div style={{ marginTop: 30, display: 'flex', gap: 16, alignItems: 'center' }}>
        <Button onClick={reset}>Try again</Button>
        <MoreLink href="/">Home page</MoreLink>
      </div>
    </section>
  );
}
