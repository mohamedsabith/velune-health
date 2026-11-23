'use client';

import { useReportWebVitals } from 'next/web-vitals';

/** Sends field Core Web Vitals (LCP, INP, CLS, FCP, TTFB) to /api/vitals in production. */
export function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    if (process.env.NODE_ENV !== 'production') return;
    const body = JSON.stringify({
      name: metric.name,
      value:
        Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value) /
        (metric.name === 'CLS' ? 1000 : 1),
      rating: metric.rating,
      id: metric.id,
      navigationType: metric.navigationType,
      path: window.location.pathname,
    });
    const blob = new Blob([body], { type: 'application/json' });
    if (!navigator.sendBeacon?.('/api/vitals', blob)) {
      void fetch('/api/vitals', {
        method: 'POST',
        body,
        keepalive: true,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  });
  return null;
}
