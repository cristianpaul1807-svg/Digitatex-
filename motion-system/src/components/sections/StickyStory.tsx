import type { ReactNode } from 'react';
import { useStickyStory } from '@/motion/scroll/useStickyStory';

export interface StickyChapter {
  id: string;
  eyebrow?: string;
  title: string;
  body: string;
  visual: ReactNode;
}

export interface StickyStoryProps {
  chapters: StickyChapter[];
  heightPerStep?: number;
  className?: string;
}

/**
 * D03 — Sticky Storytelling.
 *
 * Reference: "Sticky-pinned scroll variant on desktop".
 *
 * Note the two branches below are not the same markup with a class toggled —
 * they are different layouts, which is what "make intentional mobile fallbacks"
 * means in practice. The pinned version can afford one chapter at a time
 * because the viewport is wide; the stacked version shows all of them because
 * that is how a phone reads.
 *
 * Inactive chapters are `aria-hidden` and non-interactive, so tabbing never
 * lands on a caption nobody can see.
 */
export function StickyStory({ chapters, heightPerStep = 1, className = '' }: StickyStoryProps) {
  const { ref, pinRef, index, progress, pinned } = useStickyStory<HTMLDivElement>({
    steps: chapters.length,
    heightPerStep,
  });

  if (!pinned) {
    return (
      <div ref={ref} className={`space-y-20 ${className}`}>
        {chapters.map((c, i) => (
          <div key={c.id} className="space-y-5">
            <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-white/10">{c.visual}</div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
              {c.eyebrow ?? String(i + 1).padStart(2, '0')}
            </p>
            <h3 className="font-display text-3xl text-bone">{c.title}</h3>
            <p className="max-w-prose text-[15px] leading-relaxed text-bone-dim">{c.body}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div ref={ref} className={className}>
      <div ref={pinRef} className="flex h-[100svh] items-center">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-2 items-center gap-16 px-6">
          <div className="relative">
            {chapters.map((c, i) => (
              <div
                key={c.id}
                aria-hidden={i !== index}
                className="transition-opacity duration-500 ease-entrance"
                style={{
                  position: i === 0 ? 'relative' : 'absolute',
                  inset: i === 0 ? undefined : 0,
                  opacity: i === index ? 1 : 0,
                  pointerEvents: i === index ? 'auto' : 'none',
                }}
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                  {c.eyebrow ?? String(i + 1).padStart(2, '0')}
                </p>
                <h3 className="mt-5 font-display text-4xl leading-tight text-bone">{c.title}</h3>
                <p className="mt-5 max-w-prose text-[15px] leading-relaxed text-bone-dim">{c.body}</p>
              </div>
            ))}
            <div className="mt-10 h-px w-full bg-white/10">
              <div className="h-px bg-accent" style={{ width: `${progress * 100}%` }} />
            </div>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10">
            {chapters.map((c, i) => (
              <div
                key={c.id}
                aria-hidden={i !== index}
                className="absolute inset-0 transition-opacity duration-700 ease-entrance"
                style={{ opacity: i === index ? 1 : 0 }}
              >
                {c.visual}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
