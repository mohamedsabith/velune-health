import type { ReactNode } from 'react';
import { ButtonLink } from './Button';
import { site } from '@/content/site';
import { tel } from '@/lib/utils';

export function CtaBand({
  title = 'Not sure which doctor to see?',
  text = 'Call our care team and a nurse will listen, then book you with the right specialist. The call is free and takes about five minutes.',
  actions,
}: {
  title?: string;
  text?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="wrap">
      <section className="cta" aria-label={title} data-rise>
        <div>
          <h2>{title}</h2>
          <p>{text}</p>
        </div>
        <div className="acts">
          {actions ?? (
            <>
              <ButtonLink href="/book" variant="gold">
                Book an appointment
              </ButtonLink>
              <ButtonLink href={tel(site.phones.careLine)} variant="white" icon="phone">
                {`Call ${site.phones.careLine}`}
              </ButtonLink>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
