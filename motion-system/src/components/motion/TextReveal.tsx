import type { ElementType, ReactNode } from 'react';
import { useTextReveal, type TextRevealOptions } from '@/motion/text/useTextReveal';

export interface TextRevealProps extends TextRevealOptions {
  children: ReactNode;
  as?: ElementType;
  className?: string;
}

/**
 * C01/C02 — Text Reveal / Split Text Reveal.
 *
 * Children must be plain text: the splitter walks `textContent`, so nested
 * elements would be flattened. That is a limitation worth keeping rather than
 * engineering around — a headline needing rich markup inside it wants
 * `by="element"` anyway.
 */
export function TextReveal({ children, as: Tag = 'h2', className = '', ...options }: TextRevealProps) {
  const ref = useTextReveal<HTMLHeadingElement>(options);
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
