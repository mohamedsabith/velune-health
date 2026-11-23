import type { Metadata } from 'next';
import Link from 'next/link';
import { CtaBand } from '@/components/ui/CtaBand';
import { PageHero } from '@/components/ui/PageHero';
import { healthPackages } from '@/content/care';
import { pages } from '@/content/routes';
import { pageMetadata } from '@/lib/seo/metadata';
import { formatInr } from '@/lib/utils';

export const metadata: Metadata = pageMetadata(pages.packages);

export default function PackagesPage() {
  return (
    <>
      <PageHero
        trail={[{ name: 'Health checks', path: '/health-packages' }]}
        title="Health check packages"
        lead="Finding problems early is easier than treating them late. Every package ends with a doctor going through your results with you, on the same day."
        image="lab"
      />
      <section className="wrap section-tight" aria-label="Packages">
        <div className="pkg-grid">
          {healthPackages.map((p) => (
            <article className={p.popular ? 'pkg popular' : 'pkg'} key={p.slug} data-rise>
              {p.popular ? <p className="pkg-flag">Most chosen</p> : null}
              <h2>{p.name}</h2>
              <p className="muted">
                {p.forWhom}. About {p.time}.
              </p>
              <p className="pkg-price">{formatInr(p.price)}</p>
              <ul className="ticks">
                {p.tests.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <Link
                className={p.popular ? 'btn btn-blue' : 'btn btn-line'}
                href={`/book?department=general-medicine`}
              >
                Book this check
              </Link>
            </article>
          ))}
        </div>
        <div className="cols-3" style={{ marginTop: 48 }}>
          {[
            ['Before', 'Fast for 10 to 12 hours (water is fine). Bring your medicines and any old reports.'],
            [
              'On the day',
              'Arrive at 8 am at the health check desk, Gate 1. Breakfast is served after your fasting tests.',
            ],
            [
              'After',
              'A doctor explains your results the same afternoon, and you leave with a written plan.',
            ],
          ].map(([t, x]) => (
            <div className="card" key={t} data-rise>
              <h3>{t}</h3>
              <p>{x}</p>
            </div>
          ))}
        </div>
      </section>
      <CtaBand
        title="Not sure which check is right?"
        text="Call our care team and a nurse will recommend a package based on your age, history and family history."
      />
    </>
  );
}
