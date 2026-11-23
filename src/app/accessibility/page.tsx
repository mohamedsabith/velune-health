import type { Metadata } from 'next';
import { LegalPage } from '@/components/ui/LegalPage';
import { pages } from '@/content/routes';
import { site } from '@/content/site';
import { pageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = pageMetadata(pages.accessibility);

export default function AccessibilityPage() {
  return (
    <LegalPage
      path="/accessibility"
      title="Accessibility"
      updated="2026-11-01"
      lead="We want everyone to be able to use this website and our hospital, whatever their abilities."
    >
      <h2>This website</h2>
      <ul>
        <li>
          Designed to meet WCAG 2.2 level AA: you can use it with a keyboard, a screen reader or zoomed up to
          400%.
        </li>
        <li>
          Animations stop when your device is set to reduce motion, and moving photos have a pause button.
        </li>
        <li>Text and buttons meet colour contrast guidelines, and every photo has a description.</li>
      </ul>
      <h2>Our buildings</h2>
      <ul>
        <li>Step-free access at Gate 1 and Gate 2, with wheelchairs available at both.</li>
        <li>Lifts to every floor, accessible toilets on every floor, and hearing loops at reception.</li>
        <li>Interpreters for Malayalam, Hindi, Tamil, Arabic and sign language, arranged when you book.</li>
      </ul>
      <h2>Tell us about a problem</h2>
      <p>
        If something on this website or in the hospital is hard to use, email {site.email} or call{' '}
        {site.phones.appointments}. We reply within five working days.
      </p>
    </LegalPage>
  );
}
