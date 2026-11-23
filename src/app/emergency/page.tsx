import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';
import { ButtonLink } from '@/components/ui/Button';
import { Faq } from '@/components/ui/Faq';
import { Breadcrumbs } from '@/components/ui/PageHero';
import { pages } from '@/content/routes';
import { site } from '@/content/site';
import { faqJsonLd } from '@/lib/seo/jsonld';
import { pageMetadata } from '@/lib/seo/metadata';
import { tel } from '@/lib/utils';
import { VisitBlock } from '@/sections/shared/VisitBlock';

export const metadata: Metadata = pageMetadata(pages.emergency);

const signs = [
  [
    'Chest pain',
    'Pressure or tightness in the chest, often with sweating, sickness or pain in the arm or jaw.',
  ],
  ['Signs of a stroke', 'Face drooping, arm weakness, slurred speech. Note the time it started.'],
  ['Severe breathlessness', 'Struggling to breathe, unable to finish a sentence, blue lips.'],
  [
    'Heavy bleeding or serious injury',
    'Bleeding that will not stop, a head injury, a suspected broken bone.',
  ],
  [
    'A very unwell child',
    'A baby under three months with a fever, a child who is floppy, very drowsy or has a rash that does not fade when pressed.',
  ],
  ['Poisoning or overdose', 'Bring the packet or bottle with you if it is safe to do so.'],
];

const faqs = [
  {
    q: 'Do I need to pay before treatment?',
    a: 'No. In an emergency, treatment always starts first. Registration and payment come later, and cashless insurance is accepted.',
  },
  {
    q: 'Can a family member come with the patient?',
    a: 'Yes. One family member can stay with the patient in the emergency department.',
  },
  {
    q: 'What happens when we arrive?',
    a: 'A triage nurse sees every patient within minutes and decides how urgently they need a doctor. The sickest patients are seen first.',
  },
  {
    q: 'Is there parking at the emergency entrance?',
    a: 'Yes. Drop-off and short-stay parking are directly outside Gate 2 on Market Road.',
  },
];

export default function EmergencyPage() {
  const p = site.phones;
  return (
    <>
      <section className="p-hero er-hero">
        <div className="wrap">
          <Breadcrumbs trail={[{ name: 'Emergency', path: '/emergency' }]} />
          <p className="er-status">
            <i aria-hidden="true" />
            Open now. Average wait to be seen: {site.facts.erWaitMinutes} minutes
          </p>
          <h1 className="p-title" style={{ marginTop: 14 }}>
            Emergency and trauma care, 24 hours a day
          </h1>
          <p className="lead">
            If someone&apos;s life is in danger, call now or come straight to {site.address.erEntrance}.
            Treatment always starts before any paperwork or payment.
          </p>
          <div className="acts">
            <ButtonLink href={tel(p.emergency)} variant="red" icon="phone">
              {`Call ${p.emergency}`}
            </ButtonLink>
            <ButtonLink href={tel(p.ambulance)} variant="line" icon="amb">
              {`Ambulance ${p.ambulance}`}
            </ButtonLink>
          </div>
          <p className="small" style={{ marginTop: 14 }}>
            You can also call Kerala&apos;s free state ambulance on {p.stateAmbulance}.
          </p>
        </div>
      </section>
      <section className="wrap section-tight" aria-labelledby="signs">
        <h2 id="signs" className="h2 split">
          Come to emergency for
        </h2>
        <div className="cols-3" style={{ marginTop: 36 }}>
          {signs.map(([t, x]) => (
            <div className="card" key={t} data-rise>
              <h3>{t}</h3>
              <p>{x}</p>
            </div>
          ))}
        </div>
        <p className="note" style={{ marginTop: 24 }} data-rise>
          For illnesses that are not emergencies, book a same-day appointment with General Medicine or call
          our care line on {p.careLine}.
        </p>
      </section>
      <section className="wrap section-tight" aria-labelledby="er-facts">
        <div className="g12">
          <h2 id="er-facts" className="h2 split" style={{ gridColumn: '1 / span 5' }}>
            Ready for anything, at any hour
          </h2>
          <dl className="rows" style={{ gridColumn: '7 / span 6' }} data-lines>
            <div>
              <dt>Entrance</dt>
              <dd>{site.address.erEntrance}</dd>
            </div>
            <div>
              <dt>Cath lab, stroke and trauma teams</dt>
              <dd>On call 24 hours</dd>
            </div>
            <div>
              <dt>Paediatrician and obstetrician</dt>
              <dd>In the hospital 24 hours</dd>
            </div>
            <div>
              <dt>CT scan for emergencies</dt>
              <dd>Reported within 30 minutes</dd>
            </div>
            <div>
              <dt>Blood bank and pharmacy</dt>
              <dd>Open 24 hours</dd>
            </div>
          </dl>
        </div>
      </section>
      <section className="wrap section-tight" aria-labelledby="erfaq">
        <div className="g12">
          <h2 id="erfaq" className="h2 split" style={{ gridColumn: '1 / span 5' }}>
            Questions families ask
          </h2>
          <div style={{ gridColumn: '7 / span 6' }}>
            <Faq items={faqs} />
          </div>
        </div>
      </section>
      <VisitBlock />
      <JsonLd data={faqJsonLd(faqs)} />
    </>
  );
}
