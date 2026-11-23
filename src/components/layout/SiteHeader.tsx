'use client';

import * as Dialog from '@radix-ui/react-dialog';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { Logo } from '@/components/ui/Logo';
import { primaryNav } from '@/content/routes';
import { site } from '@/content/site';
import { tel } from '@/lib/utils';

/**
 * Sticky header. A gold line along its bottom shows how far down the page you are;
 * it slides out of the way while you scroll down and returns as soon as you scroll up.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const ref = useRef<HTMLElement>(null);
  const bar = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const h = ref.current;
    if (!h) return;
    let last = window.scrollY;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
      h.classList.toggle('scrolled', y > 8);
      if (Math.abs(y - last) > 4) {
        h.classList.toggle('hide', y > last && y > 720);
        last = y;
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  const isActive = (path: string) => pathname === path || pathname.startsWith(`${path}/`);

  return (
    <header className="head" ref={ref}>
      <div className="wrap">
        <Logo />
        <nav className="nav" aria-label="Main">
          {primaryNav.map((item) => (
            <Link
              key={item.path}
              href={item.path as never}
              aria-current={isActive(item.path) ? 'page' : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="head-r">
          <Link className="search-btn" href="/doctors">
            <Icon name="search" />
            Search
          </Link>
          <Link className="btn btn-blue" href="/book">
            Book appointment
          </Link>
          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger className="menu-btn" aria-label="Open menu">
              <Icon name="menu" />
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="menu-overlay" />
              <Dialog.Content className="menu-panel" data-lenis-prevent>
                <div className="menu-top">
                  <Dialog.Title className="sr">Menu</Dialog.Title>
                  <Logo />
                  <Dialog.Close className="menu-btn" aria-label="Close menu">
                    <Icon name="close" />
                  </Dialog.Close>
                </div>
                <nav aria-label="Main" className="menu-nav">
                  {primaryNav.map((item) => (
                    <Link
                      key={item.path}
                      href={item.path as never}
                      aria-current={isActive(item.path) ? 'page' : undefined}
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                  <Link href="/emergency" onClick={() => setOpen(false)}>
                    Emergency
                  </Link>
                  <Link href="/contact" onClick={() => setOpen(false)}>
                    Contact us
                  </Link>
                </nav>
                <div className="menu-acts">
                  <Link className="btn btn-blue" href="/book" onClick={() => setOpen(false)}>
                    Book an appointment
                  </Link>
                  <a className="btn btn-red" href={tel(site.phones.emergency)}>
                    <Icon name="phone" />
                    Emergency {site.phones.emergency}
                  </a>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
      <div className="progress" aria-hidden="true">
        <i ref={bar} />
      </div>
    </header>
  );
}
