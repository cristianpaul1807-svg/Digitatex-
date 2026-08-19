/**
 * Performance helpers.
 *
 * Reference: "Lazy-load all images below the fold", "Defer non-critical JS",
 * "Lighthouse budget".
 */

/**
 * `will-change` is a promise to the browser that costs a compositor layer.
 * Left on permanently it is a memory leak with good intentions, so the system
 * only ever sets it for the duration of an animation.
 */
export function withWillChange(el: HTMLElement | null, props: string, run: () => void) {
  if (!el) return run();
  el.style.willChange = props;
  run();
  window.setTimeout(() => {
    el.style.willChange = '';
  }, 1400);
}

/**
 * Pause offscreen video. An autoplaying background video that has scrolled away
 * keeps decoding frames nobody sees; on a phone that is measurable battery.
 */
export function pauseWhenOffscreen(video: HTMLVideoElement, rootMargin = '200px') {
  const io = new IntersectionObserver(
    ([entry]) => {
      if (!entry) return;
      if (entry.isIntersecting) {
        const p = video.play();
        if (p && typeof p.catch === 'function') p.catch(() => {});
      } else if (!video.paused) {
        video.pause();
      }
    },
    { rootMargin },
  );
  io.observe(video);
  return () => io.disconnect();
}

/** Save-Data / slow-connection hint, for skipping heavy media. */
export function prefersLightMedia(): boolean {
  const nav = navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } };
  const c = nav.connection;
  if (!c) return false;
  if (c.saveData) return true;
  return c.effectiveType === 'slow-2g' || c.effectiveType === '2g';
}

/**
 * rAF-throttled callback. Pointer and scroll events fire far faster than the
 * compositor can use, and every extra call is a layout read nobody sees.
 */
export function rafThrottle<A extends unknown[]>(fn: (...args: A) => void) {
  let frame = 0;
  let latest: A;
  return (...args: A) => {
    latest = args;
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      fn(...latest);
    });
  };
}

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
