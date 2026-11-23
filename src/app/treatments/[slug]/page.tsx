import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/seo/JsonLd';
import { ButtonLink, MoreLink } from '@/components/ui/Button';
import { CtaBand } from '@/components/ui/CtaBand';
import { Faq } from '@/components/ui/Faq';
import { PageHero } from '@/components/ui/PageHero';
import { treatmentBySlug, treatments } from '@/content/care';
import { departmentBySlug } from '@/content/departments';
import { doctorsIn } from '@/content/doctors';
import { treatmentPage } from '@/content/routes';
import { env } from '@/lib/env/server';
import { faqJsonLd, treatmentJsonLd } from '@/lib/seo/jsonld';
import { pageMetadata } from '@/lib/seo/metadata';
import { formatInr } from '@/lib/utils';

export const dynamicParams = false;
export function generateStaticParams() {
  return treatments.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return pageMetadata(treatmentPage(slug));
}

export default async function TreatmentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const t = treatmentBySlug(slug);
  if (!t) notFound();
  const dept = departmentBySlug(t.department)!;
  const docs = doctorsIn(t.department);

  return (
    <>
      <PageHero
        trail={[
          { name: 'Departments', path: '/departments' },
          { name: dept.name, path: `/departments/${dept.slug}` },
          { name: t.name, path: `/treatments/${t.slug}` },
        ]}
        eyebrow={`Treatment guide, ${dept.name}`}
        title={t.name}
        lead={t.summary}
        image={t.image}
        imagePosition={t.imagePosition}
        actions={
          <>
            <ButtonLink href={`/book?department=${dept.slug}`}>Book a consultation</ButtonLink>
            <ButtonLink href="/insurance" variant="line">
              Insurance and estimates
            </ButtonLink>
          </>
        }
      />
      <div className="wrap section-tight">
        <div className="body-grid">
          <div>
            <dl className="rows" data-lines>
              <div>
                <dt>Hospital stay</dt>
                <dd>{t.stay}</dd>
              </div>
              <div>
                <dt>Procedure time</dt>
                <dd>{t.duration}</dd>
              </div>
              <div>
                <dt>Recovery</dt>
                <dd>{t.recovery}</dd>
              </div>
              <div>
                <dt>Cost</dt>
                <dd>From {formatInr(t.costFrom)}</dd>
              </div>
            </dl>
            <p className="small" style={{ marginTop: 12 }}>
              {t.costNote}
            </p>

            <section className="block" aria-labelledby="who">
              <h2 id="who" className="split">
                Who it is for
              </h2>
              <ul className="ticks" style={{ marginTop: 20 }} data-rise>
                {t.forWhom.map((w) => (
                  <li key={w}>{w}</li>
                ))}
              </ul>
            </section>

            <section className="block" aria-labelledby="steps">
              <h2 id="steps" className="split">
                What happens, step by step
              </h2>
              <ol className="steps" data-lines>
                {t.steps.map((s) => (
                  <li key={s.title}>
                    <b>{s.title}</b>
                    <p>{s.text}</p>
                  </li>
                ))}
              </ol>
            </section>

            <section className="block" aria-labelledby="risks">
              <h2 id="risks" className="split">
                Risks
              </h2>
              <p className="lead" data-rise>
                {t.risks}
              </p>
            </section>

            <section className="block" aria-labelledby="faq">
              <h2 id="faq" className="split">
                Common questions
              </h2>
              <div style={{ marginTop: 20 }}>
                <Faq items={t.faqs} />
              </div>
            </section>
          </div>
          <aside className="aside" aria-label="Doctors for this treatment">
            <div className="side-card">
              <h2>Talk it through with a specialist</h2>
              <p>A consultation is the best place to ask whether this treatment is right for you.</p>
              {docs.slice(0, 2).map((d) => (
                <p key={d.slug}>
                  <MoreLink href={`/doctors/${d.slug}`}>{d.name}</MoreLink>
                </p>
              ))}
              <ButtonLink href={`/book?department=${dept.slug}`}>Book a consultation</ButtonLink>
            </div>
            <p className="note gold" style={{ marginTop: 16 }}>
              This guide is general information, not medical advice. Your doctor will explain what applies to
              you.
            </p>
          </aside>
        </div>
      </div>
      <CtaBand />
      <JsonLd data={treatmentJsonLd(env.siteUrl, t)} />
      <JsonLd data={faqJsonLd(t.faqs)} />
    </>
  );
}
