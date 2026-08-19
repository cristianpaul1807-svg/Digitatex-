import { useReducedMotion } from '../accessibility/useReducedMotion';

export interface RadialGlowProps {
  x?: string;
  y?: string;
  size?: string;
  color?: string;
  intensity?: number;
  animated?: boolean;
  className?: string;
}

/**
 * K02 — Radial Glow.
 *
 * Reference: "Background: subtle radial lime glow at bottom-center".
 *
 * The stops are deliberately soft-shouldered. A hard stop produces a visible
 * ring on gradient-banding-prone panels, which is most of them at these low
 * opacities; two stops before transparent costs nothing and kills the ring.
 */
export function RadialGlow({
  x = '50%',
  y = '100%',
  size = '80vw',
  color = 'rgba(200,242,74,0.30)',
  intensity = 1,
  animated = false,
  className = '',
}: RadialGlowProps) {
  const reduced = useReducedMotion();
  const mid = color.replace(/[\d.]+\)$/, '0.08)');
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-[1] ${animated && !reduced ? 'glow-breathe' : ''} ${className}`}
      style={{
        background: `radial-gradient(circle ${size} at ${x} ${y}, ${color} 0%, ${mid} 38%, transparent 68%)`,
        opacity: intensity,
      }}
    />
  );
}
