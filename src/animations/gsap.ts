'use client';

import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

/**
 * GSAP runs the timelines and scroll-linked motion (opening, hero, reveals,
 * slideshow, filters). Small state transitions in React components use Motion.
 */
let registered = false;

export function ensureGsap() {
  if (!registered && typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger, SplitText, Flip);
    gsap.defaults({ ease: 'expo.out', duration: 1.1 });
    ScrollTrigger.config({ ignoreMobileResize: true });
    registered = true;
  }
  return { gsap, ScrollTrigger, SplitText, Flip };
}

export const MOTION_OK = '(prefers-reduced-motion: no-preference)';

export const prefersMotion = () => typeof window !== 'undefined' && window.matchMedia(MOTION_OK).matches;

/** Session flag for the opening sequence (set by /scripts/intro-gate.js and the intro itself). */
export const INTRO_KEY = 'velune:intro';
