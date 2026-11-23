import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { NextSlots } from '@/components/doctors/NextSlots';
import { JsonLd } from '@/components/seo/JsonLd';
import { ButtonLink } from '@/components/ui/Button';
import { Breadcrumbs } from '@/components/ui/PageHero';
import { Picture } from '@/components/ui/Picture';
import { departmentBySlug } from '@/content/departments';
import { doctorBySlug, doctors } from '@/content/doctors';
import { articles } from '@/content/library';
import { doctorPage } from '@/content/routes';
import { env } from '@/lib/env/server';
import { doctorJsonLd } from '@/lib/seo/jsonld';
import { pageMetadata } from '@/lib/seo/metadata';
import { formatInr } from '@/lib/utils';

export const dynamicParams = false;
export function generateStaticParams() {
  return doctors.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return pageMetadata(doctorPage(slug));
}

export default async function DoctorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const d = doctorBySlug(slug);
  if (!d) notFound();
  const dept = departmentBySlug(d.department)!;
  const reviewed = articles.filter((a) => a.reviewer === d.slug);

  return (
    <>
      <section className="p-hero">
        <div className="wrap">
          <Breadcrumbs
            trail={[
              { name: 'Find a doctor', path: '/doctors' },
              { name: d.name, path: `/doctors/${d.slug}` },
            ]}
          />
          <div className="profile" style={{ marginTop: 28 }}>
            <Picture
              image={d.image}
              sizes="(max-width: 980px) 90vw, 400px"
              position={d.imagePosition}
              priority
            />
            <div>
              <p className="eyebrow">
                <Link href={`/departments/${dept.slug}`} style={{ color: 'inherit' }}>
                  {dept.name}
                </Link>
              </p>
              <h1 className="p-title">{d.name}</h1>
              <p className="lead">{d.role}</p>
              <p style={{ marginTop: 16, maxWidth: 640 }}>{d.bio}</p>
              <div className="acts">
                <ButtonLink href={`/book?doctor=${d.slug}`}>{`Book with ${d.name}`}</ButtonLink>
                <ButtonLink href="/doctors" variant="line">
                  All doctors
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="wrap section-tight">
        <div className="body-grid">
          <div>
            <dl className="rows" data-lines>
              <div>
                <dt>Qualifications</dt>
                <dd>{d.qualifications}</dd>
              </div>
              <div>
                <dt>Experience</dt>
                <dd>{d.years} years</dd>
              </div>
              <div>
                <dt>Languages</dt>
                <dd>{d.languages.join(', ')}</dd>
              </div>
              <div>
                <dt>Clinic days</dt>
                <dd>{d.days.join(', ')}</dd>
              </div>
              <div>
                <dt>Consultation fee</dt>
                <dd>{formatInr(d.fee)}</dd>
              </div>
            </dl>
            <section className="block" aria-labelledby="interests">
              <h2 id="interests" className="split">
                Special interests
              </h2>
              <ul className="tags" data-rise>
                {d.interests.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </section>
            <section className="block" aria-labelledby="education">
              <h2 id="education" className="split">
                Education and training
              </h2>
              <ul className="ticks" style={{ marginTop: 20 }} data-rise>
                {d.education.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            </section>
            {reviewed.length ? (
              <section className="block" aria-labelledby="reviewed">
                <h2 id="reviewed" className="split">
                  Articles reviewed by {d.name}
                </h2>
                <ul className="ticks" style={{ marginTop: 20 }}>
                  {reviewed.map((a) => (
                    <li key={a.slug}>
                      <Link href={`/health-library/${a.slug}`}>{a.title}</Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
            <p className="small" style={{ marginTop: 40 }}>
              Sample profile for this concept website.
            </p>
          </div>
          <aside className="aside" aria-label="Book an appointment">
            <NextSlots doctor={d.slug} />
          </aside>
        </div>
      </div>
      <JsonLd data={doctorJsonLd(env.siteUrl, d, dept.name)} />
    </>
  );
}
