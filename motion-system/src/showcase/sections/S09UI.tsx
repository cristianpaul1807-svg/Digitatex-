import { useState } from 'react';
import { ShowcaseSection } from '../components/Section';
import { SkillLabel } from '../components/SkillLabel';
import { skillsById } from '../registry/skills';
import { Accordion } from '@/components/motion/Accordion';
import { MagneticButton } from '@/components/motion/MagneticButton';
import { SkillInspector } from '../components/SkillInspector';
import { faqItems } from '../data/content';

export function S09UI({ onInspect }: { onInspect: (id: string) => void }) {
  const [demoModal, setDemoModal] = useState(false);

  return (
    <ShowcaseSection
      id="s09"
      index="09"
      eyebrow="UI Motion"
      title="Motion that reports state."
      intro="The least glamorous category and the one that carries the most weight: these are the animations a visitor actually interacts with rather than watches."
    >
      <div className="grid gap-12 lg:grid-cols-[1fr_320px] lg:items-start">
        <div>
          <Accordion items={faqItems} mode="single" defaultOpen={['when']} />
          <p className="mt-6 text-[13px] leading-relaxed text-bone-faint">
            Try it with the keyboard. Tab to a question, press Enter or Space, and note that the closed panels are not merely
            hidden — they are unmounted, so tabbing never lands inside one.
          </p>
        </div>

        <div className="space-y-4">
          <SkillLabel skill={skillsById['animated-accordion']!} onInspect={onInspect} />
          <div className="rounded-xl border border-white/10 bg-ink/70 p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-bone-faint">Modal transition</p>
            <p className="mt-2 text-[13px] leading-relaxed text-bone-dim">
              The same dialog the Inspect Skill panel uses: Escape to close, backdrop to close, scroll locked behind it.
            </p>
            <div className="mt-4">
              <MagneticButton variant="ghost" onClick={() => setDemoModal(true)}>
                Open dialog
              </MagneticButton>
            </div>
          </div>
        </div>
      </div>

      <SkillInspector skill={demoModal ? skillsById['animated-accordion']! : null} onClose={() => setDemoModal(false)} />
    </ShowcaseSection>
  );
}
