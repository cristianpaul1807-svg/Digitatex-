import { useSyncExternalStore } from 'react';

/**
 * `prefers-reduced-motion: reduce`, as a live subscription.
 *
 * Reference: "prefers-reduced-motion: disable scroll-triggered animations".
 *
 * It does not cache a single boolean for the session on purpose. The setting
 * can be toggled while the page is open — macOS and iOS both allow it — and a
 * motion system that only checks once keeps animating for a user who just asked
 * it to stop.
 */
const QUERY = '(prefers-reduced-motion: reduce)';

function subscribe(callback: () => void) {
  if (typeof window === 'undefined' || !window.matchMedia) return () => {};
  const mql = window.matchMedia(QUERY);
  mql.addEventListener('change', callback);
  return () => mql.removeEventListener('change', callback);
}

function getSnapshot() {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia(QUERY).matches;
}

export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

/** Imperative read, for code paths outside React (GSAP callbacks, etc.). */
export function prefersReducedMotion(): boolean {
  return getSnapshot();
}
