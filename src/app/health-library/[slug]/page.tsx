import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/seo/JsonLd';
import { ButtonLink } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Breadcrumbs } from '@/components/ui/PageHero';
import { Picture } from '@/components/ui/Picture';
import { departmentBySlug } from '@/content/departments';
import { doctorBySlug } from '@/content/doctors';
import { articleBySlug, articles } from '@/content/library';
import { articlePage } from '@/content/routes';
import { site } from '@/content/site';
import { env } from '@/lib/env/server';
import { articleJsonLd } from '@/lib/seo/jsonld';
import { pageMetadata } from '@/lib/seo/metadata';
import { tel } from '@/lib/utils';

export const dynamicParams = false;
export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = articleBySlug(slug)!;
  return pageMetadata(articlePage(slug), {
    openGraph: {
      type: 'article',
      title: a.title,
      description: a.summary,
      publishedTime: a.published,
      modifiedTime: a.updated,
    },
  });
}

const fmt = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = articleBySlug(slug);
  if (!a) notFound();
  const r = doctorBySlug(a.reviewer);
  const dept = departmentBySlug(a.department);
  const more = articles.filter((x) => x.slug !== a.slug).slice(0, 3);

  return (
    <>
      <article>
        <header className="p-hero">
          <div className="wrap">
            <Breadcrumbs
              trail={[
                { name: 'Health library', path: '/health-library' },
                { name: a.title, path: `/health-library/${a.slug}` },
              ]}
            />
            <div style={{ maxWidth: 880 }}>
              <p className="eyebrow" style={{ marginTop: 28 }}>
                {a.topic}, {a.minutes} min read
              </p>
              <h1 className="p-title" style={{ marginTop: 10 }}>
                {a.title}
              </h1>
              <p className="lead">{a.summary}</p>
              {r ? (
                <p className="reviewed" style={{ marginTop: 20, fontSize: 15 }}>
                  <Icon name="badge" className="text-gold-text" />
                  <span>
                    Medically reviewed by <Link href={`/doctors/${r.slug}`}>{r.name}</Link>, {r.role}. Last
                    reviewed <time dateTime={a.updated}>{fmt(a.updated)}</time>.
                  </span>
                </p>
              ) : null}
            </div>
          </div>
        </header>
        <div className="wrap" style={{ marginTop: 48 }}>
          <Picture image={a.image} sizes="(max-width: 1360px) 100vw, 1264px" priority className="art-hero" />
        </div>
        <div className="wrap section-tight">
          <div className="body-grid">
            <div className="prose">
              {a.sections.map((s) => (
                <section key={s.heading}>
                  <h2>{s.heading}</h2>
                  {s.body.map((b) => (
                    <p key={b}>{b}</p>
                  ))}
                  {s.list ? (
                    <ul>
                      {s.list.map((l) => (
                        <li key={l}>{l}</li>
                      ))}
                    </ul>
                  ) : null}
                </section>
              ))}
              <section className="note red" style={{ marginTop: 48 }}>
                <h2 style={{ marginTop: 0, fontSize: 24, color: 'var(--red-text)' }}>
                  See a doctor if you have
                </h2>
                <ul>
                  {a.seeDoctor.map((l) => (
                    <li key={l} style={{ fontSize: 16 }}>
                      {l}
                    </li>
                  ))}
                </ul>
              </section>
              <p className="small" style={{ marginTop: 24 }}>
                This article is general information, not a diagnosis. Published{' '}
                <time dateTime={a.published}>{fmt(a.published)}</time>.
              </p>
            </div>
            <aside className="aside" aria-label="Related">
              {dept ? (
                <div className="side-card">
                  <h2>{dept.name}</h2>
                  <p>{dept.short}</p>
                  <ButtonLink href={`/book?department=${dept.slug}`}>Book an appointment</ButtonLink>
                </div>
              ) : null}
              <div className="side-card red">
                <h2>Emergency</h2>
                <p>
                  Call <a href={tel(site.phones.emergency)}>{site.phones.emergency}</a>, 24 hours.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </article>
      <section className="section wrap" aria-labelledby="more">
        <h2 id="more" className="h2 split">
          More from the health library
        </h2>
        <ul className="ticks" style={{ marginTop: 20, maxWidth: 720 }}>
          {more.map((m) => (
            <li key={m.slug}>
              <Link href={`/health-library/${m.slug}`}>{m.title}</Link>
            </li>
          ))}
        </ul>
      </section>
      <JsonLd data={articleJsonLd(env.siteUrl, a, r)} />
    </>
  );
}
