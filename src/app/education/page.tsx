import type { Metadata } from 'next';
import { CtaBand } from '@/components/ui/CtaBand';
import { PageHero } from '@/components/ui/PageHero';
import { programmes } from '@/content/library';
import { pages } from '@/content/routes';
import { pageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = pageMetadata(pages.education);

export default function EducationPage() {
  return (
    <>
      <PageHero
        trail={[{ name: 'Medical education', path: '/education' }]}
        title="Medical education and training"
        lead="Teaching is part of every working week at Velune. Our programmes train doctors and nurses for Kerala's hospitals, with time at the bedside and in the simulation lab."
        image="education"
      />
      <section className="wrap section-tight" aria-labelledby="progs">
        <h2 id="progs" className="h2 split">
          Programmes
        </h2>
        <div className="cols-2" style={{ marginTop: 36 }}>
          {programmes.map((p) => (
            <article className="card" key={p.name} data-rise>
              <p className="eyebrow">
                {p.length}, {p.seats}
              </p>
              <h3 style={{ marginTop: 8 }}>{p.name}</h3>
              <p>{p.text}</p>
            </article>
          ))}
        </div>
      </section>
      <CtaBand
        title="Apply or ask a question"
        text="Write to the medical education office for application dates, eligibility and fees."
        actions={
          <a className="btn btn-gold" href="mailto:education@velune.example">
            Email the education office
          </a>
        }
      />
    </>
  );
}
