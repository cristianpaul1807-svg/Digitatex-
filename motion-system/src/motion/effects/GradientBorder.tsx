import type { ReactNode } from 'react';

export interface GradientBorderProps {
  children: ReactNode;
  radius?: number;
  width?: number;
  from?: string;
  to?: string;
  className?: string;
}

/**
 * K06 — Gradient Border.
 *
 * A gradient hairline around a surface, done with `mask-composite: exclude` on
 * a pseudo-element rather than the usual gradient-background-with-inset-child
 * trick.
 *
 * The reason: that trick forces the inner element to paint its own background
 * over whatever is behind it, which kills any `backdrop-filter` underneath.
 * Masking paints only the ring, so glass surfaces stay glass.
 */
export function GradientBorder({
  children,
  radius = 16,
  width = 1,
  from = 'rgba(200,242,74,0.55)',
  to = 'rgba(200,242,74,0)',
  className = '',
}: GradientBorderProps) {
  return (
    <div
      className={`gradient-border relative ${className}`}
      style={{
        ['--gb-width' as string]: `${width}px`,
        ['--gb-from' as string]: from,
        ['--gb-to' as string]: to,
        borderRadius: radius,
      }}
    >
      {children}
    </div>
  );
}
