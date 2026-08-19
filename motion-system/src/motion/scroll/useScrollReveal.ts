import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '../core/gsap';
import { useReducedMotion } from '../accessibility/useReducedMotion';
import { ease } from '../presets/easings';
import { duration, distance, stagger as staggerPreset } from '../presets/durations';
import type { Direction, ScrollWindow } from '../core/types';

export type RevealKind = 'fade' | 'fade-up' | 'fade-scale' | 'clip';

export interface ScrollRevealOptions extends ScrollWindow {
  kind?: RevealKind;
  /** Selector for children to stagger. Omit to animate the container itself. */
  children?: string;
  stagger?: number;
  duration?: number;
  delay?: number;
  distance?: number;
  from?: Direction;
  clipFrom?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  /** Skip entirely — useful for `disabled: isMobile`. */
  disabled?: boolean;
  markers?: boolean;
}

function offsetFor(from: Direction, px: number) {
  switch (from) {
    case 'up': return { y: px };
    case 'down': return { y: -px };
    case 'left': return { x: px };
    case 'right': return { x: -px };
  }
}

function clipFor(origin: NonNullable<ScrollRevealOptions['clipFrom']>) {
  switch (origin) {
    case 'top': return { from: 'inset(0% 0% 100% 0%)', to: 'inset(0% 0% 0% 0%)' };
    case 'bottom': return { from: 'inset(100% 0% 0% 0%)', to: 'inset(0% 0% 0% 0%)' };
    case 'left': return { from: 'inset(0% 100% 0% 0%)', to: 'inset(0% 0% 0% 0%)' };
    case 'right': return { from: 'inset(0% 0% 0% 100%)', to: 'inset(0% 0% 0% 0%)' };
    case 'center': return { from: 'inset(50% 0% 50% 0%)', to: 'inset(0% 0% 0% 0%)' };
  }
}

/**
 * D01 — Scroll Reveal Engine.
 *
 * The single abstraction every scroll-triggered entrance goes through. Four
 * things it handles so no call site has to:
 *
 *  1. Cleanup. `useGSAP` with a scope reverts every tween and kills every
 *     ScrollTrigger created inside it on unmount — the leak that otherwise
 *     accumulates silently on route changes and shows up as jank twenty
 *     navigations later.
 *  2. Reduced motion. The element is made visible and no trigger is created at
 *     all. Not "the same animation, faster" — no animation.
 *  3. Initial state, set inside the same context, so a failed trigger can never
 *     strand content invisible.
 *  4. Markers read from an env flag, so `markers: true` left in a component
 *     cannot ship: in a production build the branch is statically dropped.
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(options: ScrollRevealOptions = {}) {
  const {
    kind = 'fade-up',
    children,
    stagger = staggerPreset.default,
    duration: dur = duration.entrance,
    delay = 0,
    distance: dist = distance.default,
    from = 'up',
    clipFrom = 'bottom',
    start = 'top 85%',
    end,
    scrub = false,
    once = true,
    disabled = false,
    markers = false,
  } = options;

  const ref = useRef<T>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const targets: Element[] = children ? gsap.utils.toArray(children, root) : [root];
      if (!targets.length) return;

      if (reduced || disabled) {
        gsap.set(targets, { clearProps: 'all', opacity: 1 });
        return;
      }

      const fromVars: gsap.TweenVars = { opacity: 0 };
      const toVars: gsap.TweenVars = { opacity: 1, duration: dur, delay, ease: ease.entrance };

      if (kind === 'fade-up') {
        Object.assign(fromVars, offsetFor(from, dist));
        Object.assign(toVars, { x: 0, y: 0 });
      }
      if (kind === 'fade-scale') {
        Object.assign(fromVars, { scale: 0.94 });
        Object.assign(toVars, { scale: 1 });
      }
      if (kind === 'clip') {
        const c = clipFor(clipFrom);
        Object.assign(fromVars, { clipPath: c.from, opacity: 1 });
        Object.assign(toVars, { clipPath: c.to });
      }
      if (targets.length > 1) toVars.stagger = stagger;

      gsap.set(targets, fromVars);
      gsap.to(targets, {
        ...toVars,
        scrollTrigger: {
          trigger: root,
          start,
          end,
          scrub,
          once: once && !scrub,
          toggleActions: once ? 'play none none none' : 'play none none reverse',
          markers: markers && import.meta.env.DEV,
        },
      });
    },
    { scope: ref, dependencies: [reduced, disabled, kind, start, end, scrub, once] },
  );

  return ref;
}

export { ScrollTrigger };
