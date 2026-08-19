import { useEffect, useRef } from 'react';
import { gsap } from '../core/gsap';
import { useReducedMotion } from '../accessibility/useReducedMotion';
import { useIsTouch } from '../utilities/useIsTouch';
import { ease } from '../presets/easings';

export interface MagneticOptions {
  /** How far the element follows the cursor, as a fraction of the offset. */
  strength?: number;
  /** Activation radius in px beyond the element's own box. */
  radius?: number;
  /** Drag the inner content slightly further, for depth. */
  childSelector?: string;
  childStrength?: number;
}

/**
 * G02/G03 — Magnetic Button / Magnetic Link.
 *
 * The element leans toward the cursor inside a radius and springs back on
 * leave. Three deliberate choices:
 *
 *  - The listener is on the element, not the window. A window-level pointermove
 *    for every magnetic element on a page is how this effect earned its bad
 *    reputation for jank.
 *  - `gsap.quickTo` rather than `gsap.to`, so a moving cursor retargets one
 *    live tween instead of creating a new one per event.
 *  - Touch devices get nothing — no listener is even attached. There is no
 *    cursor to be attracted to, and it would only ever fire as a jump on tap.
 */
export function useMagnetic<T extends HTMLElement = HTMLButtonElement>(options: MagneticOptions = {}) {
  const { strength = 0.35, radius = 60, childSelector, childStrength = 0.15 } = options;

  const ref = useRef<T>(null);
  const reduced = useReducedMotion();
  const isTouch = useIsTouch();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced || isTouch) return;

    const child = childSelector ? el.querySelector<HTMLElement>(childSelector) : null;
    const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: ease.micro });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: ease.micro });
    const cxTo = child ? gsap.quickTo(child, 'x', { duration: 0.6, ease: ease.micro }) : null;
    const cyTo = child ? gsap.quickTo(child, 'y', { duration: 0.6, ease: ease.micro }) : null;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const max = Math.max(r.width, r.height) / 2 + radius;
      const falloff = Math.max(0, 1 - Math.hypot(dx, dy) / max);
      xTo(dx * strength * falloff);
      yTo(dy * strength * falloff);
      cxTo?.(dx * childStrength * falloff);
      cyTo?.(dy * childStrength * falloff);
    };

    const onLeave = () => {
      xTo(0);
      yTo(0);
      cxTo?.(0);
      cyTo?.(0);
    };

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      gsap.killTweensOf(el);
      if (child) gsap.killTweensOf(child);
      gsap.set(el, { x: 0, y: 0 });
    };
  }, [reduced, isTouch, strength, radius, childSelector, childStrength]);

  return ref;
}
