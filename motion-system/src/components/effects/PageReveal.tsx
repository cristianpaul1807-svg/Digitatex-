import { useRef, type ReactNode } from 'react';
import { gsap, useGSAP } from '@/motion/core/gsap';
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
      gsap.fromTo(el, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 1, delay, ease: ease.entrance });
    },
    { scope: ref, dependencies: [reduced, delay] },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
