import { ShowcaseSection } from '../components/Section';
import { SkillLabel } from '../components/SkillLabel';
import { skillsById } from '../registry/skills';
import { Marquee } from '@/components/motion/Marquee';
import { marqueeStatements } from '../data/content';

const Item = ({ children }: { children: React.ReactNode }) => (
  <span className="flex items-center gap-10 font-display text-3xl text-bone md:text-5xl">
    {children}
    <span aria-hidden="true" className="text-accent">
      ·
    </span>
  </span>
);

export function S08Marquee({ onInspect }: { onInspect: (id: string) => void }) {
  return (
    <ShowcaseSection
      id="s08"
      index="08"
      eyebrow="Marquee"
      title="One strip, three speeds."
      intro="Pure CSS. Hover to pause any of them. Under reduced motion all three become ordinary scrollable strips, because the words were always the point and the movement was decoration."
    >
      <div className="space-y-8">
        <Marquee speed={30}>
          {marqueeStatements.map((s) => (
            <Item key={s}>{s}</Item>
          ))}
        </Marquee>

        <Marquee speed={18} reverse>
          {marqueeStatements
            .slice()
            .reverse()
            .map((s) => (
              <Item key={s}>{s}</Item>
            ))}
        </Marquee>

        <Marquee speed={52} pauseOnHover={false} itemClassName="opacity-60">
          {marqueeStatements.map((s) => (
            <Item key={s}>{s}</Item>
          ))}
        </Marquee>

        <div className="grid gap-3 pt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-bone-faint sm:grid-cols-3">
          <span>30s · forward · pauses</span>
          <span>18s · reverse · pauses</span>
          <span>52s · forward · no pause</span>
        </div>

        <div className="max-w-sm">
          <SkillLabel skill={skillsById['infinite-marquee']!} onInspect={onInspect} />
        </div>
      </div>
    </ShowcaseSection>
  );
}
