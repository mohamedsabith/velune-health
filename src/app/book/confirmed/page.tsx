import type { Metadata } from 'next';
import { Confirmed } from '@/components/booking/Confirmed';
import { pages } from '@/content/routes';
import { pageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = pageMetadata(pages.bookConfirmed);

export default function ConfirmedPage() {
  return (
    <section className="wrap" style={{ paddingTop: 64, paddingBottom: 24, maxWidth: 880 }}>
      <Confirmed />
    </section>
  );
}
