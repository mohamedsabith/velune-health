import type { Metadata } from 'next';
import { CtaBand } from '@/components/ui/CtaBand';
import { PageHero } from '@/components/ui/PageHero';
import { jobs } from '@/content/library';
import { pages } from '@/content/routes';
import { site } from '@/content/site';
import { pageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = pageMetadata(pages.careers);

export default function CareersPage() {
  return (
    <>
      <PageHero
        trail={[{ name: 'Careers', path: '/careers' }]}
        title="Work at Velune"
        lead="Join a hospital that gives its people the time to do their best work: protected teaching time, fair rotas, and a team that knows your name."
        image="simlab"
      />
      <section className="wrap section-tight" aria-labelledby="why">
        <h2 id="why" className="h2 split">
          Why people stay
        </h2>
        <div className="cols-3" style={{ marginTop: 36 }}>
          {[
            [
              'Learning built in',
              'Monthly teaching, a simulation lab and funded courses for every clinical role.',
            ],
            [
              'Safe staffing',
              'One nurse for every ventilated patient in intensive care, and rotas published four weeks ahead.',
            ],
            [
              'Looking after you',
              'Health cover for you and your family, staff meals and a quiet room on every floor.',
            ],
          ].map(([t, x]) => (
            <div className="card" key={t} data-rise>
              <h3>{t}</h3>
              <p>{x}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="section wrap" aria-labelledby="open">
        <h2 id="open" className="h2 split">
          Open roles
        </h2>
        <ul className="tlist" data-lines>
          {jobs.map((j) => (
            <li key={j.title}>
              <b>{j.title}</b>
              <span>
                {j.team}. {j.type}. {j.experience}.
              </span>
              <a
                className="more"
                href={`mailto:careers@velune.example?subject=${encodeURIComponent(j.title)}`}
              >
                Apply
              </a>
            </li>
          ))}
        </ul>
        <p className="small" style={{ marginTop: 20 }}>
          Sample roles for this concept website. Send your CV to careers@velune.example. Velune Hospital is an
          equal opportunity employer.
        </p>
      </section>
      <CtaBand
        title="Don't see your role?"
        text={`Write to us anyway. We keep CVs for six months and contact you when a matching role opens. ${site.address.locality}.`}
        actions={
          <a className="btn btn-gold" href="mailto:careers@velune.example">
            Send your CV
          </a>
        }
      />
    </>
  );
}
