import { useReducedMotion } from '../accessibility/useReducedMotion';

export interface LightSweepProps {
  /** Seconds for one pass. */
  speed?: number;
  angle?: number;
  color?: string;
  /** Only sweep while the surface is hovered. */
  onHover?: boolean;
  className?: string;
}

/**
 * K04 — Light Sweep.
 *
 * A specular band travelling across a surface. Pure CSS transform on a
 * gradient — no repaint, only a composite.
 *
 * `onHover` is the mode worth defaulting to on real sites: a sweep looping
 * forever in the corner of the eye is the definition of animation fatigue.
 */
export function LightSweep({
  speed = 3.2,
  angle = 18,
  color = 'rgba(255,255,255,0.10)',
  onHover = true,
  className = '',
}: LightSweepProps) {
  const reduced = useReducedMotion();
  if (reduced) return null;
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${onHover ? 'sweep-on-hover' : 'sweep-always'} ${className}`}
      style={{ ['--sweep-speed' as string]: `${speed}s` }}
    >
      <div
        className="sweep-band absolute top-[-50%] h-[200%] w-[45%]"
        style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)`, transform: `rotate(${angle}deg)` }}
      />
    </div>
  );
}
