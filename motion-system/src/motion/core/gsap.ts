import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

/**
 * Single registration point for GSAP plugins.
 *
 * Registering inside components looks harmless and is not: with React 18 in
 * StrictMode every effect runs twice, and registration scattered across modules
 * makes the order of ScrollTrigger refreshes depend on which component mounted
 * first. One module, imported once, keeps it deterministic.
 */
gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * On mobile the address bar collapsing fires a resize for a height change the
 * layout does not care about, and the resulting refresh makes pinned sections
 * jump. Ignoring pure-height resizes is the standard fix.
 */
ScrollTrigger.config({ ignoreMobileResize: true });

export { gsap, ScrollTrigger, useGSAP };

/** Refresh every trigger — call after fonts load or images change layout. */
export function refreshScrollTriggers() {
  ScrollTrigger.refresh();
}

/** Kill every trigger owned by a container, for triggers made outside a context. */
export function killTriggersIn(container: Element | null) {
  if (!container) return;
  ScrollTrigger.getAll().forEach((t) => {
    if (t.trigger && container.contains(t.trigger)) t.kill();
  });
}
