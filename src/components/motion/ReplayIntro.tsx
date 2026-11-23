'use client';

import { usePathname, useRouter } from 'next/navigation';
import { INTRO_KEY } from '@/animations/gsap';

/** Footer button that plays the opening sequence again. */
export function ReplayIntro() {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <button
      type="button"
      className="replay"
      onClick={() => {
        try {
          sessionStorage.removeItem(INTRO_KEY);
        } catch {
          /* private mode */
        }
        delete document.documentElement.dataset.intro;
        window.__veluneOpened = false;
        window.scrollTo(0, 0);
        if (pathname === '/') window.location.reload();
        else router.push('/');
      }}
    >
      Replay intro
    </button>
  );
}
