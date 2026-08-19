/**
 * Duration scale, in seconds.
 *
 * Derived from the reference's two stated numbers — a 3s loader and a 300ms
 * accordion — extended into a scale, so everything between them is a choice
 * from a set rather than a number somebody typed.
 */
export const duration = {
  /** Hover feedback. Below ~120ms a transition reads as a jump. */
  instant: 0.12,
  micro: 0.2,
  /** Accordions, tooltips, menus. The reference's 300ms lives here. */
  ui: 0.3,
  entrance: 0.8,
  section: 1.2,
  cinematic: 1.6,
  /** From "3s monogram shimmer". */
  loader: 3,
} as const;

/** Stagger steps. Above ~0.12s on a long list it reads as a queue. */
export const stagger = { tight: 0.04, default: 0.08, loose: 0.14 } as const;

/** Distances in px for translate-based reveals. */
export const distance = { subtle: 12, default: 36, large: 72 } as const;
