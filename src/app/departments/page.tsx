import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { CtaBand } from '@/components/ui/CtaBand';
import { PageHero } from '@/components/ui/PageHero';
import { departments } from '@/content/departments';
import { photos } from '@/content/images';
import { pages } from '@/content/routes';
import { site } from '@/content/site';
import { pageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = pageMetadata(pages.departments);

export default function DepartmentsPage() {
  return (
    <>
      <PageHero
        trail={[{ name: 'Departments', path: '/departments' }]}
        title="Departments and specialities"
        lead={`${site.facts.departments} departments under one roof, each with its own specialists, tests and nurses. Your records follow you between them, so you never repeat your story.`}
      />
      <section className="section-tight wrap" aria-label="All departments">
        <div className="dept-grid">
          {departments.map((d) => (
            <Link className="dept-card" href={`/departments/${d.slug}`} key={d.slug} data-rise>
              <figure className="pic" style={{ margin: 0 }}>
                <Image
                  src={photos[d.image].src}
                  alt=""
                  fill
                  sizes="(max-width: 560px) 100vw, (max-width: 980px) 50vw, 420px"
                  placeholder="blur"
                  style={{ objectFit: 'cover', objectPosition: d.imagePosition ?? '50% 40%' }}
                />
              </figure>
              <h2>{d.name}</h2>
              <p>{d.short}</p>
            </Link>
          ))}
        </div>
      </section>
      <CtaBand />
    </>
  );
}
