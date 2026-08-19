import { useRef, type ReactNode } from 'react';
import { gsap, useGSAP } from '../core/gsap';
import { useReducedMotion } from '../accessibility/useReducedMotion';
import { ease } from '../presets/easings';
import { duration } from '../presets/durations';

export type SectionTransitionKind = 'fade' | 'scale' | 'clip' | 'blur' | 'cinematic';

export interface SectionTransitionProps {
  children: ReactNode;
  /** J01 fade · J02 scale · J03 clip · J04 blur · J05 cinematic. */
  kind?: SectionTransitionKind;
  scrub?: boolean | number;
  start?: string;
  end?: string;
  className?: string;
}

/**
 * J01–J05 — Section Transitions.
 *
 * One component, five behaviours, because they differ only in which properties
 * animate — and keeping them together is what stops a codebase acquiring five
 * near-identical wrappers.
 *
 * `cinematic` composes three of the others. That is the intended way to build a
 * signature transition: compose primitives, do not write a sixth special case.
 *
 * On `blur`: `filter: blur()` is the one property here that is not free. It
 * repaints the whole subtree every frame. Fine as a short entrance; a scrubbed
 * blur across a long section reliably drops frames on a mid-range phone.
 *
 * Two consequences of using a transform, both handled here:
 *
 *  1. `scale: 1.06` on a full-width section makes it 6% wider than the
 *     viewport, and it sits there overflowing until the trigger fires. Measured:
 *     exactly `width * 0.06 / 2` of horizontal document scroll — 43px at 1440,
 *     12px at 390.
 *
 *     The clip has to go on a PARENT, not on the animated element. Clipping the
 *     element itself only clips its content; the element's own scaled box still
 *     overflows. Hence the outer wrapper below. `clip` rather than `hidden`
 *     because `hidden` would make the wrapper a scroll container and any
 *     `position: sticky` inside would then stick to it instead of the viewport.
 *
 *  2. A transform makes this element the containing block for every
 *     `position: fixed` descendant — which is how ScrollTrigger implements
 *     `pin`. So the transform is cleared once the entrance finishes.
 *
 *     A SCRUBBED transition cannot clear it, because the transform *is* the
 *     animation. DO NOT put a pinned section (StickyStory, HorizontalScroll,
 *     ProductScroll) inside a scrubbed SectionTransition — it will render
 *     thousands of pixels off-screen, silently.
 */
export function SectionTransition({
  children,
  kind = 'fade',
  scrub = false,
  start = 'top 80%',
  end = 'top 30%',
  className = '',
}: SectionTransitionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (reduced) {
        gsap.set(el, { opacity: 1, clearProps: 'filter,clipPath,transform' });
        return;
      }

      const from: gsap.TweenVars = { opacity: 0 };
      const to: gsap.TweenVars = {
        opacity: 1,
        duration: kind === 'cinematic' ? duration.cinematic : duration.section,
        ease: kind === 'cinematic' ? ease.cinematic : ease.entrance,
      };

      if (kind === 'scale' || kind === 'cinematic') {
        from.scale = 1.06;
        to.scale = 1;
      }
      if (kind === 'clip' || kind === 'cinematic') {
        from.clipPath = 'inset(12% 0% 12% 0% round 18px)';
        to.clipPath = 'inset(0% 0% 0% 0% round 0px)';
      }
      if (kind === 'blur' || kind === 'cinematic') {
        from.filter = 'blur(14px)';
        to.filter = 'blur(0px)';
      }

      gsap.fromTo(el, from, {
        ...to,
        scrollTrigger: { trigger: el, start, end, scrub, once: !scrub },
        onComplete: scrub
          ? undefined
          : () => gsap.set(el, { clearProps: 'transform,filter,clipPath,willChange' }),
      });
    },
    { scope: ref, dependencies: [reduced, kind, scrub, start, end] },
  );

  return (
    <div style={{ overflowX: 'clip' }}>
      <div ref={ref} className={className}>
        {children}
      </div>
    </div>
  );
}
