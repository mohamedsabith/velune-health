import type { Metadata } from 'next';
import { LegalPage } from '@/components/ui/LegalPage';
import { pages } from '@/content/routes';
import { site } from '@/content/site';
import { pageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = pageMetadata(pages.privacy);

export default function PrivacyPage() {
  return (
    <LegalPage
      path="/privacy"
      title="Privacy notice"
      updated="2026-11-01"
      lead="Your health information is personal. This notice explains what we collect, why, who can see it and the choices you have."
    >
      <h2>What we collect</h2>
      <ul>
        <li>
          Details you give us when you book or write to us: name, phone number, email and the reason for your
          visit.
        </li>
        <li>Medical records created during your care, kept in our hospital information system.</li>
        <li>
          Basic, anonymous measurements of how fast this website loads. We do not use advertising or tracking
          cookies.
        </li>
      </ul>
      <h2>How we use it</h2>
      <p>
        To arrange and provide your care, to contact you about appointments and results, to bill you or your
        insurer, and to meet our legal duties. We never sell your information.
      </p>
      <h2>Who can see it</h2>
      <p>
        Only the people caring for you and the staff who support them, your insurer when you choose cashless
        treatment, and authorities where the law requires it.
      </p>
      <h2>Your choices</h2>
      <ul>
        <li>Ask for a copy of your information, or ask us to correct it.</li>
        <li>Withdraw consent for messages that are not about your care.</li>
        <li>Complain to our data protection officer at {site.email}.</li>
      </ul>
      <h2>How long we keep it</h2>
      <p>
        Medical records are kept for the period required by Indian law. Website enquiries are deleted after 12
        months.
      </p>
    </LegalPage>
  );
}
