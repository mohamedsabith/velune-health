'use client';

import * as Accordion from '@radix-ui/react-accordion';
import { Icon } from './Icon';

/** Questions and answers in an accessible accordion (Radix). Answers stay in the page for search engines. */
export function Faq({
  items,
  headingLevel = 3,
}: {
  items: { q: string; a: string }[];
  headingLevel?: 2 | 3;
}) {
  const H = headingLevel === 2 ? 'h2' : 'h3';
  return (
    <Accordion.Root type="multiple" className="acc">
      {items.map((f, i) => (
        <Accordion.Item value={`q${i}`} key={f.q} className="acc-item">
          <Accordion.Header asChild>
            <H style={{ margin: 0, font: 'inherit' }}>
              <Accordion.Trigger className="acc-trigger">
                {f.q}
                <Icon name="plus" />
              </Accordion.Trigger>
            </H>
          </Accordion.Header>
          <Accordion.Content className="acc-content" forceMount>
            <div>{f.a}</div>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
