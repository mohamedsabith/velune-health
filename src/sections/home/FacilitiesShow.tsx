'use client';

import Image from 'next/image';
import { useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { ensureGsap, prefersMotion } from '@/animations/gsap';
import { Icon } from '@/components/ui/Icon';
import { facilities } from '@/content/care';
import { photos } from '@/content/images';

const HOLD = 6;

/**
 * Facilities slideshow. Each new room wipes across the last like a film cut, its
 * caption rises line by line, and a bar fills while each slide is shown. Plays
 * only while on screen, with previous, next and pause controls.
 */
export function FacilitiesShow() {
  const root = useRef<HTMLDivElement>(null);
  const [cur, setCur] = useState(0);
  const reduce = useReducedMotion();
  const [userPaused, setUserPaused] = useState(false);
  const playing = !reduce && !userPaused;
  const state = useRef({ cur: 0, busy: false, playing: true, visible: false });
  const bar = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    state.current.playing = prefersMotion();
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([en]) => {
      state.current.visible = Boolean(en?.isIntersecting);
      if (!bar.current) return;
      if (state.current.visible && state.current.playing) bar.current.play();
      else bar.current.pause();
    });
    io.observe(el);
    run(0);
    return () => {
      io.disconnect();
      bar.current?.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function run(i: number) {
    const el = root.current;
    if (!el) return;
    const { gsap } = ensureGsap();
    bar.current?.kill();
    const b = el.querySelectorAll<HTMLElement>('.bars b')[i];
    if (!b) return;
    el.querySelectorAll<HTMLElement>('.bars b').forEach((x, k) => gsap.set(x, { scaleX: k < i ? 1 : 0 }));
    if (prefersMotion()) {
      const img = el.querySelectorAll('.slide img')[i];
      if (img) gsap.fromTo(img, { scale: 1.1 }, { scale: 1, duration: HOLD + 1.5, ease: 'none' });
    }
    bar.current = gsap.to(b, {
      scaleX: 1,
      duration: HOLD,
      ease: 'none',
      paused: !(state.current.playing && state.current.visible),
      onComplete: () => go(i + 1, 1),
    });
  }

  function go(n: number, dir: number) {
    const el = root.current;
    const s = state.current;
    if (!el || s.busy) return;
    const next = (n + facilities.length) % facilities.length;
    if (next === s.cur) return;
    const { gsap, SplitText } = ensureGsap();
    const slides = el.querySelectorAll<HTMLElement>('.slide');
    const a = slides[s.cur]!;
    const b = slides[next]!;
    s.busy = prefersMotion();
    gsap.set(a, { zIndex: 1 });
    gsap.set(b, { zIndex: 2 });
    b.classList.add('on');
    const end = () => {
      a.classList.remove('on');
      gsap.set([a, b], { clearProps: 'zIndex,clipPath' });
      gsap.set(a.querySelector('img'), { xPercent: 0 });
      s.busy = false;
    };
    s.cur = next;
    setCur(next);
    if (s.busy) {
      gsap.set(b.querySelector('img'), { xPercent: 0 });
      gsap
        .timeline({ defaults: { duration: 1.25, ease: 'expo.inOut' }, onComplete: end })
        .fromTo(
          b,
          { clipPath: dir > 0 ? 'inset(0% 0% 0% 100%)' : 'inset(0% 100% 0% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)' },
          0,
        )
        .to(a.querySelector('img'), { xPercent: -12 * dir }, 0);
      requestAnimationFrame(() => {
        const cap = el.querySelectorAll<HTMLElement>('.cap')[next];
        const h = cap?.querySelector('h3');
        if (!cap || !h) return;
        const split = SplitText.create(h, { type: 'lines', mask: 'lines' });
        gsap.from(split.lines, {
          yPercent: 110,
          duration: 1.1,
          stagger: 0.08,
          ease: 'expo.out',
          delay: 0.45,
          onComplete: () => split.revert(),
        });
        gsap.from(cap.querySelector('p'), {
          opacity: 0,
          y: 10,
          duration: 0.7,
          delay: 0.35,
          ease: 'power3.out',
        });
      });
    } else end();
    run(next);
  }

  const toggle = () => {
    const s = state.current;
    s.playing = !s.playing;
    setUserPaused(!s.playing);
    if (!bar.current) return;
    if (s.playing && s.visible) bar.current.play();
    else bar.current.pause();
  };

  return (
    <div
      className="show"
      ref={root}
      role="region"
      aria-roledescription="carousel"
      aria-label="Hospital facilities"
    >
      {facilities.map((f, i) => (
        <div
          className={i === 0 ? 'slide on' : 'slide'}
          key={f.name}
          role="group"
          aria-roledescription="slide"
          aria-label={`${i + 1} of ${facilities.length}: ${f.name}`}
          aria-hidden={i !== cur}
        >
          <Image
            src={photos[f.image].src}
            alt={photos[f.image].alt}
            fill
            sizes="(max-width: 1360px) 100vw, 1264px"
            placeholder="blur"
            style={{ objectFit: 'cover' }}
          />
        </div>
      ))}
      <div className="show-ui">
        <div aria-live="polite">
          {facilities.map((f, i) => (
            <div className={i === cur ? 'cap on' : 'cap'} key={f.name}>
              <p>{f.name}</p>
              <h3>{f.line}</h3>
            </div>
          ))}
        </div>
        <div className="show-ctrl">
          <div className="bars">
            {facilities.map((f, i) => (
              <button
                key={f.name}
                type="button"
                aria-label={`Show slide ${i + 1}: ${f.name}`}
                aria-current={i === cur ? 'true' : undefined}
                onClick={() => go(i, i > state.current.cur ? 1 : -1)}
              >
                <i>
                  <b />
                </i>
              </button>
            ))}
          </div>
          <div className="ctrl">
            <button type="button" aria-label="Previous slide" onClick={() => go(state.current.cur - 1, -1)}>
              <Icon name="left" />
            </button>
            <button
              type="button"
              aria-label={playing ? 'Pause slideshow' : 'Play slideshow'}
              onClick={toggle}
            >
              <Icon name={playing ? 'pause' : 'play'} />
            </button>
            <button type="button" aria-label="Next slide" onClick={() => go(state.current.cur + 1, 1)}>
              <Icon name="right" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
