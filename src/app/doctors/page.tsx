import type { Metadata } from 'next';
import { Suspense } from 'react';
import { DoctorCard } from '@/components/doctors/DoctorCard';
import { DoctorFinder } from '@/components/doctors/DoctorFinder';
import { CtaBand } from '@/components/ui/CtaBand';
import { PageHero } from '@/components/ui/PageHero';
import { doctors } from '@/content/doctors';
import { pages } from '@/content/routes';
import { site } from '@/content/site';
import { pageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = pageMetadata(pages.doctors);

export default function DoctorsPage() {
  const cards = Object.fromEntries(
    doctors.map((d) => [d.slug, <DoctorCard key={d.slug} doctor={d} headingLevel="h2" rise={false} />]),
  );
  return (
    <>
      <PageHero
        trail={[{ name: 'Find a doctor', path: '/doctors' }]}
        title="Find a doctor"
        lead={`Search our ${site.facts.doctors} specialists by name, department, condition or language, see who is free today, and book directly with the doctor you choose.`}
      />
      <section className="wrap" aria-label="Doctor directory" style={{ paddingTop: 8 }}>
        <Suspense
          fallback={
            <div className="g12 docs" style={{ marginTop: 40 }}>
              {doctors.map((d) => (
                <div key={d.slug} className="doc-cell">
                  {cards[d.slug]}
                </div>
              ))}
            </div>
          }
        >
          <DoctorFinder cards={cards} />
        </Suspense>
        <p className="small" style={{ marginTop: 28 }}>
          This concept website lists 7 sample doctors. The full hospital directory would list all{' '}
          {site.facts.doctors}.
        </p>
      </section>
      <CtaBand />
    </>
  );
}
