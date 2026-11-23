import Image from 'next/image';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { Picture } from '@/components/ui/Picture';
import { SecHead } from '@/components/ui/SecHead';
import { doctorBySlug } from '@/content/doctors';
import { photos } from '@/content/images';
import { articles } from '@/content/library';

export function LibraryBlock() {
  const [lead, ...rest] = articles;
  const reviewer = doctorBySlug(lead!.reviewer);
  return (
    <section id="library" className="section wrap arts" aria-labelledby="lib-title">
      <SecHead
        id="lib-title"
        title="Health library"
        intro="Clear advice written for patients, and reviewed by our doctors before it is published."
        link={{ href: '/health-library', label: 'All articles' }}
      />
      <div className="g12" style={{ marginTop: 48 }}>
        <Link className="lead-art" href={`/health-library/${lead!.slug}`} data-rise>
          <Picture image={lead!.image} sizes="(max-width: 980px) 100vw, 56vw" reveal />
          <p className="meta">
            <b>{lead!.topic}</b> &nbsp; {lead!.minutes} min read
          </p>
          <h3>{lead!.title}</h3>
          <p>{lead!.summary}</p>
          {reviewer ? (
            <p className="reviewed">
              <Icon name="badge" className="text-gold-text" />
              Reviewed by {reviewer.name}, {reviewer.role.replace('Consultant, ', '')}
            </p>
          ) : null}
        </Link>
        <ul data-rise>
          {rest.map((a) => (
            <li key={a.slug}>
              <Link href={`/health-library/${a.slug}`}>
                <figure className="pic" style={{ margin: 0 }}>
                  <Image src={photos[a.image].src} alt="" fill sizes="112px" style={{ objectFit: 'cover' }} />
                </figure>
                <span>
                  <h3>{a.title}</h3>
                  <p className="meta">
                    <b>{a.topic}</b> &nbsp; {a.minutes} min
                  </p>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
