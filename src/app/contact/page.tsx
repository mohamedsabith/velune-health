import type { Metadata } from 'next';
import { ContactForm } from '@/components/contact/ContactForm';
import { Icon } from '@/components/ui/Icon';
import { PageHero } from '@/components/ui/PageHero';
import { pages } from '@/content/routes';
import { site } from '@/content/site';
import { pageMetadata } from '@/lib/seo/metadata';
import { tel } from '@/lib/utils';
import { VisitBlock } from '@/sections/shared/VisitBlock';

export const metadata: Metadata = pageMetadata(pages.contact);

export default function ContactPage() {
  const p = site.phones;
  const lines = [
    { icon: 'phone', title: 'Emergency, 24 hours', value: p.emergency, href: tel(p.emergency), red: true },
    { icon: 'amb', title: 'Ambulance', value: p.ambulance, href: tel(p.ambulance), red: true },
    { icon: 'cal', title: 'Appointments', value: p.appointments, href: tel(p.appointments) },
    {
      icon: 'whatsapp',
      title: 'WhatsApp',
      value: p.whatsapp,
      href: `https://wa.me/${p.whatsapp.replace(/\D/g, '')}`,
    },
    { icon: 'user', title: 'Care line (nurse advice)', value: p.careLine, href: tel(p.careLine) },
    { icon: 'mail', title: 'Email', value: site.email, href: `mailto:${site.email}` },
  ] as const;
  return (
    <>
      <PageHero
        trail={[{ name: 'Contact us', path: '/contact' }]}
        title="Contact us"
        lead={`We answer phones from 8 am to 8 pm, Monday to Saturday, and the emergency line 24 hours a day. International patients: write to ${site.email} and a coordinator will reply within one working day.`}
      />
      <section className="wrap section-tight" aria-label="Phone numbers and email">
        <ul className="contact-grid">
          {lines.map((l) => (
            <li key={l.title} data-rise>
              <a href={l.href} className={'red' in l && l.red ? 'contact-line red' : 'contact-line'}>
                <Icon name={l.icon} size={22} />
                <span>
                  <small>{l.title}</small>
                  <b>{l.value}</b>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>
      <section className="section wrap" aria-labelledby="write">
        <div className="g12">
          <div style={{ gridColumn: '1 / span 5' }}>
            <h2 id="write" className="h2 split">
              Send us a message
            </h2>
            <p className="body-l" style={{ marginTop: 16 }} data-rise>
              For questions about appointments, bills, reports or feedback. We reply within one working day.
            </p>
          </div>
          <div style={{ gridColumn: '7 / span 6' }}>
            <ContactForm />
          </div>
        </div>
      </section>
      <VisitBlock showContact={false} />
    </>
  );
}
