import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/motion/core/gsap';
import { useReducedMotion } from '@/motion/accessibility/useReducedMotion';
import { ease } from '@/motion/presets/easings';
import { duration as dur } from '@/motion/presets/durations';

export interface CinematicLoaderProps {
  /** Hold time in seconds before the exit begins. */
  duration?: number;
  exitDuration?: number;
  logo?: string;
  shimmer?: boolean;
  /** Skip the hold for anyone who has already seen it this session. */
  skipOnRepeatVisit?: boolean;
  onComplete?: () => void;
}

const SEEN_KEY = 'motion-system:loader-seen';

/**
 * A01 — Cinematic Loader.
 *
 * Reference: "Loading screen (3s monogram shimmer, ease-out fade)".
 *
 * Four things that separate a loader from a delay:
 *
 *  1. It never blocks content. The overlay is fixed above a page that has
 *     already rendered, so if the JavaScript fails the visitor sees the site
 *     rather than a permanent black screen.
 *  2. Scroll is locked only while it is up, and released in the same timeline
 *     that fades it — not in a setTimeout that can be missed.
 *  3. It remembers. Three seconds is atmosphere on the first visit and an
 *     obstacle on the fourth, so a repeat visitor gets a 140ms version.
 *  4. Reduced motion removes it entirely, hold included. Somebody who asked for
 *     less motion has not asked to wait longer for it.
 */
export function CinematicLoader({
  duration = dur.loader,
  exitDuration = 0.9,
  logo = 'MS',
  shimmer = true,
  skipOnRepeatVisit = true,
  onComplete,
}: CinematicLoaderProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const seen = skipOnRepeatVisit && sessionStorage.getItem(SEEN_KEY) === '1';
    const hold = reduced ? 0 : seen ? 0.14 : duration;
    const exit = reduced ? 0.01 : exitDuration;

    document.documentElement.style.overflow = 'hidden';

    const tl = gsap.timeline({
      onComplete: () => {
        document.documentElement.style.overflow = '';
        sessionStorage.setItem(SEEN_KEY, '1');
        setGone(true);
        onComplete?.();
      },
    });

    tl.to(root, { opacity: 0, duration: exit, ease: ease.entrance, delay: hold }, 0);
    if (!reduced) {
      // The mark lifts as the veil drops, so the two read as one movement
      // rather than a fade followed by a jump.
      tl.to(root.querySelector('[data-loader-mark]'), { y: -18, duration: exit, ease: ease.entrance }, 0);
    }

    return () => {
      tl.kill();
      document.documentElement.style.overflow = '';
    };
  }, [duration, exitDuration, reduced, skipOnRepeatVisit, onComplete]);

  if (gone) return null;

  return (
    <div
      ref={rootRef}
      role="status"
      aria-live="polite"
      aria-label="Loading"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink"
    >
      <div data-loader-mark className="relative">
        <span className={`font-display text-[15vw] leading-none tracking-tight text-bone md:text-[7vw] ${shimmer && !reduced ? 'loader-shimmer' : ''}`}>
          {logo}
        </span>
      </div>
    </div>
  );
}
