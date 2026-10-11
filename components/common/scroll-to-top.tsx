'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useLayoutEffect, useRef } from 'react';

/**
 * Starts every new page at the top.
 *
 * Next.js only scrolls up when the top of the new page is outside the screen.
 * A sticky header sits over the top of the screen, so after a small scroll the
 * new title counts as "visible" while it is really under the header, and the
 * page opens half hidden.
 *
 * Back and forward are left alone, so the browser still restores the position
 * you were at.
 */
export default function ScrollToTop() {
  const pathname = usePathname();
  const lastPathname = useRef(pathname);
  const historyTarget = useRef<string | null>(null);

  useEffect(() => {
    // By the time popstate fires the address bar already shows the page that
    // back or forward is going to.
    function handlePopState() {
      historyTarget.current = window.location.pathname;
    }

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useLayoutEffect(() => {
    if (lastPathname.current === pathname) return;
    lastPathname.current = pathname;

    const cameFromHistory = historyTarget.current === pathname;
    historyTarget.current = null;

    // A link to #something should land on that part of the page.
    if (cameFromHistory || window.location.hash) return;

    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}
