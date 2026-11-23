'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ensureGsap, prefersMotion } from '@/animations/gsap';
import { Icon } from '@/components/ui/Icon';
import { photos, type ImageKey } from '@/content/images';
import { site } from '@/content/site';

type Tile = [ImageKey, string, string, string?];

const COLUMNS: Tile[][] = [
  [
    ['hd-care', 'Day-care treatment', '4/5', '45% 30%'],
    ['dr-meera', 'Dr. Meera K., cardiologist', '3/4'],
    ['lab', 'Lab results within 6 hours', '1/1'],
    ['room', 'Private rooms with a view', '4/5'],
  ],
  [
    ['hd-kids', 'Paediatrics clinic', '3/4', '60% 30%'],
    ['dr-leena', 'Dr. Leena R., obstetrician', '3/4'],
    ['lobby', 'Main reception, Gate 1', '1/1'],
    ['icu', 'Intensive care, 30 beds', '4/5'],
  ],
  [
    ['hd-heart', 'Cardiology consultation', '4/5', '62% 30%'],
    ['dr-vivek', 'Dr. Vivek P., orthopaedics', '3/4'],
    ['child-check', 'Children’s ward', '1/1'],
    ['ot', 'Eight operation theatres', '3/4'],
  ],
];
const DIRS = [1, -1, 1];
const SPEEDS = [46, 54, 40];
const IDEAS = [
  'Cardiology',
  'Dr. Meera K.',
  'Knee replacement',
  'MRI scan',
  'Child vaccination',
  'Health check for 40+',
];

function Tiles({ items, eager }: { items: Tile[]; eager: boolean }) {
  return (
    <>
      {items.map(([key, caption, aspect, position], i) => (
        <figure className="tile" style={{ aspectRatio: aspect }} key={key}>
          <Image
            src={photos[key].src}
            alt=""
            fill
            sizes="(max-width: 980px) 45vw, 260px"
            priority={eager && i < 2}
            placeholder="blur"
            style={{ objectFit: 'cover', objectPosition: position ?? '50% 25%' }}
          />
          <figcaption>{caption}</figcaption>
        </figure>
      ))}
    </>
  );
}

/**
 * Moments: the headline, search and quick links sit beside three columns of
 * photographs that glide up and down at different speeds. Scrolling gives the
 * columns a push; pointing at one slows it to a stop; the pause button stops all.
 */
export function MomentsHero() {
  const root = useRef<HTMLElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  const loopsRef = useRef<gsap.core.Tween[]>([]);

  useEffect(() => {
    const el = root.current;
    if (!el || !prefersMotion()) return;
    const { gsap, ScrollTrigger } = ensureGsap();
    const cols = [...el.querySelectorAll<HTMLElement>('.m-cols .col')];
    let settle = 0;

    const ctx = gsap.context(() => {
      const startLoops = () => {
        const loops = cols.map((c, i) => {
          const t = c.querySelector('.track')!;
          return DIRS[i]! > 0
            ? gsap.fromTo(
                t,
                { yPercent: 0 },
                { yPercent: -50, duration: SPEEDS[i], ease: 'none', repeat: -1 },
              )
            : gsap.fromTo(
                t,
                { yPercent: -50 },
                { yPercent: 0, duration: SPEEDS[i], ease: 'none', repeat: -1 },
              );
        });
        loopsRef.current = loops;
        loops.forEach((l) =>
          gsap.fromTo(
            l,
            { timeScale: 0 },
            { timeScale: pausedRef.current ? 0 : 1, duration: 1.6, ease: 'power2.inOut' },
          ),
        );
        cols.forEach((c, i) => {
          c.addEventListener(
            'mouseenter',
            () =>
              pausedRef.current ||
              gsap.to(loops[i]!, { timeScale: 0, duration: 0.8, ease: 'power2.out', overwrite: true }),
          );
          c.addEventListener(
            'mouseleave',
            () =>
              pausedRef.current ||
              gsap.to(loops[i]!, { timeScale: 1, duration: 1, ease: 'power2.inOut', overwrite: true }),
          );
        });
        ScrollTrigger.create({
          start: 0,
          end: 'max',
          onUpdate: (self) => {
            if (pausedRef.current) return;
            const v = Math.min(Math.abs(self.getVelocity()) / 260, 7);
            loops.forEach((l) => gsap.to(l, { timeScale: 1 + v, duration: 0.25, overwrite: true }));
            window.clearTimeout(settle);
            settle = window.setTimeout(
              () =>
                loops.forEach((l) =>
                  gsap.to(l, { timeScale: 1, duration: 1.4, ease: 'power2.out', overwrite: true }),
                ),
              140,
            );
          },
        });
        ScrollTrigger.create({
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          onToggle: (s) => loops.forEach((l) => (s.isActive ? l.play() : l.pause())),
        });
      };

      // the entrance waits (paused, already in its starting state) until the opening reveals the page
      const tl = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } });
      tl.from(
        '.head .logo, .head .nav a, .head-r > *',
        {
          y: -16,
          clipPath: 'inset(0% 0% 100% 0%)',
          duration: 0.9,
          stagger: 0.04,
          ease: 'power3.out',
          clearProps: 'clipPath',
        },
        0.05,
      )
        .from('.m-title .ln > span', { yPercent: 112, duration: 1.4, stagger: 0.12 }, 0.15)
        .from(
          '.m-sub',
          { y: 24, clipPath: 'inset(0% 0% 100% 0%)', duration: 1.1, clearProps: 'clipPath' },
          0.55,
        )
        .fromTo(
          '.m-search',
          { clipPath: 'inset(0% 100% 0% 0% round 12px)' },
          {
            clipPath: 'inset(0% 0% 0% 0% round 12px)',
            duration: 1.3,
            ease: 'expo.inOut',
            clearProps: 'clipPath',
          },
          0.6,
        )
        .from('.m-search > *', { x: -12, duration: 0.8, stagger: 0.06 }, 1.1)
        .from(
          '.m-links li, .m-er',
          { y: 18, clipPath: 'inset(0% 0% 100% 0%)', duration: 0.9, stagger: 0.06, clearProps: 'clipPath' },
          0.95,
        )
        .from(
          cols,
          { yPercent: (i) => (DIRS[i]! > 0 ? 70 : -70), opacity: 0, duration: 1.8, stagger: 0.12 },
          0.1,
        )
        .add(startLoops, 1.2);
      const play = () => tl.play();
      if (window.__veluneOpened) play();
      else window.addEventListener('velune:open', play, { once: true });

      // as the hero leaves, the columns drift apart at different speeds
      [-140, -50, -220].forEach(
        (y, i) =>
          cols[i] &&
          gsap.to(cols[i], {
            y,
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
          }),
      );
      gsap.to('.m-copy', {
        y: -60,
        opacity: 0.3,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
      });

      return () => window.removeEventListener('velune:open', play);
    }, el);

    const onVisibility = () => loopsRef.current.forEach((l) => (document.hidden ? l.pause() : l.play()));
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.clearTimeout(settle);
      ctx.revert();
    };
  }, []);

  // suggestions type themselves into the empty search box until it is focused
  useEffect(() => {
    const field = input.current;
    if (!field || !prefersMotion()) return;
    const base = field.placeholder;
    let i = 0;
    let timer = 0;
    let stopped = false;
    const go = (word: string, n: number, back = false) => {
      if (stopped) return;
      field.placeholder = `Try: ${word.slice(0, n)}`;
      if (!back && n < word.length) timer = window.setTimeout(() => go(word, n + 1), 55 + Math.random() * 45);
      else if (!back) timer = window.setTimeout(() => go(word, n, true), 1700);
      else if (n > 0) timer = window.setTimeout(() => go(word, n - 1, true), 28);
      else {
        i = (i + 1) % IDEAS.length;
        timer = window.setTimeout(() => go(IDEAS[i]!, 1), 350);
      }
    };
    timer = window.setTimeout(() => go(IDEAS[0]!, 1), 2800);
    const stop = () => {
      stopped = true;
      window.clearTimeout(timer);
      field.placeholder = base;
    };
    field.addEventListener('focus', stop);
    return () => {
      stopped = true;
      window.clearTimeout(timer);
      field.removeEventListener('focus', stop);
    };
  }, []);

  const togglePause = () => {
    const next = !pausedRef.current;
    pausedRef.current = next;
    setPaused(next);
    const { gsap } = ensureGsap();
    loopsRef.current.forEach((l) =>
      gsap.to(l, { timeScale: next ? 0 : 1, duration: next ? 0.6 : 0.8, overwrite: true }),
    );
  };

  const onSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = input.current?.value.trim();
    router.push((q ? `/doctors?q=${encodeURIComponent(q)}` : '/doctors') as never);
  };

  return (
    <section className="m-hero" ref={root} aria-labelledby="hero-title">
      <div className="wrap m-grid">
        <div className="m-copy">
          <h1 id="hero-title" className="m-title">
            <span className="ln">
              <span>Care that takes</span>
            </span>
            <span className="ln">
              <span>its time.</span>
            </span>
          </h1>
          <p className="m-sub">
            A {site.facts.beds}-bed multi-speciality hospital in Kochi. First consultations last 45 minutes,
            and you leave with a written plan you can understand.
          </p>
          <form
            className="m-search"
            role="search"
            onSubmit={onSearch}
            toolname="search_site"
            tooldescription="Search Velune Hospital for a doctor, department, condition or treatment. Opens the doctor finder with the results."
          >
            <Icon name="search" />
            <label className="sr" htmlFor="q">
              Search doctors, departments and treatments
            </label>
            <input
              ref={input}
              id="q"
              name="q"
              type="search"
              toolparamdescription="A doctor's name, a department, a condition or a treatment, for example knee pain"
              placeholder="Search a doctor, department or treatment"
              autoComplete="off"
            />
            <button className="btn btn-blue" type="submit">
              Search
            </button>
          </form>
          <ul className="m-links">
            <li>
              <Link href="/book">
                <Icon name="cal" />
                Book an appointment
              </Link>
            </li>
            <li>
              <Link href="/doctors">
                <Icon name="user" />
                Find a doctor
              </Link>
            </li>
            <li>
              <Link href="/diagnostics">
                <Icon name="file" />
                Lab reports and tests
              </Link>
            </li>
            <li>
              <Link className="urgent" href="/emergency">
                <Icon name="amb" />
                Emergency care
              </Link>
            </li>
          </ul>
          <p className="m-er">
            <i aria-hidden="true" />
            <span>
              <b>Emergency is open.</b> Average wait to be seen: {site.facts.erWaitMinutes} minutes.
            </span>
          </p>
        </div>
        <div className="m-cols" aria-hidden="true">
          {COLUMNS.map((items, k) => (
            <div className={`col c${k}`} key={k}>
              <div className="track">
                <Tiles items={items} eager={k < 2} />
                <div className="dup">
                  <Tiles items={items} eager={false} />
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          className="m-pause"
          type="button"
          onClick={togglePause}
          aria-label={paused ? 'Play moving photos' : 'Pause moving photos'}
        >
          <Icon name={paused ? 'play' : 'pause'} />
        </button>
      </div>
    </section>
  );
}
