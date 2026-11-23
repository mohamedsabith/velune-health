import type { Metadata } from 'next';
import { Suspense } from 'react';
import { BookingForm, BookingFormFallback } from '@/components/booking/BookingForm';
import { PageHero } from '@/components/ui/PageHero';
import { pages } from '@/content/routes';
import { site } from '@/content/site';
import { pageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = pageMetadata(pages.book);

export default function BookPage() {
  return (
    <>
      <PageHero
        trail={[{ name: 'Book an appointment', path: '/book' }]}
        title="Book an appointment"
        lead={`Four short steps, about two minutes. Prefer to talk? Call ${site.phones.appointments}, Monday to Saturday, 8 am to 8 pm.`}
      />
      <section className="wrap section-tight" aria-label="Booking form" style={{ paddingTop: 56 }}>
        <Suspense fallback={<BookingFormFallback />}>
          <BookingForm />
        </Suspense>
      </section>
    </>
  );
}
