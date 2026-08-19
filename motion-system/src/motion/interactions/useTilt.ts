import { useEffect, useRef } from 'react';
import { gsap } from '../core/gsap';
import { useReducedMotion } from '../accessibility/useReducedMotion';
import { useIsTouch } from '../utilities/useIsTouch';
import { ease } from '../presets/easings';

export interface TiltOptions {
  /** Maximum rotation in degrees on each axis. */
  max?: number;
  perspective?: number;
  /** Lift toward the viewer while hovered, in px. */
  lift?: number;
  scale?: number;
}

/**
 * G05 — Image Tilt.
 *
 * A 3D lean toward the cursor, capped at about 7°. Past that the perspective
 * distortion reads as a broken layout rather than depth, and text inside the
 * card becomes genuinely harder to read.
 */
export function useTilt<T extends HTMLElement = HTMLDivElement>(options: TiltOptions = {}) {
  const { max = 7, perspective = 900, lift = 0, scale = 1 } = options;

  const ref = useRef<T>(null);
  const reduced = useReducedMotion();
  const isTouch = useIsTouch();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced || isTouch) return;

    gsap.set(el, { transformPerspective: perspective, transformStyle: 'preserve-3d' });
    const rx = gsap.quickTo(el, 'rotationX', { duration: 0.5, ease: ease.micro });
    const ry = gsap.quickTo(el, 'rotationY', { duration: 0.5, ease: ease.micro });

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      // Y follows horizontal, X inverts vertical: that pairing is what makes
      // the surface feel pushed rather than steered.
      ry(px * max * 2);
      rx(-py * max * 2);
    };
    const onEnter = () => gsap.to(el, { z: lift, scale, duration: 0.4, ease: ease.micro });
    const onLeave = () => {
      rx(0);
      ry(0);
      gsap.to(el, { z: 0, scale: 1, duration: 0.5, ease: ease.micro });
    };

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerenter', onEnter);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerenter', onEnter);
      el.removeEventListener('pointerleave', onLeave);
      gsap.killTweensOf(el);
      gsap.set(el, { clearProps: 'transform' });
    };
  }, [reduced, isTouch, max, perspective, lift, scale]);

  return ref;
}
