import { useRef, useState } from 'react';
import { ScrollTrigger, useGSAP } from '../core/gsap';
import { useReducedMotion } from '../accessibility/useReducedMotion';
import { useIsDesktop } from '../utilities/useMediaQuery';

export interface StickyStoryOptions {
  steps: number;
  /** Viewport heights of scroll per chapter. */
  heightPerStep?: number;
  /** Reference: "Sticky-pinned scroll variant on desktop". */
  desktopOnly?: boolean;
  anticipatePin?: number;
}

/**
 * D03 — Sticky Storytelling.
 *
 * A pinned section that advances through chapters as the page scrolls.
 *
 * The mobile fallback is a different layout, not a smaller one: pinning on a
 * phone fights the browser's own scroll gestures and the URL-bar collapse, and
 * a pinned section that stutters reads as a broken page. Below the desktop
 * breakpoint the chapters stack and reveal normally, which is what a reader
 * wants on a small screen anyway.
 *
 * Returns the active chapter index so callers drive text and media from one
 * source of truth instead of duplicating the progress maths.
 */
export function useStickyStory<T extends HTMLElement = HTMLDivElement>(options: StickyStoryOptions) {
  const { steps, heightPerStep = 1, desktopOnly = true, anticipatePin = 1 } = options;

  const ref = useRef<T>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const reduced = useReducedMotion();
  const isDesktop = useIsDesktop();
  const pinned = isDesktop && !reduced && (!desktopOnly || isDesktop);

  useGSAP(
    () => {
      const root = ref.current;
      const pin = pinRef.current;
      if (!root || !pin || !pinned) return;

      let last = -1;
      ScrollTrigger.create({
        trigger: root,
        start: 'top top',
        end: () => '+=' + window.innerHeight * heightPerStep * steps,
        pin,
        pinSpacing: true,
        anticipatePin,
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          setProgress(Math.round(self.progress * 100) / 100);
          // The last chapter owns the final slice, so clamp rather than letting
          // progress === 1 round up past the end of the array.
          const i = Math.min(steps - 1, Math.floor(self.progress * steps));
          if (i !== last) {
            last = i;
            setIndex(i);
          }
        },
      });
    },
    { scope: ref, dependencies: [pinned, steps, heightPerStep] },
  );

  return { ref, pinRef, index, progress, pinned, setIndex };
}
