import { useSyncExternalStore } from 'react';

/** Live media-query subscription. Same pattern as useReducedMotion. */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (cb) => {
      if (typeof window === 'undefined' || !window.matchMedia) return () => {};
      const mql = window.matchMedia(query);
      mql.addEventListener('change', cb);
      return () => mql.removeEventListener('change', cb);
    },
    () => (typeof window === 'undefined' || !window.matchMedia ? false : window.matchMedia(query).matches),
    () => false,
  );
}

/** Breakpoints match the Tailwind config so CSS and JS never disagree. */
export const BREAKPOINTS = {
  mobile: '(max-width: 767px)',
  tablet: '(min-width: 768px) and (max-width: 1023px)',
  desktop: '(min-width: 1024px)',
} as const;

export const useIsMobile = () => useMediaQuery(BREAKPOINTS.mobile);
export const useIsDesktop = () => useMediaQuery(BREAKPOINTS.desktop);
