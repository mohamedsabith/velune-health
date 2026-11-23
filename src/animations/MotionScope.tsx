'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { ensureGsap, prefersMotion } from './gsap';

/**
 * Declarative scroll motion for server-rendered pages. Mounted once in the root
 * layout and re-run on every route change.
 *
 *   [data-rise]    fades up when it enters the viewport (siblings follow one another)
 *   [data-mask]    a photo frame unmasks upwards while the photo settles
 *   [data-lines]   rows whose rule lines draw across, then their text rises
 *   .split         heading lines rise from behind a mask
 *   [data-map]     map streets draw, pins drop and the walking route traces
 *   .lit           a quote lights up word by word as you read down it
 *   .pics img      photos drift at slightly different speeds
 *   .er-band       the emergency band widens from the page margins to full width
 *   .show          the facilities slideshow unfolds from a smaller frame
 *
 * Only content below the fold starts hidden, nothing pins the page, and with
 * reduced motion (or without JavaScript) everything is simply visible.
 */
export function MotionScope() {
  const pathname = usePathname();

  useEffect(() => {
    if (!prefersMotion()) return;
    const { gsap, ScrollTrigger, SplitText } = ensureGsap();
    const main = document.getElementById('main');
    if (!main) return;
    const below = (e: Element) => e.getBoundingClientRect().top > window.innerHeight * 0.92;
    const kids = (row: Element) => [...row.children].filter((c) => !c.matches('.th'));
    const observers: IntersectionObserver[] = [];
    let live: ReturnType<typeof gsap.context> | undefined;
    let refresh = 0;

    // Set up once the browser is idle: everything touched here is below the fold, and this
    // keeps the work out of the first, hydration-heavy moments of the page load.
    const setup = () => {
      const ctx = gsap.context(() => {
        const io = new IntersectionObserver(
          (entries) => {
            entries.forEach((en) => {
              if (!en.isIntersecting) return;
              io.unobserve(en.target);
              const t = en.target as HTMLElement;
              ctx.add(() => {
                if (t.matches('.split')) {
                  const s = SplitText.create(t, { type: 'lines', mask: 'lines' });
                  gsap.set(t, { opacity: 1 });
                  gsap.from(s.lines, {
                    yPercent: 105,
                    duration: 1.1,
                    stagger: 0.08,
                    ease: 'expo.out',
                    onComplete: () => s.revert(),
                  });
                } else if (t.matches('[data-mask]')) {
                  gsap.to(t, {
                    clipPath: 'inset(0% 0% 0% 0%)',
                    duration: 1.3,
                    ease: 'expo.inOut',
                    clearProps: 'clipPath',
                  });
                  const img = t.querySelector('img');
                  if (img)
                    gsap.fromTo(
                      img,
                      { scale: 1.12 },
                      {
                        scale: 1,
                        duration: 1.8,
                        ease: 'expo.out',
                        clearProps: t.closest('.pics') ? '' : 'transform',
                      },
                    );
                  const cap = t.querySelector('figcaption');
                  if (cap)
                    gsap.from(cap, { opacity: 0, y: 10, duration: 0.7, delay: 0.9, ease: 'power3.out' });
                } else if (t.matches('[data-lines]')) {
                  [...t.children].forEach((row, k) => {
                    gsap.to(row, { '--ln': 1, duration: 1.1, ease: 'expo.inOut', delay: k * 0.06 });
                    gsap.to(kids(row), {
                      opacity: 1,
                      y: 0,
                      duration: 0.8,
                      ease: 'power3.out',
                      delay: 0.2 + k * 0.06,
                      stagger: 0.04,
                      clearProps: 'opacity,transform',
                    });
                  });
                } else if (t.matches('[data-map]')) {
                  mapIn(t);
                } else {
                  gsap.to(t, {
                    opacity: 1,
                    y: 0,
                    duration: 0.9,
                    ease: 'power3.out',
                    delay: Number(t.dataset.delay || 0),
                    clearProps: 'opacity,transform',
                  });
                }
              });
            });
          },
          { rootMargin: '0px 0px -6% 0px' },
        );
        observers.push(io);

        const rows = new Map<Element | null, number>();
        // read every position first, then write, so the browser lays the page out only once
        [...main.querySelectorAll<HTMLElement>('[data-rise], [data-mask], [data-lines], [data-map], .split')]
          .filter(below)
          .forEach((e) => {
            if (e.matches('.split')) gsap.set(e, { opacity: 0 });
            else if (e.matches('[data-mask]')) gsap.set(e, { clipPath: 'inset(100% 0% 0% 0%)' });
            else if (e.matches('[data-lines]'))
              [...e.children].forEach((row) => {
                gsap.set(row, { '--ln': 0 });
                gsap.set(kids(row), { opacity: 0, y: 14 });
              });
            else if (e.matches('[data-map]')) mapHide(e);
            else gsap.set(e, { opacity: 0, y: 24 });
            const n = rows.get(e.parentElement) ?? 0;
            rows.set(e.parentElement, n + 1);
            if (e.matches('[data-rise]')) e.dataset.delay = String(Math.min(n, 4) * 0.08);
            io.observe(e);
          });

        // photos beside a story drift at slightly different speeds
        main.querySelectorAll('.pics img').forEach((img, k) =>
          gsap.fromTo(
            img,
            { yPercent: -5 - k * 2 },
            {
              yPercent: 5 + k * 2,
              ease: 'none',
              scrollTrigger: {
                trigger: img.parentElement,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            },
          ),
        );

        const mm = gsap.matchMedia();
        mm.add('(min-width: 981px)', () => {
          const band = main.querySelector('.er-band');
          if (band) {
            const inset = () => Math.max(24, (window.innerWidth - 1360) / 2 + 24);
            gsap.fromTo(
              band,
              { clipPath: () => `inset(0px ${inset()}px 0px ${inset()}px round 18px)` },
              {
                clipPath: 'inset(0px 0px 0px 0px round 0px)',
                ease: 'none',
                scrollTrigger: {
                  trigger: band,
                  start: 'top bottom',
                  end: 'top 20%',
                  scrub: true,
                  invalidateOnRefresh: true,
                },
              },
            );
          }
          const show = main.querySelector('.show');
          if (show)
            gsap.fromTo(
              show,
              { clipPath: 'inset(7% 5% 7% 5% round 18px)' },
              {
                clipPath: 'inset(0% 0% 0% 0% round 10px)',
                ease: 'none',
                scrollTrigger: { trigger: show, start: 'top 95%', end: 'center 58%', scrub: true },
              },
            );
        });

        main.querySelectorAll<HTMLElement>('.lit').forEach((q) => {
          const s = SplitText.create(q, { type: 'words', wordsClass: 'w' });
          gsap.fromTo(
            s.words,
            { opacity: 0.55 },
            {
              opacity: 1,
              stagger: 0.08,
              ease: 'none',
              scrollTrigger: { trigger: q, start: 'top 80%', end: 'bottom 45%', scrub: 0.5 },
            },
          );
        });

        const foot = document.querySelector('.foot .wrap');
        if (foot)
          gsap.fromTo(
            foot,
            { yPercent: -18 },
            {
              yPercent: 0,
              ease: 'none',
              scrollTrigger: { trigger: '.foot', start: 'top bottom', end: 'bottom bottom', scrub: true },
            },
          );
      }, main);
      live = ctx;
      refresh = window.setTimeout(() => ScrollTrigger.refresh(), 300);
    };

    const ric = window.requestIdleCallback as typeof window.requestIdleCallback | undefined;
    const idle = ric ? ric(setup, { timeout: 700 }) : window.setTimeout(setup, 120);

    function mapHide(m: Element) {
      gsap.set(m.querySelectorAll('.rd, .route'), { strokeDasharray: 1, strokeDashoffset: 1 });
      gsap.set(m.querySelectorAll('.bld rect, .lbl'), { opacity: 0 });
      gsap.set(m.querySelectorAll('.pin'), { opacity: 0, y: -36 });
    }
    function mapIn(m: Element) {
      gsap
        .timeline({ onComplete: () => m.classList.add('live') })
        .to(
          m.querySelectorAll('.rd'),
          { strokeDashoffset: 0, duration: 1.3, stagger: 0.08, ease: 'power2.inOut' },
          0,
        )
        .to(
          m.querySelectorAll('.bld rect'),
          { opacity: 1, duration: 0.7, stagger: 0.07, ease: 'power2.out' },
          0.45,
        )
        .to(
          m.querySelectorAll('.pin'),
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.18, ease: 'back.out(2.2)' },
          0.9,
        )
        .to(m.querySelectorAll('.lbl'), { opacity: 1, duration: 0.6, stagger: 0.08 }, 1.1)
        .to(m.querySelectorAll('.route'), { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut' }, 1.3);
    }

    return () => {
      if (ric) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
      window.clearTimeout(refresh);
      observers.forEach((o) => o.disconnect());
      live?.revert();
    };
  }, [pathname]);

  return null;
}
