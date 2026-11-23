import type { Metadata } from 'next';
import { LegalPage } from '@/components/ui/LegalPage';
import { pages } from '@/content/routes';
import { site } from '@/content/site';
import { pageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = pageMetadata(pages.terms);

export default function TermsPage() {
  return (
    <LegalPage
      path="/terms"
      title="Terms of use"
      updated="2026-11-01"
      lead="The terms that apply when you use this website."
    >
      <h2>Medical information</h2>
      <p>
        Health articles on this site are general information, reviewed by our doctors, but they are not a
        diagnosis or a replacement for seeing a doctor. In an emergency, call {site.phones.emergency}.
      </p>
      <h2>Appointments</h2>
      <p>
        An appointment is confirmed when you receive a reference number. You can change or cancel it at no
        charge up to two hours before.
      </p>
      <h2>Prices</h2>
      <p>Prices shown are a guide. Your written estimate or bill shows the final amount.</p>
      <h2>Using the site</h2>
      <p>
        Please don&apos;t misuse the site, try to access other people&apos;s information, or send automated
        requests that disrupt the service.
      </p>
    </LegalPage>
  );
}
