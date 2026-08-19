import type { CSSProperties } from 'react';

export interface MediaOverlayProps {
  /** Flat tint opacity, 0–1. The reference used 0.5. */
  opacity?: number;
  color?: string;
  gradient?: 'none' | 'to-bottom' | 'to-top' | 'to-right' | 'radial';
  blendMode?: CSSProperties['mixBlendMode'];
  className?: string;
}

/**
 * B03 — Video / Media Overlay.
 *
 * Reference: "50% black overlay".
 *
 * A flat 50% wash is the blunt version: it costs contrast everywhere, including
 * where there is no text. A directional gradient darkens only the band the copy
 * sits on, which keeps the image alive.
 *
 * Either way this is the thing that makes hero text legible, so its value
 * belongs to accessibility rather than decoration — measure the result against
 * the composited backdrop, not against the colour you typed.
 */
export function MediaOverlay({
  opacity = 0.5,
  color = '4,5,6',
  gradient = 'none',
  blendMode,
  className = '',
}: MediaOverlayProps) {
  const flat = `rgba(${color},${opacity})`;
  const background =
    gradient === 'none'
      ? flat
      : gradient === 'radial'
        ? `radial-gradient(ellipse at center, rgba(${color},${opacity * 0.35}) 0%, rgba(${color},${opacity}) 75%)`
        : `linear-gradient(${
            gradient === 'to-bottom' ? '180deg' : gradient === 'to-top' ? '0deg' : '90deg'
          }, rgba(${color},0) 0%, rgba(${color},${opacity * 0.6}) 45%, rgba(${color},${opacity}) 100%)`;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-[1] ${className}`}
      style={{ background, mixBlendMode: blendMode }}
    />
  );
}
