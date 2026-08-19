import { useCallback, useState } from 'react';
import { CinematicLoader } from '@/components/effects/CinematicLoader';
import { PageReveal } from '@/components/effects/PageReveal';
import { SkillInspector } from '@/showcase/components/SkillInspector';
import { skillsById, motionSkills, categoryLabels } from '@/showcase/registry/skills';
import { Hero } from '@/showcase/sections/Hero';
import { S01Load } from '@/showcase/sections/S01Load';
import { S02Text } from '@/showcase/sections/S02Text';
import { S03Scroll } from '@/showcase/sections/S03Scroll';
import { S04Product } from '@/showcase/sections/S04Product';
import { S05Cards } from '@/showcase/sections/S05Cards';
import { S06Interactions } from '@/showcase/sections/S06Interactions';
import { S07Atmosphere } from '@/showcase/sections/S07Atmosphere';
import { S08Marquee } from '@/showcase/sections/S08Marquee';
import { S09UI } from '@/showcase/sections/S09UI';
import { FullSystem } from '@/showcase/sections/FullSystem';
import { AmbientBlur } from '@/motion/effects/AmbientBlur';

const NAV = [
  ['s01', 'Load'],
  ['s02', 'Text'],
  ['s03', 'Scroll'],
  ['s04', 'Product'],
  ['s05', 'Cards'],
  ['s06', 'Interaction'],
  ['s07', 'Atmosphere'],
  ['s08', 'Marquee'],
  ['s09', 'UI'],
  ['full-system', 'Full system'],
] as const;

/** Counts read straight from the registry, so they can never go stale. */
const byCategory = Object.entries(categoryLabels).map(([key, label]) => ({
  label,
  count: motionSkills.filter((s) => s.category === key).length,
}));

export default function App() {
  const [inspected, setInspected] = useState<string | null>(null);
  const onInspect = useCallback((id: string) => setInspected(id), []);
  const onClose = useCallback(() => setInspected(null), []);

  return (
    <>
      <CinematicLoader duration={2.4} logo="MS" />

      <nav className="fixed inset-x-0 top-0 z-[70] hidden lg:block">
        <div className="relative mx-auto mt-4 flex w-fit items-center gap-1 overflow-hidden rounded-full border border-white/10 px-2 py-1.5">
          <AmbientBlur blur={18} tint="rgba(8,9,10,0.55)" />
          {NAV.map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              className="relative z-[2] rounded-full px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-bone-dim transition-colors hover:bg-white/5 hover:text-accent"
            >
              {label}
            </a>
          ))}
        </div>
      </nav>

      <PageReveal delay={0.15}>
        <main>
          <Hero />

          <section className="border-t border-white/[0.07] py-16">
            <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 px-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-bone-faint">
                {motionSkills.length} skills · 11 categories · one registry
              </p>
              <ul className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-[10px] uppercase tracking-[0.16em] text-bone-dim">
                {byCategory.map((c) => (
                  <li key={c.label}>
                    {c.label} <span className="text-accent">{c.count}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <S01Load onInspect={onInspect} />
          <S02Text onInspect={onInspect} />
          <S03Scroll onInspect={onInspect} />
          <S04Product onInspect={onInspect} />
          <S05Cards onInspect={onInspect} />
          <S06Interactions onInspect={onInspect} />
          <S07Atmosphere onInspect={onInspect} />
          <S08Marquee onInspect={onInspect} />
          <S09UI onInspect={onInspect} />
          <FullSystem />
        </main>
      </PageReveal>

      <SkillInspector skill={inspected ? (skillsById[inspected] ?? null) : null} onClose={onClose} />
    </>
  );
}
