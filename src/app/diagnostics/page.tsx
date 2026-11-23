import type { Metadata } from 'next';
import { CtaBand } from '@/components/ui/CtaBand';
import { PageHero } from '@/components/ui/PageHero';
import { diagnosticTests } from '@/content/care';
import { pages } from '@/content/routes';
import { pageMetadata } from '@/lib/seo/metadata';
import { formatInr } from '@/lib/utils';

export const metadata: Metadata = pageMetadata(pages.diagnostics);

const groups = ['Blood and urine', 'Imaging', 'Heart', 'Other'] as const;

export default function DiagnosticsPage() {
  return (
    <>
      <PageHero
        trail={[{ name: 'Lab and imaging', path: '/diagnostics' }]}
        title="Laboratory and imaging tests"
        lead="Our NABL-accredited laboratory is open 24 hours, and most results arrive by SMS within 6 hours. Imaging includes 3T MRI and 128-slice CT. Many tests need no appointment."
        image="ct"
      />
      <section className="wrap section-tight" aria-label="Test list">
        <div className="cols-3" style={{ marginBottom: 56 }}>
          {[
            [
              'Walk in for blood tests',
              'The sample collection room at Gate 1 is open 24 hours. Bring your doctor’s note if you have one.',
            ],
            [
              'Home collection',
              'A phlebotomist visits your home in Kochi between 6 am and 10 am. Book by phone.',
            ],
            [
              'Getting results',
              'Reports arrive by SMS with a secure link. Printed copies are at the laboratory counter.',
            ],
          ].map(([t, x]) => (
            <div className="card" key={t} data-rise>
              <h2 style={{ fontSize: 24 }}>{t}</h2>
              <p>{x}</p>
            </div>
          ))}
        </div>
        {groups.map((g) => (
          <section key={g} className="test-group" aria-labelledby={`g-${g}`}>
            <h2 id={`g-${g}`} className="split" style={{ fontSize: 30 }}>
              {g}
            </h2>
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Test</th>
                    <th scope="col">How to prepare</th>
                    <th scope="col">Results</th>
                    <th scope="col">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {diagnosticTests
                    .filter((t) => t.group === g)
                    .map((t) => (
                      <tr key={t.name}>
                        <td>{t.name}</td>
                        <td>{t.prep}</td>
                        <td>{t.results}</td>
                        <td>{formatInr(t.price)}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}
        <p className="small" style={{ marginTop: 24 }}>
          Sample prices for this concept website. Scans with contrast cost more; your quote will show the
          final amount.
        </p>
      </section>
      <CtaBand />
    </>
  );
}
