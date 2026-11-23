import type { ReactNode } from 'react';
import { MoreLink } from './Button';

/** Section heading on the left, a short introduction and link on the right. */
export function SecHead({
  id,
  title,
  intro,
  link,
}: {
  id: string;
  title: ReactNode;
  intro?: ReactNode;
  link?: { href: string; label: string };
}) {
  return (
    <div className="g12 sec-head">
      <h2 id={id} className="h2 split">
        {title}
      </h2>
      {intro || link ? (
        <div className="intro" data-rise>
          {intro ? <p>{intro}</p> : null}
          {link ? (
            <p>
              <MoreLink href={link.href}>{link.label}</MoreLink>
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
