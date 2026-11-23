import Image from 'next/image';
import Link from 'next/link';
import { departmentBySlug } from '@/content/departments';
import type { Doctor } from '@/content/doctors';
import { photos } from '@/content/images';

export function DoctorCard({
  doctor: d,
  headingLevel = 'h3',
  rise = true,
}: {
  doctor: Doctor;
  headingLevel?: 'h2' | 'h3';
  rise?: boolean;
}) {
  const H = headingLevel;
  return (
    <article className="doc" data-dept={d.department} data-rise={rise ? '' : undefined}>
      <Link href={`/doctors/${d.slug}`} tabIndex={-1} aria-hidden="true" className="doc-pic">
        <figure className="pic" style={{ margin: 0 }}>
          <Image
            src={photos[d.image].src}
            alt={photos[d.image].alt}
            fill
            sizes="(max-width: 980px) 100vw, 320px"
            placeholder="blur"
            style={{ objectFit: 'cover', objectPosition: d.imagePosition ?? '50% 15%' }}
          />
        </figure>
      </Link>
      <div className="tx">
        <H>
          <Link href={`/doctors/${d.slug}`} className="doc-name">
            {d.name}
          </Link>
        </H>
        <p className="role">{d.role}</p>
        <p className="q">
          {d.qualifications}. {d.years} years. {d.languages.join(', ')}
        </p>
        <p className="next">
          <span>Next available</span>
          <b>{d.nextAvailable}</b>
        </p>
        <div className="acts">
          <Link className="btn btn-blue" href={`/book?doctor=${d.slug}`}>
            Book appointment
          </Link>
          <Link className="btn btn-line" href={`/doctors/${d.slug}`} aria-label={`Profile of ${d.name}`}>
            Profile
          </Link>
        </div>
        <p className="sr">Department: {departmentBySlug(d.department)?.name}</p>
      </div>
    </article>
  );
}
