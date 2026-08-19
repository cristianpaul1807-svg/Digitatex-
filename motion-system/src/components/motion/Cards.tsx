import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useTilt, type TiltOptions } from '@/motion/interactions/useTilt';
import { useHoverGlow, type HoverGlowOptions } from '@/motion/interactions/useHoverGlow';
import { useReducedMotion } from '@/motion/accessibility/useReducedMotion';
import { useIsTouch } from '@/motion/utilities/useIsTouch';
import { cubic } from '@/motion/presets/easings';
import { duration } from '@/motion/presets/durations';

export interface GlassCardProps {
  children: ReactNode;
  radius?: number;
  className?: string;
}

/**
 * F04 — Glass Card.
 *
 * Reference: "rounded 16px, glass surface".
 *
 * A translucent fill plus a `backdrop-filter`, with a 1px highlight along the
 * top edge. That highlight is what sells it: real glass catches light on its
 * upper lip, and without it a translucent panel just looks like a grey box with
 * the opacity turned down.
 */
export function GlassCard({ children, radius = 16, className = '' }: GlassCardProps) {
  return (
    <div
      className={`glass-card relative overflow-hidden border border-white/10 bg-white/[0.035] ${className}`}
      style={{ borderRadius: radius }}
    >
      {children}
    </div>
  );
}

export interface HoverCardProps extends GlassCardProps {
  /** F01 — lift distance in px. The reference used 6. */
  lift?: number;
  /** F02 — scale on hover. */
  scale?: number;
  /** G04 — cursor-tracking glow. */
  glow?: HoverGlowOptions | false;
  /** G05 — 3D tilt. */
  tilt?: TiltOptions | false;
}

/**
 * F01 + F02 + G04 + G05 — Card Hover Lift · Card Scale · Hover Glow · Tilt.
 *
 * Reference: "Each card: rounded 16px, glass surface, hover lift 6px".
 *
 * Composable rather than four separate cards. The default is lift plus glow;
 * everything else is opt-in, because a card that lifts and scales and tilts and
 * glows at once is the exact animation fatigue the principles warn about.
 *
 * On touch every one of these resolves to nothing and the card is just a card.
 */
export function HoverCard({
  children,
  radius = 16,
  lift = 6,
  scale = 1,
  glow = { size: 320 },
  tilt = false,
  className = '',
}: HoverCardProps) {
  const reduced = useReducedMotion();
  const isTouch = useIsTouch();
  const inert = reduced || isTouch;

  const glowRef = useHoverGlow<HTMLDivElement>(glow || {});
  const tiltRef = useTilt<HTMLDivElement>(tilt || {});

  return (
    <motion.div
      ref={tilt ? tiltRef : undefined}
      whileHover={inert ? undefined : { y: -lift, scale }}
      transition={{ duration: duration.ui, ease: cubic.entrance }}
      className="h-full"
    >
      <div ref={glow ? glowRef : undefined} className={glow ? 'hover-glow h-full' : 'h-full'}>
        <GlassCard radius={radius} className={`h-full ${className}`}>
          {children}
        </GlassCard>
      </div>
    </motion.div>
  );
}

/**
 * F03 — Image Zoom.
 *
 * The image scales inside a fixed, overflow-hidden frame. The frame must not
 * move: zooming the frame reflows the grid around it; zooming the image inside
 * it is a composite and nothing else on the page notices.
 */
export function ZoomImage({
  src,
  alt = '',
  scale = 1.06,
  className = '',
  imgClassName = '',
}: {
  src: string;
  alt?: string;
  scale?: number;
  className?: string;
  imgClassName?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        whileHover={reduced ? undefined : { scale }}
        transition={{ duration: 0.7, ease: cubic.entrance }}
        className={`h-full w-full object-cover ${imgClassName}`}
      />
    </div>
  );
}
