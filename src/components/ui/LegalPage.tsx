import type { ReactNode } from 'react';
import { PageHero } from './PageHero';

export function LegalPage({
  path,
  title,
  lead,
  updated,
  children,
}: {
  path: string;
  title: string;
  lead: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <>
      <PageHero trail={[{ name: title, path }]} title={title} lead={lead} />
      <div className="wrap section-tight">
        <div className="prose">
          <p className="small">
            Last updated{' '}
            <time dateTime={updated}>
              {new Date(`${updated}T00:00:00`).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </time>
            . This is sample text for a concept website, not legal advice.
          </p>
          {children}
        </div>
      </div>
    </>
  );
}
