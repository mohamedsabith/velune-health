import type { ReactNode } from 'react';
import Link from 'next/link';
import { JsonLd } from '@/components/seo/JsonLd';
import { env } from '@/lib/env/server';
import { breadcrumbJsonLd } from '@/lib/seo/jsonld';
import type { ImageKey } from '@/content/images';
import { Picture } from './Picture';

export interface Crumb {
  name: string;
  path: string;
}

export function Breadcrumbs({ trail }: { trail: Crumb[] }) {
  const all = [{ name: 'Home', path: '/' }, ...trail];
  return (
    <>
      <nav aria-label="Breadcrumb">
        <ol className="crumbs">
          {all.map((c, i) => (
            <li key={c.path}>
              {i === all.length - 1 ? (
                <span aria-current="page">{c.name}</span>
              ) : (
                <Link href={c.path as never}>{c.name}</Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd data={breadcrumbJsonLd(env.siteUrl, all)} />
    </>
  );
}

/** The opening block of every inner page: breadcrumbs, a large title, a short lead and optional actions or photo. */
export function PageHero({
  trail,
  title,
  lead,
  actions,
  image,
  imagePosition,
  eyebrow,
  children,
}: {
  trail: Crumb[];
  title: ReactNode;
  lead?: ReactNode;
  actions?: ReactNode;
  image?: ImageKey;
  imagePosition?: string;
  eyebrow?: ReactNode;
  children?: ReactNode;
}) {
  const text = (
    <div>
      {eyebrow ? (
        <p className="eyebrow" style={{ marginTop: 28 }}>
          {eyebrow}
        </p>
      ) : null}
      <h1 className="p-title" style={eyebrow ? { marginTop: 10 } : undefined}>
        {title}
      </h1>
      {lead ? <p className="lead">{lead}</p> : null}
      {actions ? <div className="acts">{actions}</div> : null}
      {children}
    </div>
  );
  return (
    <section className="p-hero">
      <div className="wrap">
        <Breadcrumbs trail={trail} />
        {image ? (
          <div className="p-hero-split">
            {text}
            <Picture image={image} sizes="(max-width: 980px) 100vw, 50vw" priority position={imagePosition} />
          </div>
        ) : (
          text
        )}
      </div>
    </section>
  );
}
