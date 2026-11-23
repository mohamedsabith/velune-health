import type { Metadata } from 'next';
import Link from 'next/link';
import { CtaBand } from '@/components/ui/CtaBand';
import { PageHero } from '@/components/ui/PageHero';
import { departments } from '@/content/departments';
import { stories } from '@/content/library';
import { pages } from '@/content/routes';
import { pageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = pageMetadata(pages.stories);

export default function StoriesPage() {
  const [lead, ...rest] = stories;
  return (
    <>
      <PageHero
        trail={[{ name: 'Patient stories', path: '/stories' }]}
        title="Patient stories"
        lead="In their own words: patients and families on the care they received. These are sample stories written for this concept website."
      />
      <section className="wrap section-tight stories" aria-label="Featured story">
        <figure style={{ margin: 0, maxWidth: 980 }}>
          <blockquote
            className="lit"
            style={{
              margin: 0,
              font: '400 clamp(30px,3.2vw,48px)/1.22 var(--serif)',
              color: 'var(--ink)',
              letterSpacing: '-.01em',
            }}
          >
            “{lead!.quote}”
          </blockquote>
          <figcaption className="who">
            <b>{lead!.who}.</b> {lead!.detail}
          </figcaption>
        </figure>
      </section>
      <section className="section wrap" aria-label="More stories">
        <div className="cols-2">
          {rest.map((s) => {
            const d = departments.find((x) => x.slug === s.department);
            return (
              <figure className="card story" key={s.quote} style={{ margin: 0 }} data-rise>
                <blockquote>“{s.quote}”</blockquote>
                <figcaption>
                  <b>{s.who}.</b> {s.detail}
                  {d ? (
                    <>
                      {' '}
                      <Link href={`/departments/${d.slug}`}>About {d.name}</Link>
                    </>
                  ) : null}
                </figcaption>
              </figure>
            );
          })}
        </div>
        <p className="small" style={{ marginTop: 24 }}>
          Real patient stories are only published with written consent, and never include details that could
          identify a patient&apos;s medical condition without it.
        </p>
      </section>
      <CtaBand />
    </>
  );
}
