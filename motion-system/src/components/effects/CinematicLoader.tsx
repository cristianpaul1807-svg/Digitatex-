import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/motion/core/gsap';
import { useReducedMotion } from '@/motion/accessibility/useReducedMotion';
import { ease } from '@/motion/presets/easings';
import { duration as dur } from '@/motion/presets/durations';
import { safeStorage } from '@/motion/utilities/safeStorage';

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
 * Five things that separate a loader from a delay:
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
 *  5. IT CANNOT TRAP THE PAGE. Everything below runs inside a try/catch that
 *     reveals the content if anything goes wrong, and a timer clears the
 *     overlay even if the timeline never completes.
 *
 *     Point 5 is not hypothetical. This component read `sessionStorage`
 *     directly, and in a sandboxed iframe without `allow-same-origin` — a chat
 *     panel, an email preview, a CMS embed — merely reading it throws a
 *     SecurityError. Thrown from a React effect that unmounts the whole tree,
 *     and the page is black with nothing on screen to explain why. A loader is
 *     the one component guaranteed to be in front of everything else, so a
 *     failure here is not a missing effect: it is a blank site.
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

    /** Last resort: uncover the content whatever happened. */
    const reveal = () => {
      document.documentElement.style.overflow = '';
      setGone(true);
    };

    let tl: gsap.core.Timeline | null = null;
    let failsafe = 0;

    try {
      const seen = skipOnRepeatVisit && safeStorage.get(SEEN_KEY) === '1';
      const hold = reduced ? 0 : seen ? 0.14 : duration;
      const exit = reduced ? 0.01 : exitDuration;

      document.documentElement.style.overflow = 'hidden';

      tl = gsap.timeline({
        onComplete: () => {
          safeStorage.set(SEEN_KEY, '1');
          onComplete?.();
          reveal();
        },
      });

      tl.to(root, { opacity: 0, duration: exit, ease: ease.entrance, delay: hold }, 0);
      if (!reduced) {
        // The mark lifts as the veil drops, so the two read as one movement
        // rather than a fade followed by a jump.
        tl.to(root.querySelector('[data-loader-mark]'), { y: -18, duration: exit, ease: ease.entrance }, 0);
      }

      // If the timeline never completes — a background tab at load, GSAP not
      // running, a throw inside onComplete — this uncovers the page anyway.
      // Generous margin so it never races the real animation.
      failsafe = window.setTimeout(reveal, (hold + exit) * 1000 + 2000);
    } catch {
      reveal();
    }

    return () => {
      tl?.kill();
      if (failsafe) window.clearTimeout(failsafe);
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
        <span
          className={`font-display text-[15vw] leading-none tracking-tight text-bone md:text-[7vw] ${
            shimmer && !reduced ? 'loader-shimmer' : ''
          }`}
        >
          {logo}
        </span>
      </div>
    </div>
  );
}
