import { useReducedMotion } from '../accessibility/useReducedMotion';

export interface GrainProps {
  opacity?: number;
  /** Noise cell size. Smaller = finer grain. */
  scale?: number;
  animated?: boolean;
  className?: string;
}

/**
 * K01 — Grain / Noise.
 *
 * An SVG `feTurbulence` tile, inlined as a data URI and repeated.
 *
 * Chosen over a canvas noise generator because it costs nothing at runtime: the
 * browser rasterises the tile once and it is then a plain repeating background.
 * A canvas equivalent redraws thousands of pixels per frame for a texture the
 * eye reads as static anyway.
 *
 * The animation is stepped, not smooth. Real film grain jumps frame to frame; a
 * smoothly interpolated grain reads as a sliding pattern, which is worse than
 * no grain at all.
 */
export function Grain({ opacity = 0.045, scale = 0.8, animated = true, className = '' }: GrainProps) {
  const reduced = useReducedMotion();
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'>` +
    `<filter id='n'><feTurbulence type='fractalNoise' baseFrequency='${scale}' numOctaves='3' stitchTiles='stitch'/>` +
    `<feColorMatrix type='saturate' values='0'/></filter>` +
    `<rect width='160' height='160' filter='url(%23n)'/></svg>`;
  const uri = `url("data:image/svg+xml,${svg.replace(/"/g, "'")}")`;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-[3] mix-blend-overlay ${animated && !reduced ? 'grain-animate' : ''} ${className}`}
      style={{ backgroundImage: uri, backgroundRepeat: 'repeat', opacity }}
    />
  );
}
