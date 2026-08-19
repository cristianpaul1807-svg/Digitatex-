import { Children, type ReactNode } from 'react';
import { useReducedMotion } from '@/motion/accessibility/useReducedMotion';

export interface MarqueeProps {
  children: ReactNode;
  /** Seconds for one full pass. Larger = slower. */
  speed?: number;
  reverse?: boolean;
  pauseOnHover?: boolean;
  className?: string;
  itemClassName?: string;
}

/**
 * H01 — Infinite Marquee.
 *
 * Reference: "Marquee: CSS infinite scroll, pauses on hover".
 *
 * CSS animation, not JavaScript, deliberately. A marquee is a constant linear
 * translation with no state — exactly what the compositor runs off the main
 * thread. Driving it from rAF hands the browser a job it was already doing for
 * free and makes it stutter whenever React renders.
 *
 * The track contains the content twice and translates by exactly -50%, which is
 * what makes the loop seamless. Duplicating three times "for safety" breaks it:
 * the translation no longer lands on a copy boundary and the content jumps.
 *
 * The duplicate is `aria-hidden`, so a screen reader reads the strip once.
 */
export function Marquee({
  children,
  speed = 26,
  reverse = false,
  pauseOnHover = true,
  className = '',
  itemClassName = '',
}: MarqueeProps) {
  const reduced = useReducedMotion();
  const items = Children.toArray(children);

  // Reduced motion: a static, scrollable strip. The content was the point; the
  // movement was decoration.
  if (reduced) {
    return (
      <div className={`flex gap-10 overflow-x-auto ${className}`}>
        {items.map((child, i) => (
          <span key={i} className={`shrink-0 ${itemClassName}`}>
            {child}
          </span>
        ))}
      </div>
    );
  }

  const track = (hidden: boolean) => (
    <div className="flex shrink-0 items-center gap-10 pr-10" aria-hidden={hidden || undefined}>
      {items.map((child, i) => (
        <span key={i} className={`shrink-0 ${itemClassName}`}>
          {child}
        </span>
      ))}
    </div>
  );

  return (
    <div
      className={`marquee relative flex overflow-hidden ${pauseOnHover ? 'marquee-pausable' : ''} ${className}`}
      style={{ ['--marquee-speed' as string]: `${speed}s` }}
    >
      <div className={`marquee-track flex ${reverse ? 'marquee-reverse' : ''}`}>
        {track(false)}
        {track(true)}
      </div>
    </div>
  );
}
