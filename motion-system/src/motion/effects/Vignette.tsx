export interface VignetteProps {
  intensity?: number;
  /** How far in from the edge the darkening starts, 0–1. */
  spread?: number;
  className?: string;
}

/**
 * K03 — Vignette.
 *
 * Darkens the frame edge so the eye settles on the centre. Sits above media and
 * below content, and is always `pointer-events: none` — a full-bleed overlay
 * that swallows clicks is a bug that takes an hour to find.
 */
export function Vignette({ intensity = 0.55, spread = 0.55, className = '' }: VignetteProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-[2] ${className}`}
      style={{
        background: `radial-gradient(ellipse at center, transparent ${spread * 100}%, rgba(4,5,6,${intensity}) 100%)`,
      }}
    />
  );
}
