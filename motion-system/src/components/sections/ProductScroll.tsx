import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ScrollTrigger, useGSAP } from '@/motion/core/gsap';
import { useReducedMotion } from '@/motion/accessibility/useReducedMotion';
import { useIsDesktop } from '@/motion/utilities/useMediaQuery';
import { clamp } from '@/motion/utilities/performance';
import { HlsVideo } from '@/motion/media/HlsVideo';

/** Draw one frame. `t` is scroll progress 0–1; the canvas is already cleared. */
export type CanvasRenderer = (ctx: CanvasRenderingContext2D, t: number, size: { w: number; h: number }) => void;

export type ProductSource =
  | { type: 'video'; hls?: string; sources: { src: string; type: string }[]; poster?: string }
  | { type: 'sequence'; frameUrl: (i: number) => string; frameCount: number }
  | { type: 'canvas'; render: CanvasRenderer };

export interface ProductChapter {
  /** Scroll progress at which this chapter takes over, 0–1. */
  at: number;
  eyebrow?: string;
  title: string;
  body: string;
}

export interface ProductHotspot {
  /** Progress window in which the hotspot is visible. */
  from: number;
  to: number;
  /** Position as a percentage of the stage. */
  x: number;
  y: number;
  label: string;
  detail?: string;
}

export interface ProductScrollProps {
  source: ProductSource;
  chapters: ProductChapter[];
  hotspots?: ProductHotspot[];
  /** Scroll length in viewport heights. */
  length?: number;
  /** Shown instead of the pinned experience on phones and reduced motion. */
  fallback?: ReactNode;
  className?: string;
}

const DPR = () => Math.min(window.devicePixelRatio || 1, 2);

/**
 * E01 — Product Scroll.
 *
 * The system's flagship: a pinned stage whose media, copy and annotations are
 * all driven by one scroll progress value.
 *
 * Three source types behind one API, because the right one depends entirely on
 * the asset and picking wrong is expensive to undo:
 *
 *  · `video`    — cheapest to produce and ship, but cannot carry alpha and
 *                 needs a server answering Range requests. Encode with frequent
 *                 keyframes or scrubbing feels gluey.
 *  · `sequence` — PNG frames. The only option with transparency and the only
 *                 one exact at every step. Costs bandwidth; budget it.
 *  · `canvas`   — procedural. No assets, resolution-independent, and the only
 *                 one that can react to state as well as to scroll.
 *
 * Everything downstream reads the same `progress`, so swapping the source
 * changes one prop and nothing else.
 */
export function ProductScroll({ source, chapters, hotspots = [], length = 4, fallback, className = '' }: ProductScrollProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);

  const [progress, setProgress] = useState(0);
  const [chapter, setChapter] = useState(0);

  const reduced = useReducedMotion();
  const isDesktop = useIsDesktop();
  const active = isDesktop && !reduced;

  // Preload an image sequence once, outside the GSAP context, so a trigger
  // rebuild never re-downloads the frames.
  useEffect(() => {
    if (source.type !== 'sequence') return;
    const imgs: HTMLImageElement[] = [];
    for (let i = 0; i < source.frameCount; i++) {
      const img = new Image();
      img.decoding = 'async';
      img.src = source.frameUrl(i);
      imgs.push(img);
    }
    imagesRef.current = imgs;
    return () => {
      imagesRef.current = [];
    };
  }, [source]);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d') ?? null;

      const sizeCanvas = () => {
        if (!canvas || !ctx) return;
        const dpr = DPR();
        const r = canvas.getBoundingClientRect();
        canvas.width = Math.round(r.width * dpr);
        canvas.height = Math.round(r.height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      };
      sizeCanvas();

      let frame = 0;
      let target = 0;

      const paint = () => {
        frame = 0;
        const t = clamp(target);

        if (source.type === 'video') {
          const v = videoRef.current;
          if (v && v.readyState >= 2 && Number.isFinite(v.duration)) {
            const time = t * v.duration;
            if (Math.abs(v.currentTime - time) > 1 / 60) v.currentTime = time;
          }
          return;
        }

        if (!ctx || !canvas) return;
        const dpr = DPR();
        const w = canvas.width / dpr;
        const h = canvas.height / dpr;
        ctx.clearRect(0, 0, w, h);

        if (source.type === 'canvas') {
          source.render(ctx, t, { w, h });
        } else {
          const imgs = imagesRef.current;
          const i = Math.min(source.frameCount - 1, Math.round(t * (source.frameCount - 1)));
          const img = imgs[i];
          if (img?.complete && img.naturalWidth) {
            const scale = Math.min(w / img.naturalWidth, h / img.naturalHeight);
            const dw = img.naturalWidth * scale;
            const dh = img.naturalHeight * scale;
            ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
          }
        }
      };

      const schedule = () => {
        if (!frame) frame = requestAnimationFrame(paint);
      };

      const onResize = () => {
        sizeCanvas();
        schedule();
      };
      window.addEventListener('resize', onResize);

      if (active) {
        let lastChapter = -1;
        ScrollTrigger.create({
          trigger: root,
          start: 'top top',
          end: () => '+=' + window.innerHeight * length,
          pin: stageRef.current,
          pinSpacing: true,
          anticipatePin: 1,
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            target = self.progress;
            schedule();
            setProgress(Math.round(self.progress * 200) / 200);
            let idx = 0;
            for (let i = 0; i < chapters.length; i++) {
              const c = chapters[i];
              if (c && self.progress >= c.at) idx = i;
            }
            if (idx !== lastChapter) {
              lastChapter = idx;
              setChapter(idx);
            }
          },
        });
      }
      schedule();

      return () => {
        window.removeEventListener('resize', onResize);
        if (frame) cancelAnimationFrame(frame);
      };
    },
    { scope: rootRef, dependencies: [active, source, length, chapters] },
  );

  // Mobile is a genuine fallback, not a squeezed copy: pinning a stage on a
  // phone fights the URL-bar collapse, and a product shot at 375px wide with a
  // caption over it is unreadable.
  if (!active && fallback) return <div className={className}>{fallback}</div>;

  const current = chapters[chapter];

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <div ref={stageRef} className="relative flex h-[100svh] w-full items-center overflow-hidden">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          {source.type === 'video' ? (
            <div className="h-full w-full">
              <HlsVideo ref={videoRef} src={source.hls} sources={source.sources} poster={source.poster} pauseOffscreen={false} loop={false} />
            </div>
          ) : (
            <canvas ref={canvasRef} aria-hidden="true" className="h-full w-full" />
          )}
        </div>

        {hotspots.map((hs) => {
          const on = progress >= hs.from && progress <= hs.to;
          return (
            <div
              key={hs.label}
              aria-hidden={!on}
              className="absolute z-20 transition-opacity duration-300 ease-entrance"
              style={{ left: `${hs.x}%`, top: `${hs.y}%`, opacity: on ? 1 : 0 }}
            >
              <div className="flex items-start gap-3">
                <span className="mt-1.5 block h-2 w-2 shrink-0 rounded-full bg-accent shadow-[0_0_0_5px_rgba(200,242,74,0.18)]" />
                <div className="max-w-[190px] rounded-lg border border-white/10 bg-ink/80 px-3 py-2 backdrop-blur">
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-accent">{hs.label}</p>
                  {hs.detail && <p className="mt-1 text-[12px] leading-snug text-bone-dim">{hs.detail}</p>}
                </div>
              </div>
            </div>
          );
        })}

        <div className="relative z-10 mx-auto w-full max-w-6xl px-6">
          <div className="relative max-w-md">
            {chapters.map((c, i) => (
              <div
                key={c.title}
                aria-hidden={i !== chapter}
                className="transition-all duration-500 ease-entrance"
                style={{
                  position: i === 0 ? 'relative' : 'absolute',
                  top: i === 0 ? undefined : 0,
                  left: i === 0 ? undefined : 0,
                  right: i === 0 ? undefined : 0,
                  opacity: i === chapter ? 1 : 0,
                  transform: i === chapter ? 'translateY(0)' : 'translateY(12px)',
                  pointerEvents: i === chapter ? 'auto' : 'none',
                }}
              >
                {c.eyebrow && <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">{c.eyebrow}</p>}
                <h3 className="mt-4 whitespace-pre-line font-display text-4xl leading-[1.05] text-bone md:text-5xl">{c.title}</h3>
                <p className="mt-4 text-[15px] leading-relaxed text-bone-dim">{c.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-10 left-6 right-6 z-10 md:left-1/2 md:w-64 md:-translate-x-1/2">
          <div
            className="h-px w-full bg-white/15"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress * 100)}
            aria-label={current ? current.title : 'Product walkthrough'}
          >
            <div className="h-px bg-accent" style={{ width: `${progress * 100}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
