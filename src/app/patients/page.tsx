import type { Metadata } from 'next';
import { MoreLink } from '@/components/ui/Button';
import { CtaBand } from '@/components/ui/CtaBand';
import { PageHero } from '@/components/ui/PageHero';
import { pages } from '@/content/routes';
import { site } from '@/content/site';
import { pageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = pageMetadata(pages.patients);

const sections = [
  {
    id: 'before',
    title: 'Before your visit',
    items: [
      'Book online or call ' + site.phones.appointments + '.',
      'Bring a photo ID, your insurance card, a list of your medicines and any old reports or scans.',
      'Arrive 15 minutes early for your first visit to register.',
      'If you need a wheelchair or an interpreter, tell us when you book.',
    ],
  },
  {
    id: 'admission',
    title: 'Admission and your stay',
    items: [
      'Planned admissions start at the admissions desk, Gate 1, ground floor.',
      'You will receive a written estimate before any planned procedure.',
      'One family member can stay with you at any time; private rooms have a bed for them.',
      'Meals are cooked to Kerala recipes and planned with your dietitian.',
    ],
  },
  {
    id: 'visiting',
    title: 'Visiting hours',
    items: [
      `General wards and rooms: ${site.hours.visiting}.`,
      'Intensive care: two visitors at a time, at times agreed with the nurse in charge.',
      'Children under 12 are welcome in rooms, but not in intensive care.',
      'Please don’t visit if you have a cough, fever or stomach upset.',
    ],
  },
  {
    id: 'discharge',
    title: 'Going home',
    items: [
      'Your discharge summary explains what happened, your medicines and when to come back.',
      'Our pharmacist will go through your medicines with you before you leave.',
      'A nurse calls you within two days to check how you are.',
      'Bills can be paid at the billing desk, online or by UPI.',
    ],
  },
  {
    id: 'reports',
    title: 'Reports and records',
    items: [
      'Lab reports arrive by SMS with a secure link, usually within 6 hours.',
      'Scan reports are ready within 24 hours.',
      'Request a copy of your records at the medical records desk or by email; copies are ready within three working days.',
    ],
  },
  {
    id: 'rights',
    title: 'Your rights as a patient',
    items: [
      'To be treated with dignity, privacy and respect.',
      'To clear information about your illness, treatment, risks and costs.',
      'To a second opinion, and to refuse treatment.',
      'To complain and receive a reply within seven days. Email ' +
        site.email +
        ' or ask any nurse for the patient relations officer.',
    ],
  },
];

export default function PatientsPage() {
  return (
    <>
      <PageHero
        trail={[{ name: 'Patients and visitors', path: '/patients' }]}
        title="Patients and visitors"
        lead="Everything you need before you come in, while you are with us, and after you go home."
        image="nurse-elder"
        imagePosition="40% 40%"
      />
      <div className="wrap section-tight">
        <div className="body-grid">
          <div>
            {sections.map((s) => (
              <section
                key={s.id}
                id={s.id}
                className="block"
                style={{ marginTop: s.id === 'before' ? 0 : 72 }}
                aria-labelledby={`h-${s.id}`}
              >
                <h2 id={`h-${s.id}`} className="split">
                  {s.title}
                </h2>
                <ul className="ticks" style={{ marginTop: 16 }} data-rise>
                  {s.items.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
          <aside className="aside" aria-label="On this page">
            <nav className="side-card toc" aria-label="On this page">
              <h2>On this page</h2>
              {sections.map((s) => (
                <p key={s.id}>
                  <a href={`#${s.id}`}>{s.title}</a>
                </p>
              ))}
            </nav>
            <div className="side-card">
              <h2>More help</h2>
              <p>
                <MoreLink href="/insurance">Insurance and billing</MoreLink>
              </p>
              <p>
                <MoreLink href="/faq">Frequently asked questions</MoreLink>
              </p>
              <p>
                <MoreLink href="/contact">Contact us</MoreLink>
              </p>
            </div>
          </aside>
        </div>
      </div>
      <CtaBand />
    </>
  );
}
