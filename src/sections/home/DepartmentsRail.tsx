'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ensureGsap, prefersMotion } from '@/animations/gsap';
import { Icon } from '@/components/ui/Icon';
import { departments } from '@/content/departments';
import { photos } from '@/content/images';

/** A sideways rail of departments: drag it, use the arrows, or swipe on a phone. */
export function DepartmentsRail() {
  const rail = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  useEffect(() => {
    const r = rail.current;
    if (!r) return;
    const update = () => {
      const max = r.scrollWidth - r.clientWidth;
      if (bar.current)
        bar.current.style.transform = `scaleX(${Math.min(1, (r.scrollLeft + r.clientWidth) / r.scrollWidth)})`;
      setEdge({ start: r.scrollLeft < 4, end: r.scrollLeft > max - 4 });
    };
    // drag with a mouse; touch keeps its native swipe
    let down = false;
    let moved = 0;
    let sx = 0;
    let sl = 0;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      down = true;
      moved = 0;
      sx = e.clientX;
      sl = r.scrollLeft;
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - sx;
      moved = Math.max(moved, Math.abs(dx));
      if (moved > 4) r.classList.add('drag');
      r.scrollLeft = sl - dx;
    };
    const onUp = () => {
      if (!down) return;
      down = false;
      requestAnimationFrame(() => r.classList.remove('drag'));
    };
    const onClick = (e: MouseEvent) => {
      if (moved > 4) {
        e.preventDefault();
        moved = 0;
      }
    };
    r.addEventListener('scroll', update, { passive: true });
    r.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    r.addEventListener('click', onClick, true);
    window.addEventListener('resize', update);
    update();

    let io: IntersectionObserver | undefined;
    let ctx: { revert(): void } | undefined;
    if (prefersMotion() && r.getBoundingClientRect().top > window.innerHeight * 0.92) {
      const { gsap } = ensureGsap();
      const cards = r.querySelectorAll('.dcard');
      ctx = gsap.context(() => gsap.set(cards, { x: 160, opacity: 0 }));
      io = new IntersectionObserver(
        ([en]) => {
          if (!en?.isIntersecting) return;
          io?.disconnect();
          gsap.to(cards, {
            x: 0,
            opacity: 1,
            duration: 1.4,
            stagger: 0.09,
            ease: 'expo.out',
            clearProps: 'transform,opacity',
          });
        },
        { rootMargin: '0px 0px -10% 0px' },
      );
      io.observe(r);
    }
    return () => {
      r.removeEventListener('scroll', update);
      r.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      r.removeEventListener('click', onClick, true);
      window.removeEventListener('resize', update);
      io?.disconnect();
      ctx?.revert();
    };
  }, []);

  const step = (dir: number) => {
    const r = rail.current;
    const card = r?.querySelector<HTMLElement>('.dcard');
    if (!r || !card) return;
    r.scrollBy({ left: dir * (card.offsetWidth + 20) * 2, behavior: prefersMotion() ? 'smooth' : 'auto' });
  };

  return (
    <div className="rail-wrap">
      <div className="rail" ref={rail} role="region" aria-label="Departments, scroll sideways" tabIndex={0}>
        {departments.map((d) => (
          <Link className="dcard" href={`/departments/${d.slug}`} key={d.slug}>
            <figure className="pic" style={{ margin: 0 }}>
              <Image
                src={photos[d.image].src}
                alt=""
                fill
                sizes="330px"
                placeholder="blur"
                style={{ objectFit: 'cover', objectPosition: d.imagePosition ?? '50% 40%' }}
              />
            </figure>
            <h3>{d.name}</h3>
            <p>{d.short}</p>
          </Link>
        ))}
      </div>
      <div className="wrap rail-ctl">
        <span className="rail-prog" aria-hidden="true">
          <i ref={bar} />
        </span>
        <div className="rail-btns">
          <button
            type="button"
            onClick={() => step(-1)}
            disabled={edge.start}
            aria-label="Previous departments"
          >
            <Icon name="left" />
          </button>
          <button type="button" onClick={() => step(1)} disabled={edge.end} aria-label="Next departments">
            <Icon name="right" />
          </button>
        </div>
      </div>
    </div>
  );
}
