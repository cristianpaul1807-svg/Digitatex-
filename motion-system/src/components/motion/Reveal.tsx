import type { ElementType, ReactNode } from 'react';
import { useScrollReveal, type ScrollRevealOptions } from '@/motion/scroll/useScrollReveal';

export interface RevealProps extends ScrollRevealOptions {
  children: ReactNode;
  as?: ElementType;
  className?: string;
}

/**
 * C03/C04/C06 — Fade Up · Fade Scale · Clip Reveal.
 *
 * One component over the scroll-reveal engine. The variants are `kind` values
 * rather than separate components, so changing a reveal is a one-word edit
 * instead of an import swap.
 */
export function Reveal({ children, as: Tag = 'div', className = '', ...options }: RevealProps) {
  const ref = useScrollReveal<HTMLDivElement>(options);
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

/** C03 — Fade Up. */
export const FadeUp = (p: Omit<RevealProps, 'kind'>) => <Reveal {...p} kind="fade-up" />;
/** C04 — Fade + Scale. */
export const FadeScale = (p: Omit<RevealProps, 'kind'>) => <Reveal {...p} kind="fade-scale" />;
/** C06 — Clip Reveal. */
export const ClipReveal = (p: Omit<RevealProps, 'kind'>) => <Reveal {...p} kind="clip" />;

export interface StaggerRevealProps extends Omit<RevealProps, 'children'> {
  children: ReactNode;
  childSelector?: string;
}

/**
 * C05 — Stagger Reveal.
 *
 * `childSelector` defaults to direct children, which is what almost every use
 * wants and what people almost always forget to write.
 */
export function StaggerReveal({ children, childSelector = ':scope > *', className = '', ...options }: StaggerRevealProps) {
  const ref = useScrollReveal<HTMLDivElement>({ ...options, childSelector });
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
