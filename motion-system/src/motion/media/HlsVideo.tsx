import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useReducedMotion } from '../accessibility/useReducedMotion';
import { useIsMobile } from '../utilities/useMediaQuery';
import { pauseWhenOffscreen, prefersLightMedia } from '../utilities/performance';

export interface HlsVideoProps {
  /** HLS manifest. Optional — progressive sources alone are fine. */
  src?: string;
  /** Progressive fallbacks, in preference order. */
  sources?: { src: string; type: string }[];
  poster?: string;
  className?: string;
  pauseOffscreen?: boolean;
  /** Show the poster only, on phones. */
  posterOnMobile?: boolean;
  loop?: boolean;
  onReady?: () => void;
}

/**
 * B02 — Background Video (HLS-capable).
 *
 * Playback path, in order:
 *  1. Safari plays HLS natively — feeding it hls.js as well would mean two
 *     players fighting over one element, so the library is never loaded there.
 *  2. Everywhere else hls.js is imported dynamically. It is ~150KB and a page
 *     with no HLS source should never pay for it.
 *  3. Otherwise the progressive `<source>` list plays.
 *  4. If nothing plays, the poster is already on screen and stays.
 *
 * Three still-image fallbacks, each for a different reason: a stated motion
 * preference, a metered connection, and a phone battery.
 */
export const HlsVideo = forwardRef<HTMLVideoElement, HlsVideoProps>(function HlsVideo(
  { src, sources = [], poster, className = '', pauseOffscreen = true, posterOnMobile = false, loop = true, onReady },
  ref,
) {
  const videoRef = useRef<HTMLVideoElement>(null);
  useImperativeHandle(ref, () => videoRef.current as HTMLVideoElement);

  const reduced = useReducedMotion();
  const isMobile = useIsMobile();
  const [light, setLight] = useState(false);

  useEffect(() => setLight(prefersLightMedia()), []);

  const stillOnly = reduced || light || (isMobile && posterOnMobile);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || stillOnly) return;

    let hls: { destroy: () => void } | null = null;
    let cancelled = false;

    const start = () => {
      const p = video.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
      onReady?.();
    };

    if (src) {
      const native = video.canPlayType('application/vnd.apple.mpegurl');
      if (native) {
        video.src = src;
        video.addEventListener('loadeddata', start, { once: true });
      } else {
        import('hls.js').then(({ default: Hls }) => {
          if (cancelled || !Hls.isSupported()) return;
          const instance = new Hls({ capLevelToPlayerSize: true, maxBufferLength: 12 });
          instance.loadSource(src);
          instance.attachMedia(video);
          instance.on(Hls.Events.MANIFEST_PARSED, start);
          hls = instance;
        });
      }
    } else {
      video.addEventListener('loadeddata', start, { once: true });
    }

    const stopOffscreen = pauseOffscreen ? pauseWhenOffscreen(video) : undefined;

    return () => {
      cancelled = true;
      hls?.destroy();
      stopOffscreen?.();
      video.removeEventListener('loadeddata', start);
    };
  }, [src, stillOnly, pauseOffscreen, onReady]);

  if (stillOnly && poster) {
    return (
      <img src={poster} alt="" aria-hidden="true" className={`h-full w-full object-cover ${className}`} decoding="async" />
    );
  }

  return (
    <video
      ref={videoRef}
      className={`h-full w-full object-cover ${className}`}
      poster={poster}
      muted
      loop={loop}
      playsInline
      autoPlay
      preload="metadata"
      aria-hidden="true"
      tabIndex={-1}
    >
      {sources.map((s) => (
        <source key={s.src} src={s.src} type={s.type} />
      ))}
    </video>
  );
});
