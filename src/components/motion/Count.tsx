'use client';

import { useEffect, useRef, useState } from 'react';
import { ensureGsap, prefersMotion } from '@/animations/gsap';

/**
 * A figure that rolls into place like a mechanical counter when it scrolls into
 * view. Screen readers and search engines always get the plain number.
 */
export function Count({ to }: { to: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [rolling, setRolling] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !prefersMotion() || el.getBoundingClientRect().top < window.innerHeight * 0.92) return;
    setRolling(true);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!rolling || !el) return;
    const { gsap } = ensureGsap();
    const io = new IntersectionObserver(([en]) => {
      if (!en?.isIntersecting) return;
      io.disconnect();
      const strips = [...el.querySelectorAll<HTMLElement>('.odo-c > span')];
      strips.forEach((s, k) => {
        // the units spin furthest, like a real counter
        const target = 10 * (1 + Math.min(2, k)) + Number(s.dataset.d);
        gsap.fromTo(
          s,
          { yPercent: 0 },
          {
            yPercent: (-100 * target) / 41,
            duration: 1.9 + k * 0.2,
            ease: 'expo.out',
            delay: 0.15,
            onComplete: k === strips.length - 1 ? () => setRolling(false) : undefined,
          },
        );
      });
    });
    io.observe(el);
    return () => io.disconnect();
  }, [rolling]);

  if (!rolling) return <span ref={ref}>{to}</span>;
  const strip = ('0123456789'.repeat(4) + '0').split('');
  return (
    <span ref={ref}>
      <span className="sr">{to}</span>
      <span className="odo" aria-hidden="true">
        {[...to].map((d, i) => (
          <span className="odo-c" key={i}>
            <span data-d={d}>
              {strip.map((x, j) => (
                <span key={j}>{x}</span>
              ))}
            </span>
          </span>
        ))}
      </span>
    </span>
  );
}
