import type { ReactNode } from 'react';
import { TextReveal } from '@/components/motion/TextReveal';
import { FadeUp } from '@/components/motion/Reveal';

export interface SectionProps {
  id: string;
  index?: string;
  eyebrow: string;
  title: string;
  intro?: string;
  children: ReactNode;
  className?: string;
}

/** Shared chrome for every showcase section, so the rhythm never drifts. */
export function ShowcaseSection({ id, index, eyebrow, title, intro, children, className = '' }: SectionProps) {
  return (
    <section id={id} className={`relative border-t border-white/[0.07] py-24 md:py-32 ${className}`}>
      <div className="mx-auto max-w-6xl px-6">
        <header className="max-w-3xl">
          <div className="flex items-baseline gap-4">
            {index && <span className="font-mono text-[11px] tracking-[0.2em] text-accent">{index}</span>}
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-bone-faint">{eyebrow}</span>
          </div>
          <TextReveal as="h2" by="lines" className="mt-5 font-display text-4xl leading-[1.05] text-bone md:text-6xl">
            {title}
          </TextReveal>
          {intro && (
            <FadeUp delay={0.1}>
              <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-bone-dim">{intro}</p>
            </FadeUp>
          )}
        </header>
        <div className="mt-14 md:mt-16">{children}</div>
      </div>
    </section>
  );
}

/** A single labelled demonstration: the stage on one side, the card on the other. */
export function Demo({ children, label, stageClassName = '' }: { children: ReactNode; label: ReactNode; stageClassName?: string }) {
  return (
    <div className="grid gap-5 md:grid-cols-[1fr_300px] md:items-stretch">
      <div className={`relative min-h-[220px] overflow-hidden rounded-2xl border border-white/10 bg-ink-soft ${stageClassName}`}>
        {children}
      </div>
      <div className="md:self-center">{label}</div>
    </div>
  );
}
