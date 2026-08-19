import { useRef } from 'react';
import { gsap, useGSAP } from '../core/gsap';
import { useReducedMotion } from '../accessibility/useReducedMotion';
import { splitText, type SplitBy } from './splitText';
import { ease } from '../presets/easings';
import { duration, stagger as staggerPreset } from '../presets/durations';
import type { ScrollWindow } from '../core/types';

export interface TextRevealOptions extends ScrollWindow {
  by?: SplitBy | 'element';
  stagger?: number;
  duration?: number;
  delay?: number;
  /** Vertical travel per part, px. Lines use their own height instead. */
  distance?: number;
  /** Rotate parts slightly as they rise. Cinematic — use sparingly. */
  skew?: boolean;
}

/**
 * C01/C02 — Text Reveal / Split Text Reveal.
 *
 * Waits for `document.fonts.ready` before splitting. Skipping that is the most
 * common bug in text-reveal code: the split is measured in the fallback font,
 * the webfont swaps in, and the groupings are wrong — usually one orphaned word
 * on a line of its own.
 */
export function useTextReveal<T extends HTMLElement = HTMLHeadingElement>(options: TextRevealOptions = {}) {
  const {
    by = 'lines',
    stagger = staggerPreset.default,
    duration: dur = duration.entrance,
    delay = 0,
    distance = 28,
    skew = false,
    start = 'top 85%',
    once = true,
  } = options;

  const ref = useRef<T>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (reduced) {
        gsap.set(el, { opacity: 1 });
        return;
      }

      let revert: (() => void) | null = null;
      let cancelled = false;

      const run = () => {
        if (cancelled || !ref.current) return;
        const target = ref.current;

        if (by === 'element') {
          gsap.fromTo(
            target,
            { opacity: 0, y: distance },
            { opacity: 1, y: 0, duration: dur, delay, ease: ease.entrance, scrollTrigger: { trigger: target, start, once } },
          );
          return;
        }

        const split = splitText(target, by);
        revert = split.revert;
        if (!split.parts.length) return;

        const isLines = by === 'lines';
        gsap.fromTo(
          split.parts,
          {
            yPercent: isLines ? 110 : 0,
            y: isLines ? 0 : distance,
            opacity: isLines ? 1 : 0,
            skewY: skew ? 4 : 0,
          },
          {
            yPercent: 0,
            y: 0,
            opacity: 1,
            skewY: 0,
            duration: dur,
            delay,
            ease: ease.entrance,
            stagger,
            scrollTrigger: { trigger: target, start, once },
          },
        );
      };

      if (document.fonts && document.fonts.status !== 'loaded') document.fonts.ready.then(run);
      else run();

      return () => {
        cancelled = true;
        revert?.();
      };
    },
    { scope: ref, dependencies: [reduced, by, stagger, dur, delay, distance, skew, start, once] },
  );

  return ref;
}
