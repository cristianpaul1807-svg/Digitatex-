import type { ReactNode } from 'react';
import { HlsVideo } from '@/motion/media/HlsVideo';
import { MediaOverlay, type MediaOverlayProps } from '@/motion/media/MediaOverlay';
import { Grain } from '@/motion/effects/Grain';
import { DustParticles } from '@/motion/effects/DustParticles';
import { RadialGlow } from '@/motion/effects/RadialGlow';
import { Vignette } from '@/motion/effects/Vignette';

export interface CinematicHeroProps {
  children: ReactNode;
  media?: { hls?: string; sources?: { src: string; type: string }[]; poster?: string };
  overlay?: MediaOverlayProps | false;
  grain?: boolean;
  particles?: boolean;
  glow?: boolean;
  vignette?: boolean;
  /** Reference: "Hero takes 100svh". */
  height?: 'svh' | 'dvh' | 'full';
  className?: string;
}

/**
 * B01 — Cinematic Hero.
 *
 * Reference: "Hero section (full-bleed HLS video bg, centered headline)",
 * "Hero takes 100svh".
 *
 * `100svh`, not `100vh`, and the distinction is the whole reason this prop
 * exists. On iOS `100vh` is the height with the browser chrome hidden, so a
 * hero sized in `vh` is taller than the screen on load and its bottom edge —
 * usually the CTA — sits under the address bar until the user scrolls, which is
 * exactly when they no longer need it. `svh` is correct on arrival, and arrival
 * is the only moment a hero gets.
 *
 * Layer order is fixed and matters: media (0) → overlay and glow (1) →
 * particles and vignette (2) → grain (3) → content (10). Grain under the
 * overlay is invisible; the overlay over the content makes the copy grey.
 */
export function CinematicHero({
  children,
  media,
  overlay = { opacity: 0.5, gradient: 'to-bottom' },
  grain = true,
  particles = true,
  glow = true,
  vignette = true,
  height = 'svh',
  className = '',
}: CinematicHeroProps) {
  const h = height === 'svh' ? 'h-[100svh]' : height === 'dvh' ? 'h-[100dvh]' : 'h-screen';

  return (
    <section className={`relative isolate flex ${h} w-full items-center justify-center overflow-hidden ${className}`}>
      {media && (
        <div className="absolute inset-0 z-0">
          <HlsVideo src={media.hls} sources={media.sources} poster={media.poster} posterOnMobile />
        </div>
      )}
      {overlay && <MediaOverlay {...overlay} />}
      {glow && <RadialGlow y="108%" size="90vw" intensity={0.9} animated />}
      {particles && <DustParticles count={44} />}
      {vignette && <Vignette intensity={0.5} spread={0.5} />}
      {grain && <Grain />}
      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 text-center">{children}</div>
    </section>
  );
}
