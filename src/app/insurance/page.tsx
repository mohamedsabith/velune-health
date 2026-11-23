import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';
import { CtaBand } from '@/components/ui/CtaBand';
import { Faq } from '@/components/ui/Faq';
import { PageHero } from '@/components/ui/PageHero';
import { faqGroups } from '@/content/library';
import { pages } from '@/content/routes';
import { site } from '@/content/site';
import { faqJsonLd } from '@/lib/seo/jsonld';
import { pageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = pageMetadata(pages.insurance);

const cashless = [
  [
    'Before a planned admission',
    'Send your policy details and the doctor’s advice to the insurance desk at least three working days before. We request pre-authorisation for you.',
  ],
  [
    'On the day',
    'Bring your insurance card and photo ID to the admissions desk. We confirm what your policy covers before treatment.',
  ],
  [
    'In an emergency',
    'Treatment starts first. Our insurance desk contacts your insurer within 24 hours of admission.',
  ],
  [
    'At discharge',
    'We send the final bill to your insurer. You pay only for items your policy does not cover, such as some consumables.',
  ],
];

export default function InsurancePage() {
  const faqs = faqGroups.find((g) => g.title === 'Insurance and billing')!.items;
  return (
    <>
      <PageHero
        trail={[{ name: 'Insurance and billing', path: '/insurance' }]}
        title="Insurance, cashless treatment and billing"
        lead={`Cashless treatment is available with more than ${site.facts.insurers} insurers and third-party administrators, and with corporate and government health schemes. If you are paying yourself, you get a written estimate before any planned procedure.`}
      />
      <section className="wrap section-tight" aria-labelledby="cashless">
        <div className="g12">
          <h2 id="cashless" className="h2 split" style={{ gridColumn: '1 / span 5' }}>
            How cashless treatment works
          </h2>
          <ol className="steps" style={{ gridColumn: '7 / span 6', marginTop: 0 }} data-lines>
            {cashless.map(([t, x]) => (
              <li key={t}>
                <b>{t}</b>
                <p>{x}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="section wrap" aria-labelledby="paying">
        <h2 id="paying" className="h2 split">
          Paying yourself
        </h2>
        <div className="cols-3" style={{ marginTop: 36 }}>
          {[
            ['Written estimates', 'For every planned procedure, so you know the cost before you decide.'],
            [
              'Ways to pay',
              'Cash, debit and credit cards, UPI and bank transfer. Payment plans are available for some procedures.',
            ],
            [
              'Itemised bills',
              'Every bill lists each item and charge. The billing desk will explain anything that is unclear.',
            ],
          ].map(([t, x]) => (
            <div className="card" key={t} data-rise>
              <h3>{t}</h3>
              <p>{x}</p>
            </div>
          ))}
        </div>
        <p className="note" style={{ marginTop: 24 }}>
          Insurance desk: Gate 1, ground floor, Monday to Saturday, 8 am to 8 pm. Email {site.email}.
        </p>
      </section>
      <section className="section wrap" aria-labelledby="ifaq">
        <div className="g12">
          <h2 id="ifaq" className="h2 split" style={{ gridColumn: '1 / span 5' }}>
            Common questions
          </h2>
          <div style={{ gridColumn: '7 / span 6' }}>
            <Faq items={faqs} />
          </div>
        </div>
      </section>
      <CtaBand />
      <JsonLd data={faqJsonLd(faqs)} />
    </>
  );
}
