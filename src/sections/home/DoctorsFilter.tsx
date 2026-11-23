'use client';

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { ensureGsap, prefersMotion } from '@/animations/gsap';

interface Filter {
  value: string;
  label: string;
}

/**
 * Filter chips over a grid of doctor cards (rendered on the server and passed in).
 * One dark chip slides between choices; cards that leave fade out and the rest
 * glide into their new places (GSAP Flip).
 */
export function DoctorsFilter({
  filters,
  total,
  children,
}: {
  filters: Filter[];
  total: number;
  children: ReactNode;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const chip = useRef<HTMLSpanElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState('all');
  const [count, setCount] = useState(total);

  const placeChip = (animate: boolean) => {
    const b = wrap.current?.querySelector<HTMLButtonElement>('button[aria-pressed="true"]');
    if (!b || !chip.current) return;
    const v = { x: b.offsetLeft, y: b.offsetTop, width: b.offsetWidth, height: b.offsetHeight };
    const { gsap } = ensureGsap();
    if (animate && prefersMotion()) gsap.to(chip.current, { ...v, duration: 0.6, ease: 'expo.out' });
    else gsap.set(chip.current, v);
  };

  useLayoutEffect(() => {
    wrap.current?.classList.add('has-chip');
    placeChip(false);
    const onResize = () => placeChip(false);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => placeChip(true), [active]);

  const choose = (value: string) => {
    if (value === active || !grid.current) return;
    const { gsap, Flip } = ensureGsap();
    const cards = [...grid.current.querySelectorAll<HTMLElement>('.doc')];
    const state = Flip.getState(cards);
    grid.current.style.minHeight = `${grid.current.offsetHeight}px`;
    cards.forEach((c) => c.classList.toggle('out', value !== 'all' && c.dataset.dept !== value));
    setCount(cards.filter((c) => !c.classList.contains('out')).length);
    setActive(value);
    if (!prefersMotion()) {
      grid.current.style.minHeight = '';
      return;
    }
    Flip.from(state, {
      duration: 0.75,
      ease: 'expo.inOut',
      absolute: true,
      scale: false,
      onComplete: () => {
        if (grid.current) grid.current.style.minHeight = '';
      },
      onEnter: (els) =>
        gsap.fromTo(
          els,
          { opacity: 0, y: 30, scale: 1 },
          { opacity: 1, y: 0, duration: 0.7, delay: 0.15, ease: 'expo.out' },
        ),
      onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.94, duration: 0.4, ease: 'power2.in' }),
    });
  };

  const label = filters.find((f) => f.value === active)?.label;
  return (
    <>
      <div className="filters" ref={wrap} role="group" aria-label="Filter doctors by department">
        <span className="chip" ref={chip} aria-hidden="true" />
        {filters.map((f) => (
          <button
            key={f.value}
            type="button"
            aria-pressed={active === f.value}
            onClick={() => choose(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>
      <p className="doc-count small" aria-live="polite">
        Showing {count} doctor{count === 1 ? '' : 's'}
        {active === 'all' ? '' : ` in ${label}`}
      </p>
      <div className="g12 docs" ref={grid}>
        {children}
      </div>
    </>
  );
}
