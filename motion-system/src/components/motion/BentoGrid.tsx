import type { ReactNode } from 'react';
import { useScrollReveal } from '@/motion/scroll/useScrollReveal';

export interface BentoGridProps {
  children: ReactNode;
  stagger?: number;
  className?: string;
}

/**
 * F05 — Bento Grid Motion.
 *
 * Reference: "8 cards in an asymmetric grid".
 *
 * The one decision worth explaining: the stagger follows DOM order, not visual
 * position. Ordering by on-screen position looks smarter in a mockup and is
 * wrong in practice — DOM order is reading order, it is what a screen reader
 * follows, and on a phone the grid collapses to one column where the two agree
 * anyway. A stagger that disagrees with reading order makes the eye jump around
 * for no reason.
 */
export function BentoGrid({ children, stagger = 0.07, className = '' }: BentoGridProps) {
  const ref = useScrollReveal<HTMLDivElement>({
    kind: 'fade-up',
    childSelector: ':scope > *',
    stagger,
    distance: 28,
    start: 'top 82%',
  });

  return (
    <div ref={ref} className={`grid gap-4 ${className}`}>
      {children}
    </div>
  );
}
