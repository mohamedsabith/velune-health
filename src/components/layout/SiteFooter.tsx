import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { site } from '@/content/site';
import { ReplayIntro } from '@/components/motion/ReplayIntro';

const groups: { title: string; links: [string, string][] }[] = [
  {
    title: 'Departments',
    links: [
      ['Cardiology', '/departments/cardiology'],
      ['Neurology', '/departments/neurology'],
      ['Orthopaedics', '/departments/orthopaedics'],
      ['Paediatrics', '/departments/paediatrics'],
      ['All departments', '/departments'],
    ],
  },
  {
    title: 'Patients and visitors',
    links: [
      ['Book an appointment', '/book'],
      ['Find a doctor', '/doctors'],
      ['Health checks', '/health-packages'],
      ['Lab and imaging', '/diagnostics'],
      ['Insurance and billing', '/insurance'],
    ],
  },
  {
    title: 'Hospital',
    links: [
      ['About us', '/about'],
      ['Facilities', '/facilities'],
      ['Patient stories', '/stories'],
      ['Careers', '/careers'],
      ['Medical education', '/education'],
    ],
  },
  {
    title: 'Help',
    links: [
      ['Contact us', '/contact'],
      ['FAQs', '/faq'],
      ['Privacy notice', '/privacy'],
      ['Terms of use', '/terms'],
      ['Accessibility', '/accessibility'],
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="cols">
          <div>
            <Logo light />
            <p style={{ marginTop: 18, maxWidth: 320 }}>
              A {site.facts.beds}-bed multi-speciality hospital with a 24-hour emergency department at{' '}
              {site.address.erEntrance}.
            </p>
            <p style={{ marginTop: 14 }}>
              {site.address.street}, {site.address.locality}, {site.address.region} {site.address.postalCode}
            </p>
          </div>
          {groups.map((g) => (
            <nav key={g.title} aria-label={g.title}>
              <h2 className="foot-h">{g.title}</h2>
              {g.links.map(([label, href]) => (
                <Link key={href} href={href as never}>
                  {label}
                </Link>
              ))}
            </nav>
          ))}
        </div>
        <div className="legal">
          <p>
            {site.demoNotice} Photos are stand-ins from stock and public-domain libraries. <ReplayIntro />
          </p>
          <p>Designed and developed by Mohamed Sabith</p>
        </div>
      </div>
    </footer>
  );
}
