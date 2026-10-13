import { useSyncExternalStore } from 'react';

const MOBILE_BREAKPOINT = 768;

const QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`;

// Reads the media query straight from the browser and re-renders when it
// changes. No effect and no state, so there is no extra render on mount.
function subscribe(onChange: () => void) {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener('change', onChange);
  return () => mql.removeEventListener('change', onChange);
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches;
}

// The server has no screen. It renders the desktop layout, which matches
// what the old hook returned before its effect ran.
function getServerSnapshot() {
  return false;
}

export function useIsMobile() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
