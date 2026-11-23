import type { Metadata } from 'next';
import { Count } from '@/components/motion/Count';
import { ButtonLink } from '@/components/ui/Button';
import { CtaBand } from '@/components/ui/CtaBand';
import { PageHero } from '@/components/ui/PageHero';
import { Picture } from '@/components/ui/Picture';
import { pages } from '@/content/routes';
import { site } from '@/content/site';
import { pageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = pageMetadata(pages.about);

const timeline = [
  [
    '2009',
    'A 40-bed clinic opens beside the Periyar, with two operating theatres and a small emergency room.',
  ],
  ['2013', 'The cardiac unit and 24-hour cath lab open. The first angioplasty is performed in March.'],
  ['2017', 'The new building opens on Riverside Avenue: 180 beds, a neonatal ICU and our own laboratory.'],
  ['2021', 'NABH accreditation for the hospital and NABL accreditation for the laboratory.'],
  ['2025', 'The hybrid operation theatre, 3T MRI and the day-care unit open. We reach 250 beds.'],
];

const promises = [
  [
    'Time to listen',
    'First consultations last 45 minutes, so you can tell your whole story and ask every question.',
  ],
  [
    'A plan in writing',
    'You leave every visit with a written plan in plain words: what we found, what happens next, and when to call us.',
  ],
  [
    'Clear costs',
    'You get a written estimate before any planned procedure, and we explain any change before it happens.',
  ],
  [
    'Family at the bedside',
    'One family member can stay with a patient at any hour, with a bed in every private room.',
  ],
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        trail={[{ name: 'About us', path: '/about' }]}
        title="Kochi's riverside hospital, caring for families since 2009."
        lead={`Velune began as a 40-bed clinic beside the Periyar. Today we are a ${site.facts.beds}-bed multi-speciality hospital with a 24-hour emergency department, eight operation theatres and our own laboratory. What hasn't changed is the time our doctors give each patient.`}
        image="exterior"
        imagePosition="40% 50%"
      />
      <section className="wrap section-tight" aria-label="Velune in numbers">
        <dl className="figs" data-rise style={{ marginTop: 0 }}>
          <div>
            <dt>
              <Count to={String(site.facts.beds)} />
            </dt>
            <dd>beds, {site.facts.icuBeds} in intensive care</dd>
          </div>
          <div>
            <dt>
              <Count to={String(site.facts.doctors)} />+
            </dt>
            <dd>specialist doctors</dd>
          </div>
          <div>
            <dt>
              <Count to={String(site.facts.departments)} />
            </dt>
            <dd>departments</dd>
          </div>
          <div>
            <dt>{site.facts.patientsPerYear}</dt>
            <dd>patients each year</dd>
          </div>
        </dl>
      </section>
      <section className="section wrap" aria-labelledby="promises">
        <h2 id="promises" className="h2 split">
          Four promises we make to every patient
        </h2>
        <div className="cols-2" style={{ marginTop: 40 }}>
          {promises.map(([t, x], i) => (
            <div className="card" key={t} data-rise>
              <p className="eyebrow">Promise {i + 1}</p>
              <h3 style={{ marginTop: 8 }}>{t}</h3>
              <p>{x}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="section wrap" aria-labelledby="history">
        <div className="g12">
          <h2 id="history" className="h2 split" style={{ gridColumn: '1 / span 5' }}>
            How we grew
          </h2>
          <ol className="steps" style={{ gridColumn: '7 / span 6', marginTop: 0 }} data-lines>
            {timeline.map(([y, t]) => (
              <li key={y}>
                <b>{y}</b>
                <p>{t}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="section wrap" aria-labelledby="place">
        <div className="g12 pics">
          <Picture
            image="lobby"
            className="a"
            sizes="(max-width: 980px) 100vw, 40vw"
            reveal
            caption="Main reception, Gate 1"
          />
          <Picture
            image="lounge"
            className="b"
            sizes="(max-width: 980px) 100vw, 58vw"
            reveal
            caption="Family lounge, second floor"
          />
        </div>
        <div className="g12" style={{ marginTop: 48 }}>
          <h2 id="place" className="h2 split" style={{ gridColumn: '1 / span 5' }}>
            A building designed around patients
          </h2>
          <div style={{ gridColumn: '7 / span 6' }} data-rise>
            <p className="body-l">
              Every patient room has daylight and a view of the river or the courtyard garden. Emergency,
              imaging, theatres and intensive care sit on connected floors, so a patient is never moved
              further than they need to be.
            </p>
            <div className="acts" style={{ marginTop: 24, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <ButtonLink href="/facilities">See our facilities</ButtonLink>
              <ButtonLink href="/careers" variant="line">
                Work with us
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
