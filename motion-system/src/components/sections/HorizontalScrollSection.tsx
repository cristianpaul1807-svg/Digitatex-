import type { ReactNode } from 'react';
import { useHorizontalScroll } from '@/motion/scroll/useHorizontalScroll';

export interface HorizontalScrollSectionProps {
  children: ReactNode;
  className?: string;
}

/**
 * D04 — Horizontal Scroll.
 *
 * Desktop: vertical scroll drives the track sideways while the section is
 * pinned. Touch and reduced motion: a native swipeable strip with scroll-snap.
 *
 * `overscroll-behavior-x: contain` on the fallback stops a swipe past the last
 * card triggering the browser's back gesture, which on iOS is the fastest way
 * to lose a visitor from a carousel.
 */
export function HorizontalScrollSection({ children, className = '' }: HorizontalScrollSectionProps) {
  const { ref, trackRef, active } = useHorizontalScroll<HTMLDivElement>();

  if (!active) {
    return (
      <div className={`flex snap-x snap-mandatory gap-5 overflow-x-auto pb-6 [overscroll-behavior-x:contain] ${className}`}>
        {children}
      </div>
    );
  }

  return (
    <div ref={ref} className={`relative h-[100svh] overflow-hidden ${className}`}>
      <div ref={trackRef} className="flex h-full items-center gap-8 will-change-transform">
        {children}
      </div>
    </div>
  );
}
