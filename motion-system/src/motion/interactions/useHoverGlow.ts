import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../accessibility/useReducedMotion';
import { useIsTouch } from '../utilities/useIsTouch';
import { rafThrottle } from '../utilities/performance';

export interface HoverGlowOptions {
  size?: number;
  color?: string;
  intensity?: number;
}

/**
 * G04 — Hover Glow.
 *
 * A radial highlight that tracks the cursor across a surface.
 *
 * Implemented by writing two CSS custom properties that a static
 * `radial-gradient` in the stylesheet already references. That matters: the
 * alternative — rebuilding the `background-image` string on every move —
 * reparses a gradient per event and repaints the whole element.
 */
export function useHoverGlow<T extends HTMLElement = HTMLDivElement>(options: HoverGlowOptions = {}) {
  const { size = 320, color = 'rgba(200,242,74,0.16)', intensity = 1 } = options;

  const ref = useRef<T>(null);
  const reduced = useReducedMotion();
  const isTouch = useIsTouch();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.style.setProperty('--glow-size', size + 'px');
    el.style.setProperty('--glow-color', color);
    el.style.setProperty('--glow-opacity', '0');

    // Reduced motion keeps a static, centred glow: the surface still reads as
    // lit, it just stops chasing the pointer.
    if (reduced || isTouch) {
      el.style.setProperty('--glow-x', '50%');
      el.style.setProperty('--glow-y', '50%');
      el.style.setProperty('--glow-opacity', String(intensity * 0.5));
      return;
    }

    const onMove = rafThrottle((e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--glow-x', e.clientX - r.left + 'px');
      el.style.setProperty('--glow-y', e.clientY - r.top + 'px');
    });
    const onEnter = () => el.style.setProperty('--glow-opacity', String(intensity));
    const onLeave = () => el.style.setProperty('--glow-opacity', '0');

    el.addEventListener('pointermove', onMove as EventListener);
    el.addEventListener('pointerenter', onEnter);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointermove', onMove as EventListener);
      el.removeEventListener('pointerenter', onEnter);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, [reduced, isTouch, size, color, intensity]);

  return ref;
}
