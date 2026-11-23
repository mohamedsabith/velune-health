import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';
import { CtaBand } from '@/components/ui/CtaBand';
import { Faq } from '@/components/ui/Faq';
import { PageHero } from '@/components/ui/PageHero';
import { faqGroups } from '@/content/library';
import { pages } from '@/content/routes';
import { faqJsonLd } from '@/lib/seo/jsonld';
import { pageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = pageMetadata(pages.faq);

const slug = (s: string) => s.toLowerCase().replace(/[^a-z]+/g, '-');

export default function FaqPage() {
  return (
    <>
      <PageHero
        trail={[{ name: 'FAQs', path: '/faq' }]}
        title="Frequently asked questions"
        lead="Quick answers about appointments, emergencies, insurance, staying in hospital and reports."
      />
      <div className="wrap section-tight">
        <div className="body-grid">
          <div>
            {faqGroups.map((g, i) => (
              <section
                key={g.title}
                id={slug(g.title)}
                aria-labelledby={`fq-${i}`}
                style={{ marginTop: i ? 64 : 0 }}
              >
                <h2
                  id={`fq-${i}`}
                  className="split"
                  style={{ fontSize: 'clamp(28px,2.6vw,38px)', marginBottom: 16 }}
                >
                  {g.title}
                </h2>
                <Faq items={g.items} />
              </section>
            ))}
          </div>
          <aside className="aside">
            <nav className="side-card toc" aria-label="Topics">
              <h2>Topics</h2>
              {faqGroups.map((g) => (
                <p key={g.title}>
                  <a href={`#${slug(g.title)}`}>{g.title}</a>
                </p>
              ))}
            </nav>
          </aside>
        </div>
      </div>
      <CtaBand
        title="Still have a question?"
        text="Call our care team or send us a message, and we will answer within one working day."
      />
      <JsonLd data={faqJsonLd(faqGroups.flatMap((g) => g.items))} />
    </>
  );
}
