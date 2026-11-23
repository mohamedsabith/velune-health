import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { CtaBand } from '@/components/ui/CtaBand';
import { Icon } from '@/components/ui/Icon';
import { PageHero } from '@/components/ui/PageHero';
import { doctorBySlug } from '@/content/doctors';
import { photos } from '@/content/images';
import { articles } from '@/content/library';
import { pages } from '@/content/routes';
import { pageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = pageMetadata(pages.library);

export default function LibraryPage() {
  return (
    <>
      <PageHero
        trail={[{ name: 'Health library', path: '/health-library' }]}
        title="Health library"
        lead="Clear advice written for patients. Every article is reviewed by a Velune doctor before it is published, and checked again at least once a year."
      />
      <section className="wrap section-tight" aria-label="Articles">
        <div className="art-grid">
          {articles.map((a, i) => {
            const r = doctorBySlug(a.reviewer);
            return (
              <Link
                className={i === 0 ? 'art-card first' : 'art-card'}
                href={`/health-library/${a.slug}`}
                key={a.slug}
                data-rise
              >
                <figure className="pic" style={{ margin: 0 }}>
                  <Image
                    src={photos[a.image].src}
                    alt=""
                    fill
                    sizes={i === 0 ? '(max-width: 980px) 100vw, 60vw' : '(max-width: 980px) 100vw, 30vw'}
                    placeholder="blur"
                    style={{ objectFit: 'cover' }}
                  />
                </figure>
                <p className="meta">
                  <b>{a.topic}</b> &nbsp; {a.minutes} min read
                </p>
                <h2>{a.title}</h2>
                <p className="sum">{a.summary}</p>
                {r ? (
                  <p className="reviewed">
                    <Icon name="badge" className="text-gold-text" />
                    Reviewed by {r.name}
                  </p>
                ) : null}
              </Link>
            );
          })}
        </div>
      </section>
      <CtaBand />
    </>
  );
}
