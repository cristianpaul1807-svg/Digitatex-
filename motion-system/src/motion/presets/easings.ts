/**
 * Easing vocabulary.
 *
 * Principles 6 and 7: large transitions are slow and decelerate;
 * microinteractions are fast. Keeping the curves in one file is what stops a
 * codebase acquiring fourteen slightly different eases that all read as
 * "roughly ease-out".
 */
export const ease = {
  /** Entrances. Long tail, no overshoot — the reference's "ease-out fade". */
  entrance: 'power3.out',
  /** Exits. Leaves quickly; nobody watches something leave. */
  exit: 'power2.in',
  /** Scroll-scrubbed motion. Must be linear or it fights the finger. */
  scrub: 'none',
  /** Cinematic, section-scale moves. */
  cinematic: 'expo.out',
  /** Microinteractions. */
  micro: 'power2.out',
} as const;

/** Framer Motion / CSS cubic-beziers, same curves as above. */
export const cubic = {
  entrance: [0.22, 1, 0.36, 1],
  exit: [0.4, 0, 1, 1],
  cinematic: [0.16, 1, 0.3, 1],
  micro: [0.33, 1, 0.68, 1],
} as const;

export const cssEase = {
  entrance: 'cubic-bezier(0.22, 1, 0.36, 1)',
  exit: 'cubic-bezier(0.4, 0, 1, 1)',
  cinematic: 'cubic-bezier(0.16, 1, 0.3, 1)',
  micro: 'cubic-bezier(0.33, 1, 0.68, 1)',
} as const;
