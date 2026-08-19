import { useState } from 'react';
import { ShowcaseSection, Demo } from '../components/Section';
import { SkillLabel } from '../components/SkillLabel';
import { skillsById } from '../registry/skills';
import { SectionTransition, type SectionTransitionKind } from '@/motion/transitions/SectionTransition';
import { CinematicLoader } from '@/components/effects/CinematicLoader';
import { MagneticButton } from '@/components/motion/MagneticButton';

const KINDS: SectionTransitionKind[] = ['fade', 'scale', 'clip', 'blur', 'cinematic'];
const KIND_SKILL: Record<SectionTransitionKind, string> = {
  fade: 'fade-section-transition',
  scale: 'scale-section-transition',
  clip: 'clip-section-transition',
  blur: 'blur-transition',
  cinematic: 'cinematic-section-transition',
};

export function S01Load({ onInspect }: { onInspect: (id: string) => void }) {
  const [replay, setReplay] = useState(0);

  return (
    <ShowcaseSection
      id="s01"
      index="01"
      eyebrow="Load & Transitions"
      title="The first three seconds."
      intro="A loader is the only part of a site everybody sees and nobody asked for. It earns its place by setting a tone, remembering it has already done so, and never standing between a visitor and the content."
    >
      {/* The real loader replayed, not a mock. A demo of a loader that is not
          the loader is a demo of nothing. */}
      {replay > 0 && (
        <CinematicLoader key={replay} duration={1.6} logo="MS" skipOnRepeatVisit={false} onComplete={() => setReplay(0)} />
      )}

      <div className="space-y-5">
        <Demo label={<SkillLabel skill={skillsById['cinematic-loader']!} onInspect={onInspect} />} stageClassName="flex items-center justify-center">
          <div className="flex flex-col items-center gap-5 py-14">
            <span className="loader-shimmer font-display text-7xl leading-none">MS</span>
            <MagneticButton variant="ghost" onClick={() => setReplay((r) => r + 1)}>
              Replay loader
            </MagneticButton>
          </div>
        </Demo>

        <Demo label={<SkillLabel skill={skillsById['page-reveal']!} onInspect={onInspect} />} stageClassName="flex items-center justify-center p-8">
          <p className="max-w-sm text-center text-[15px] leading-relaxed text-bone-dim">
            This block entered with <code className="font-mono text-accent">page-reveal</code>: fourteen pixels and an opacity,
            running while the hero does something larger. Two big moves at once cancel each other out.
          </p>
        </Demo>
      </div>

      <div className="mt-14">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-bone-faint">
          J01–J05 · Section transitions · each fires as it enters
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {KINDS.map((kind) => {
            const skill = skillsById[KIND_SKILL[kind]]!;
            return (
              <SectionTransition key={kind} kind={kind}>
                <div className="h-full rounded-2xl border border-white/10 bg-ink-soft p-6">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">{skill.id}</p>
                  <p className="mt-3 font-display text-2xl capitalize text-bone">{kind}</p>
                  <p className="mt-2 text-[13px] leading-relaxed text-bone-dim">{skill.description}</p>
                  <button
                    type="button"
                    onClick={() => onInspect(skill.id)}
                    className="mt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-accent transition-opacity hover:opacity-70"
                  >
                    Inspect
                  </button>
                </div>
              </SectionTransition>
            );
          })}
        </div>
      </div>
    </ShowcaseSection>
  );
}
