import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DoctorCard } from '@/components/doctors/DoctorCard';
import { JsonLd } from '@/components/seo/JsonLd';
import { ButtonLink, MoreLink } from '@/components/ui/Button';
import { CtaBand } from '@/components/ui/CtaBand';
import { Faq } from '@/components/ui/Faq';
import { PageHero } from '@/components/ui/PageHero';
import { treatments } from '@/content/care';
import { departmentBySlug, departments } from '@/content/departments';
import { doctorBySlug } from '@/content/doctors';
import { stories } from '@/content/library';
import { departmentPage } from '@/content/routes';
import { site } from '@/content/site';
import { env } from '@/lib/env/server';
import { departmentJsonLd, faqJsonLd } from '@/lib/seo/jsonld';
import { pageMetadata } from '@/lib/seo/metadata';
import { tel } from '@/lib/utils';

export const dynamicParams = false;
export function generateStaticParams() {
  return departments.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return pageMetadata(departmentPage(slug));
}

export default async function DepartmentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const d = departmentBySlug(slug);
  if (!d) notFound();
  const team = d.doctors.map((s) => doctorBySlug(s)!).filter(Boolean);
  const story = stories.find((s) => s.department === d.slug);
  const related = treatments.filter((t) => t.department === d.slug);

  return (
    <>
      <PageHero
        trail={[
          { name: 'Departments', path: '/departments' },
          { name: d.name, path: `/departments/${d.slug}` },
        ]}
        title={d.name}
        lead={d.intro}
        image={d.image}
        imagePosition={d.imagePosition}
        actions={
          <>
            <ButtonLink href={`/book?department=${d.slug}`}>Book an appointment</ButtonLink>
            <ButtonLink href="/doctors" variant="line">
              {`Find a ${d.name.toLowerCase()} doctor`}
            </ButtonLink>
          </>
        }
      />

      <div className="wrap section-tight">
        <div className="body-grid">
          <div>
            <dl className="facts" data-rise>
              {d.facts.map((f) => (
                <div key={f.label}>
                  <dt className="sr">{f.label}</dt>
                  <dd>
                    <b>{f.value}</b>
                    <span>{f.label}</span>
                  </dd>
                </div>
              ))}
            </dl>

            <section className="block" aria-labelledby="conditions">
              <h2 id="conditions" className="split">
                What we treat
              </h2>
              <ul className="tags" data-rise>
                {d.conditions.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </section>

            <section className="block" aria-labelledby="treatments">
              <h2 id="treatments" className="split">
                Treatments and services
              </h2>
              <ul className="tlist" data-lines>
                {d.treatments.map((t) => (
                  <li key={t.name}>
                    <b>{t.name}</b>
                    <span>{t.text}</span>
                    {t.slug ? <MoreLink href={`/treatments/${t.slug}`}>What to expect</MoreLink> : <span />}
                  </li>
                ))}
              </ul>
            </section>

            <section className="block" aria-labelledby="tests">
              <h2 id="tests" className="split">
                Tests and diagnostics
              </h2>
              <ul className="tags" data-rise>
                {d.tests.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <p style={{ marginTop: 18 }}>
                <MoreLink href="/diagnostics">Preparation, results and prices</MoreLink>
              </p>
            </section>

            <section className="block" aria-labelledby="when">
              <h2 id="when" className="split">
                When to see a doctor
              </h2>
              <ul className="ticks" style={{ marginTop: 20 }} data-rise>
                {d.whenToSee.map((w) => (
                  <li key={w}>{w}</li>
                ))}
              </ul>
            </section>

            {team.length ? (
              <section className="block" aria-labelledby="team">
                <h2 id="team" className="split">
                  Our {d.name.toLowerCase()} doctors
                </h2>
                <div className="g12 docs" style={{ marginTop: 28 }}>
                  {team.map((doc) => (
                    <DoctorCard key={doc.slug} doctor={doc} />
                  ))}
                </div>
              </section>
            ) : null}

            {story ? (
              <figure className="stories block" style={{ margin: '72px 0 0' }}>
                <blockquote
                  className="lit"
                  style={{
                    margin: 0,
                    font: '400 clamp(26px,2.4vw,34px)/1.3 var(--serif)',
                    color: 'var(--ink)',
                  }}
                >
                  “{story.quote}”
                </blockquote>
                <figcaption className="who">
                  <b>{story.who}.</b> {story.detail}
                </figcaption>
              </figure>
            ) : null}

            <section className="block" aria-labelledby="faq">
              <h2 id="faq" className="split">
                Common questions
              </h2>
              <div style={{ marginTop: 20 }}>
                <Faq items={d.faqs} />
              </div>
            </section>
          </div>

          <aside className="aside" aria-label={`Book ${d.name}`}>
            <div className="side-card">
              <h2>Book with {d.name}</h2>
              <p>Choose a doctor and a time that suits you. It takes about two minutes.</p>
              <ButtonLink href={`/book?department=${d.slug}`}>Book an appointment</ButtonLink>
              <ButtonLink href={tel(site.phones.appointments)} variant="line" icon="phone">
                {site.phones.appointments}
              </ButtonLink>
            </div>
            {related.length ? (
              <div className="side-card">
                <h2>Treatment guides</h2>
                {related.map((t) => (
                  <p key={t.slug}>
                    <Link href={`/treatments/${t.slug}`}>{t.name}</Link>
                  </p>
                ))}
              </div>
            ) : null}
            <div className="side-card red">
              <h2>In an emergency</h2>
              <p>
                Call {site.phones.emergency} or come to {site.address.erEntrance}, open 24 hours.
              </p>
            </div>
          </aside>
        </div>
      </div>
      <CtaBand />
      <JsonLd data={departmentJsonLd(env.siteUrl, d)} />
      <JsonLd data={faqJsonLd(d.faqs)} />
    </>
  );
}
