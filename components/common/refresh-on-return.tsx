'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

type Props = {
  after?: number;
};

/**
 * Reloads the page data when the app comes back into view after a while.
 *
 * A page about "today" goes stale when Dersly is left open or resumed from
 * the home screen the next morning. This fetches fresh data without a full
 * reload, so scroll position stays where it was.
 */
export default function RefreshOnReturn({ after = 60_000 }: Props) {
  const router = useRouter();
  const hiddenAt = useRef<number | null>(null);

  useEffect(() => {
    function handleVisibility() {
      if (document.visibilityState === 'hidden') {
        hiddenAt.current = Date.now();
        return;
      }

      const away =
        hiddenAt.current === null ? 0 : Date.now() - hiddenAt.current;
      hiddenAt.current = null;

      if (away >= after) router.refresh();
    }

    document.addEventListener('visibilitychange', handleVisibility);
    return () =>
      document.removeEventListener('visibilitychange', handleVisibility);
  }, [router, after]);

  return null;
}
