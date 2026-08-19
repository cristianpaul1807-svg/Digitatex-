import { useRef, type ReactNode } from 'react';
import { gsap, useGSAP, ScrollTrigger } from '@/motion/core/gsap';
import { useReducedMotion } from '@/motion/accessibility/useReducedMotion';
import { ease } from '@/motion/presets/easings';

export interface PageRevealProps {
  children: ReactNode;
  /** Wait for the loader before starting. */
  delay?: number;
  className?: string;
}

/**
 * A02 — Page Reveal.
 *
 * Reference: "then ease-out fade".
 *
 * Deliberately small — fourteen pixels and an opacity — because it runs at the
 * same moment the hero's own motion starts, and two large moves at once cancel
 * each other into mush.
 *
 * The element starts visible in the DOM and GSAP takes it down before bringing
 * it back, so content is never invisible in the window between first paint and
 * hydration.
 *
 * THE IMPORTANT PART — `clearProps` on completion is not tidiness.
 *
 * A transform on an element makes it the containing block for every
 * `position: fixed` descendant. GSAP writes `transform: matrix(...)` and leaves
 * it there once a tween finishes, so a page wrapper that animated `y` by
 * fourteen pixels keeps a transform forever. Every ScrollTrigger `pin` inside
 * it then positions itself against this wrapper instead of the viewport, and
 * pinned sections render thousands of pixels off-screen.
 *
 * It fails silently: no error, no warning, and the animation itself looks
 * perfect. It cost a full debugging pass to find in this very showcase — the
 * Product Scroll section rendered as a black screen while its progress value
 * ticked up correctly.
 *
 * So the tween cleans up after itself and refreshes ScrollTrigger, which has to
 * remeasure now that the containing block has changed.
 */
export function PageReveal({ children, delay = 0, className = '' }: PageRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (reduced) {
        gsap.set(el, { opacity: 1, y: 0 });
        return;
      }
      gsap.fromTo(
        el,
        { opacity: 0, y: 14 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          delay,
          ease: ease.entrance,
          onComplete: () => {
            gsap.set(el, { clearProps: 'transform,willChange' });
            ScrollTrigger.refresh();
          },
        },
      );
    },
    { scope: ref, dependencies: [reduced, delay] },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
