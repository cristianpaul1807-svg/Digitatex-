import { useRef, useState } from 'react';
import { ScrollTrigger, useGSAP } from '../core/gsap';

export interface ScrollProgressOptions {
  start?: string;
  end?: string;
  /**
   * Re-render granularity. Progress updates every frame while scrolling, and a
   * React state write per frame is the classic way a scroll section drops to
   * 20fps. Quantising to ~1% cuts renders by two orders of magnitude and is
   * invisible in anything a human reads.
   */
  steps?: number;
}

/**
 * Scroll progress of an element, 0 → 1, as React state.
 *
 * Use only when the value has to reach React (a caption index, an aria value).
 * For anything that just moves pixels, drive it with GSAP and keep React out of
 * the frame loop entirely.
 */
export function useScrollProgress<T extends HTMLElement = HTMLDivElement>(options: ScrollProgressOptions = {}) {
  const { start = 'top bottom', end = 'bottom top', steps = 100 } = options;
  const ref = useRef<T>(null);
  const [progress, setProgress] = useState(0);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      let last = -1;
      ScrollTrigger.create({
        trigger: el,
        start,
        end,
        onUpdate: (self) => {
          const q = Math.round(self.progress * steps) / steps;
          if (q !== last) {
            last = q;
            setProgress(q);
          }
        },
      });
    },
    { scope: ref, dependencies: [start, end, steps] },
  );

  return { ref, progress };
}
