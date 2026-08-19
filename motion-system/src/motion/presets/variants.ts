import type { Variants } from 'framer-motion';
import { cubic } from './easings';
import { duration, distance } from './durations';

/**
 * Framer Motion variants for UI-state motion.
 *
 * Rule from the brief: never animate the same thing with both libraries. These
 * cover component state — mount/unmount, open/closed, hover — and stop where
 * scroll begins. Anything tied to scroll position belongs to GSAP.
 */

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: distance.default },
  visible: { opacity: 1, y: 0, transition: { duration: duration.entrance, ease: cubic.entrance } },
};

export const fadeScale: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1, transition: { duration: duration.entrance, ease: cubic.entrance } },
};

export const staggerParent = (step = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: step, delayChildren } },
});

export const modal: Variants = {
  hidden: { opacity: 0, scale: 0.97, y: 8 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: duration.ui, ease: cubic.entrance } },
  exit: { opacity: 0, scale: 0.98, y: 4, transition: { duration: duration.micro, ease: cubic.exit } },
};

/**
 * Accordion panel. Height animates from `auto`, which Framer resolves by
 * measuring — the one place where animating a layout property earns its cost,
 * because the alternative (max-height guesswork) either clips content or makes
 * short panels feel slow.
 */
export const accordionPanel: Variants = {
  collapsed: { height: 0, opacity: 0, transition: { duration: duration.ui, ease: cubic.exit } },
  open: { height: 'auto', opacity: 1, transition: { duration: duration.ui, ease: cubic.entrance } },
};

/** Reduced-motion twin: same states, no movement, content still appears. */
export const reducedVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.01 } },
  collapsed: { height: 0, opacity: 0, transition: { duration: 0.01 } },
  open: { height: 'auto', opacity: 1, transition: { duration: 0.01 } },
  exit: { opacity: 0, transition: { duration: 0.01 } },
};
