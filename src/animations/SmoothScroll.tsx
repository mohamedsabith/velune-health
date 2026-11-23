'use client';

import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { ensureGsap, MOTION_OK } from './gsap';

let instance: Lenis | null = null;

/** The active smooth-scroll instance, or null (reduced motion, touch-only, or not mounted). */
export function getLenis() {
  return instance;
}

/**
 * Inertial wheel scrolling (Lenis), driven by GSAP's ticker so ScrollTrigger
 * scenes stay perfectly in sync. Not loaded at all on touch-first devices. Disabled entirely
 * for `prefers-reduced-motion`. Elements marked `data-lenis-prevent` (dialogs,
 * menus, scrolling panels) keep native wheel behaviour.
 */
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    // Touch devices keep native momentum scrolling, so there is nothing to smooth: skip the engine.
    if (!window.matchMedia(MOTION_OK).matches || window.matchMedia('(pointer: coarse)').matches) return;
    const { gsap, ScrollTrigger } = ensureGsap();
    const lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 1, anchors: { offset: -96 }, autoRaf: false });
    instance = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      instance = null;
    };
  }, []);

  // A new page starts at the top (unless it was opened at an anchor).
  useEffect(() => {
    if (instance && !window.location.hash) instance.scrollTo(0, { immediate: true, force: true });
  }, [pathname]);

  return null;
}
