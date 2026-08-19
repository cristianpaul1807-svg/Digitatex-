import { useRef } from 'react';
import { gsap, useGSAP } from '../core/gsap';
import { useReducedMotion } from '../accessibility/useReducedMotion';
import { useIsMobile } from '../utilities/useMediaQuery';
import { ease } from '../presets/easings';
import type { Axis } from '../core/types';

export interface ParallaxOptions {
  /**
   * Travel across the scroll window as a fraction of the element's own size.
   * 0.2 = moves 20% of its height. Negative reverses direction.
   */
  speed?: number;
  axis?: Axis;
  scrub?: boolean | number;
  start?: string;
  end?: string;
  /** Reference: "Mobile: disable parallax". Default honours it. */
  enableOnMobile?: boolean;
}

/**
 * D02 — Parallax.
 *
 * Movement is relative to the element's own size rather than in pixels: a fixed
 * `y: 120` that drifts gently on a 900px hero lurches on a 200px card, and then
 * every breakpoint needs its own magic number.
 *
 * Disabled on touch by default. On a phone the scroll is short, the finger is
 * on the glass, and parallax mostly manifests as elements failing to keep up.
 */
export function useParallax<T extends HTMLElement = HTMLDivElement>(options: ParallaxOptions = {}) {
  const { speed = 0.18, axis = 'y', scrub = 1, start = 'top bottom', end = 'bottom top', enableOnMobile = false } = options;

  const ref = useRef<T>(null);
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();
  const off = reduced || (isMobile && !enableOnMobile);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || off) return;
      const size = axis === 'y' ? el.offsetHeight : el.offsetWidth;
      const travel = size * speed;

      gsap.fromTo(
        el,
        { [axis]: -travel / 2 },
        {
          [axis]: travel / 2,
          ease: ease.scrub,
          scrollTrigger: { trigger: el, start, end, scrub, invalidateOnRefresh: true },
        },
      );
    },
    { scope: ref, dependencies: [off, speed, axis, scrub, start, end] },
  );

  return ref;
}
