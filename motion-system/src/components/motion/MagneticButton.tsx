import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useMagnetic, type MagneticOptions } from '@/motion/interactions/useMagnetic';
import { useReducedMotion } from '@/motion/accessibility/useReducedMotion';
import { cubic } from '@/motion/presets/easings';
import { duration } from '@/motion/presets/durations';

type MotionButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onAnimationStart' | 'onDragStart' | 'onDragEnd' | 'onDrag'>;

export interface MagneticButtonProps extends MotionButtonProps, Pick<MagneticOptions, 'strength' | 'radius'> {
  children: ReactNode;
  variant?: 'solid' | 'ghost';
}

/**
 * G01 + G02 — Button Scale + Magnetic Button.
 *
 * Reference: "button slight scale (1.02)".
 *
 * Two libraries on one element, which sounds like the thing the brief forbids
 * and is not: GSAP owns the translation (a continuous cursor-tracked value) and
 * Framer owns the scale (a discrete hover state). They write different
 * transform channels, so they compose. Two libraries animating the *same*
 * property would be the mistake.
 *
 * 1.02 is small on purpose. A button that jumps to 1.1 stops reading as
 * feedback and starts reading as a different button.
 */
export function MagneticButton({ children, variant = 'solid', strength, radius, className = '', ...props }: MagneticButtonProps) {
  const ref = useMagnetic<HTMLButtonElement>({ strength, radius, childSelector: '[data-magnetic-label]' });
  const reduced = useReducedMotion();

  const base =
    variant === 'solid'
      ? 'bg-accent text-ink hover:bg-accent/90'
      : 'border border-white/20 text-bone hover:border-accent/60 hover:text-accent';

  return (
    <motion.button
      ref={ref}
      whileHover={reduced ? undefined : { scale: 1.02 }}
      whileTap={reduced ? undefined : { scale: 0.98 }}
      transition={{ duration: duration.micro, ease: cubic.micro }}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors duration-200 ${base} ${className}`}
      {...props}
    >
      <span data-magnetic-label className="inline-flex items-center gap-2">
        {children}
      </span>
    </motion.button>
  );
}

/**
 * G03 — Magnetic Link.
 *
 * Same mechanic, weaker pull and no scale. A link that grows on hover competes
 * with the paragraph it lives in.
 */
export function MagneticLink({ children, href, className = '' }: { children: ReactNode; href: string; className?: string }) {
  const ref = useMagnetic<HTMLAnchorElement>({ strength: 0.22, radius: 34 });
  return (
    <a
      ref={ref}
      href={href}
      className={`relative inline-block text-bone underline-offset-4 transition-colors duration-200 hover:text-accent ${className}`}
    >
      {children}
    </a>
  );
}
