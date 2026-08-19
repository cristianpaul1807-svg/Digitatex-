import { useRef } from 'react';
import { gsap, useGSAP } from '../core/gsap';
import { useReducedMotion } from '../accessibility/useReducedMotion';
import { useIsDesktop } from '../utilities/useMediaQuery';
import { ease } from '../presets/easings';

export interface HorizontalScrollOptions {
  /** Extra scroll distance beyond the track width, in viewport heights. */
  padding?: number;
  desktopOnly?: boolean;
}

/**
 * D04 — Horizontal Scroll.
 *
 * Vertical scrolling drives a horizontal track. The pin distance is computed in
 * a function so `invalidateOnRefresh` can recompute it when fonts land or the
 * viewport changes — hard-coding it is why these sections usually end early or
 * leave a dead gap.
 *
 * On touch the track becomes a normal swipeable strip. Hijacking vertical
 * scroll on a phone to move something sideways is the most disorienting pattern
 * in this library, and phones already do horizontal scrolling well.
 */
export function useHorizontalScroll<T extends HTMLElement = HTMLDivElement>(options: HorizontalScrollOptions = {}) {
  const { padding = 0.2, desktopOnly = true } = options;
  const ref = useRef<T>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const reduced = useReducedMotion();
  const isDesktop = useIsDesktop();
  const active = isDesktop && !reduced && desktopOnly;

  useGSAP(
    () => {
      const root = ref.current;
      const track = trackRef.current;
      if (!root || !track || !active) return;

      const getDistance = () => Math.max(0, track.scrollWidth - window.innerWidth);

      gsap.to(track, {
        x: () => -getDistance(),
        ease: ease.scrub,
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: () => '+=' + (getDistance() + window.innerHeight * padding),
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    },
    { scope: ref, dependencies: [active, padding] },
  );

  return { ref, trackRef, active };
}
