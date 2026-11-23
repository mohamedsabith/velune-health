'use client';

import { useEffect, useRef, useState } from 'react';
import { getLenis } from '@/animations/SmoothScroll';
import { ensureGsap, INTRO_KEY, prefersMotion } from '@/animations/gsap';

declare global {
  interface Window {
    __veluneOpened?: boolean;
  }
}

/** Tells the hero that the page is visible and its entrance can play. */
function announceOpen() {
  window.__veluneOpened = true;
  window.dispatchEvent(new Event('velune:open'));
}

const NAME = 'Velune Hospital';

/**
 * The opening: on royal blue, the Velune mark draws itself (square, V, gold plus)
 * and the name rises beside it. The plus moves to the centre, becomes an opening
 * in the blue, and grows until the hospital fills the screen. About 3.5 seconds,
 * once per visit, skippable, and absent with reduced motion.
 */
export function Intro() {
  const root = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const el = root.current;
    let seen = document.documentElement.dataset.intro === 'seen' || !prefersMotion();
    if (!el || seen) {
      setGone(true);
      announceOpen();
      return;
    }
    try {
      sessionStorage.setItem(INTRO_KEY, 'seen');
    } catch {
      /* private mode */
    }
    const { gsap } = ensureGsap();
    const html = document.documentElement;
    html.classList.add('is-opening');
    getLenis()?.stop();

    const ground = el.querySelector<HTMLElement>('.p-ground')!;
    const brand = el.querySelector<HTMLElement>('.p-brand')!;
    const mark = el.querySelector<SVGSVGElement>('.p-mark')!;
    const q = <T extends Element>(s: string) => mark.querySelector<T>(s)!;

    const finish = () => {
      html.classList.remove('is-opening');
      getLenis()?.start();
    };

    const ctx = gsap.context(() => {
      mark.querySelectorAll<SVGGeometryElement>('.sq, .v, .pl').forEach((p) => {
        const length = p.getTotalLength();
        gsap.set(p, { strokeDasharray: length, strokeDashoffset: length });
      });
      gsap.set([q('.v'), ...mark.querySelectorAll('.pl')], { opacity: 0 });
      gsap.set(el.querySelectorAll('.p-name span, .p-place span'), { yPercent: 110 });

      const setHole = (cx: number, cy: number, size: number) => {
        const s = `${size}px ${size}px, 100% 100%`;
        const p = `${cx - size / 2}px ${cy - size / 2}px, 0 0`;
        ground.style.setProperty('-webkit-mask-size', s);
        ground.style.maskSize = s;
        ground.style.setProperty('-webkit-mask-position', p);
        ground.style.maskPosition = p;
      };

      const tl = gsap.timeline();
      tl.to(q('.sq'), { strokeDashoffset: 0, duration: 0.8, ease: 'power2.inOut' }, 0.1)
        .set(q('.v'), { opacity: 1 }, 0.45)
        .to(q('.v'), { strokeDashoffset: 0, duration: 0.65, ease: 'power3.inOut' }, 0.45)
        .set(mark.querySelectorAll('.pl'), { opacity: 1 }, 0.9)
        .to(q('.pl-v'), { strokeDashoffset: 0, duration: 0.3, ease: 'power2.out' }, 0.9)
        .to(q('.pl-h'), { strokeDashoffset: 0, duration: 0.3, ease: 'power2.out' }, 1.05)
        .to(
          el.querySelectorAll('.p-name span'),
          { yPercent: 0, duration: 1, stagger: 0.025, ease: 'expo.out' },
          1.0,
        )
        .to(el.querySelectorAll('.p-place span'), { yPercent: 0, duration: 0.9, ease: 'expo.out' }, 1.35)
        .addLabel('gather', 2.25)
        .to(el.querySelector('.p-words'), { opacity: 0, x: 20, duration: 0.45, ease: 'power2.in' }, 'gather')
        .to([q('.sq'), q('.v')], { opacity: 0, duration: 0.4, ease: 'power2.in' }, 'gather')
        .add(() => {
          // bring the plus to the centre of the screen and enlarge it
          const r = mark.getBoundingClientRect();
          const unit = r.width / 32;
          const px = r.left + 16 * unit;
          const py = r.top + 8.7 * unit;
          gsap.to(brand, {
            x: `+=${innerWidth / 2 - px}`,
            y: `+=${innerHeight / 2 - py}`,
            duration: 0.7,
            ease: 'expo.inOut',
          });
          gsap.to(mark, { scale: 1.8, transformOrigin: '50% 27.2%', duration: 0.7, ease: 'expo.inOut' });
        }, 'gather+=0.15')
        .add(() => {
          // the gold plus becomes an opening onto the hospital, and grows
          const r = mark.getBoundingClientRect();
          const size = (6.2 + 2.4) * (r.width / 32);
          const cx = innerWidth / 2;
          const cy = innerHeight / 2;
          setHole(cx, cy, size);
          gsap.to(mark, { opacity: 0, duration: 0.15 });
          const o = { s: size };
          gsap.to(o, {
            s: Math.max(innerWidth, innerHeight) * 7,
            duration: 1.25,
            ease: 'expo.in',
            onUpdate: () => setHole(cx, cy, o.s),
            onComplete: () => setGone(true),
          });
          gsap.delayedCall(0.55, () => {
            finish();
            announceOpen();
          });
        }, 'gather+=0.95');

      el.querySelector('.p-skip')?.addEventListener('click', () => {
        if (tl.time() < (tl.labels.gather ?? 0)) tl.seek('gather');
      });
    }, el);

    return () => {
      seen = true;
      ctx.revert();
      finish();
    };
  }, []);

  if (gone) return null;
  return (
    <div id="intro" ref={root} aria-hidden="true">
      <div className="p-ground" />
      <div className="p-brand">
        <svg className="p-mark" viewBox="0 0 32 32">
          <rect className="sq" x="0.8" y="0.8" width="30.4" height="30.4" rx="8" />
          <path className="v" d="M9.2 11.5l6.8 13 6.8-13" />
          <path className="pl pl-v" d="M16 5.6v6.2" />
          <path className="pl pl-h" d="M12.9 8.7h6.2" />
        </svg>
        <div className="p-words">
          <p className="p-name">
            {[...NAME].map((c, i) => (
              <span key={i}>{c}</span>
            ))}
          </p>
          <p className="p-place">
            <span>Kochi, Kerala. Caring for families since 2009</span>
          </p>
        </div>
      </div>
      <button className="p-skip" type="button" tabIndex={-1}>
        Skip intro
      </button>
    </div>
  );
}
