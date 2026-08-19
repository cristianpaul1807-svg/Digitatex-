import { useEffect, useRef, useState } from 'react';
import { ScrollTrigger, useGSAP } from '../core/gsap';
import { useReducedMotion } from '../accessibility/useReducedMotion';
import { clamp } from '../utilities/performance';

export interface ScrollScrubVideoOptions {
  start?: string;
  end?: string;
  /** Trim the usable range of the clip, 0–1. */
  from?: number;
  to?: number;
}

/**
 * D05 — Scroll-Scrub Media (video source).
 *
 * A video whose `currentTime` is driven by scroll position. Four rules here are
 * production scar tissue, not preference:
 *
 *  1. NEVER call `video.pause()`. Safari draws its own play button over any
 *     paused video regardless of how it got paused, and no CSS removes it. The
 *     video is kept "playing" at `playbackRate = 0` instead, with a `pause`
 *     listener that re-primes it if the browser pauses it on its own.
 *
 *  2. The seek is written inside `requestAnimationFrame`. Writing `currentTime`
 *     straight from the scroll handler asks the decoder to seek more often than
 *     it can deliver frames, and the picture ends up further behind the finger
 *     than doing it once per frame.
 *
 *  3. Seeking needs HTTP Range support. A server answering 200 instead of 206
 *     produces a video that plays but will not scrub — which looks like frozen
 *     JavaScript and sends you debugging the wrong layer entirely.
 *
 *  4. Readiness is `readyState >= 2`, not the `loadedmetadata` event. Metadata
 *     gives you a duration and a black frame; HAVE_CURRENT_DATA is the first
 *     moment there is a picture. Both the event and an immediate check are used,
 *     because a cached video can be ready before React attaches the listener.
 *
 * Encode with frequent keyframes (`-g 12`): every seek costs the decoder the
 * distance back to the previous one.
 */
export function useScrollScrubVideo(options: ScrollScrubVideoOptions = {}) {
  const { start = 'top top', end = 'bottom bottom', from = 0, to = 1 } = options;

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const markReady = () => {
      if (video.readyState >= 2) setReady(true);
    };
    markReady();
    const events = ['loadeddata', 'canplay', 'progress', 'timeupdate'];
    events.forEach((e) => video.addEventListener(e, markReady));

    const prime = () => {
      const p = video.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
      video.playbackRate = 0;
    };
    prime();
    video.addEventListener('pause', prime);

    return () => {
      events.forEach((e) => video.removeEventListener(e, markReady));
      video.removeEventListener('pause', prime);
    };
  }, []);

  useGSAP(
    () => {
      const root = containerRef.current;
      const video = videoRef.current;
      if (!root || !video || reduced) return;

      let frame = 0;
      let target = 0;

      const apply = () => {
        frame = 0;
        if (video.readyState < 2 || !Number.isFinite(video.duration)) return;
        const span = (to - from) * video.duration;
        const t = from * video.duration + clamp(target) * span;
        // A sub-frame difference is not worth a seek.
        if (Math.abs(video.currentTime - t) > 1 / 60) video.currentTime = t;
      };

      ScrollTrigger.create({
        trigger: root,
        start,
        end,
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          target = self.progress;
          if (!frame) frame = requestAnimationFrame(apply);
        },
      });

      return () => {
        if (frame) cancelAnimationFrame(frame);
      };
    },
    { scope: containerRef, dependencies: [reduced, start, end, from, to] },
  );

  return { containerRef, videoRef, ready, reduced };
}
