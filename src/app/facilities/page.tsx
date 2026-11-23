import type { Metadata } from 'next';
import { CtaBand } from '@/components/ui/CtaBand';
import { PageHero } from '@/components/ui/PageHero';
import { Picture } from '@/components/ui/Picture';
import { facilities } from '@/content/care';
import { pages } from '@/content/routes';
import { pageMetadata } from '@/lib/seo/metadata';
import { FacilitiesShow } from '@/sections/home/FacilitiesShow';

export const metadata: Metadata = pageMetadata(pages.facilities);

export default function FacilitiesPage() {
  return (
    <>
      <PageHero
        trail={[{ name: 'Facilities', path: '/facilities' }]}
        title="Inside the hospital"
        lead="Emergency, intensive care, surgery, imaging and a 24-hour laboratory, all in one building, so your care never waits on a transfer."
      />
      <section className="wrap section-tight" aria-label="Facilities slideshow">
        <FacilitiesShow />
      </section>
      {facilities.map((f, i) => (
        <section className="section wrap" key={f.name} aria-labelledby={`f${i}`}>
          <div className="g12 fac-row" data-flip={i % 2 ? '' : undefined}>
            <Picture image={f.image} className="fac-pic" sizes="(max-width: 980px) 100vw, 56vw" reveal />
            <div className="fac-text">
              <p className="eyebrow" data-rise>
                {f.name}
              </p>
              <h2
                id={`f${i}`}
                className="h2 split"
                style={{ marginTop: 10, fontSize: 'clamp(30px,3vw,44px)' }}
              >
                {f.line}
              </h2>
              <p className="body-l" style={{ marginTop: 16 }} data-rise>
                {f.text}
              </p>
              <ul className="ticks" style={{ marginTop: 20 }} data-rise>
                {f.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ))}
      <CtaBand
        title="See it for yourself"
        text="Book a consultation, or ask our care team about a tour of the maternity floor and patient rooms."
      />
    </>
  );
}
