import { ShowcaseSection } from '../components/Section';
import { SkillLabel } from '../components/SkillLabel';
import { skillsById } from '../registry/skills';
import { BentoGrid } from '@/components/motion/BentoGrid';
import { HoverCard, ZoomImage } from '@/components/motion/Cards';
import { GradientBorder } from '@/motion/effects/GradientBorder';
import { plates } from '../data/content';

const CARDS = [
  { id: 'glass-card', title: 'Glass surface', body: 'Translucent fill, hairline border, and the upper-lip highlight that makes it read as glass rather than a faded box.', span: 'md:col-span-2 md:row-span-2', plate: 0, tilt: false, lift: 6 },
  { id: 'card-hover-lift', title: 'Hover lift', body: 'Six pixels toward the viewer.', span: '', plate: 1, tilt: false, lift: 6 },
  { id: 'image-zoom', title: 'Image zoom', body: 'The image scales; the frame does not move.', span: '', plate: 2, tilt: false, lift: 0 },
  { id: 'hover-glow', title: 'Cursor glow', body: 'Two custom properties feeding one static gradient.', span: 'md:col-span-2', plate: 3, tilt: false, lift: 4 },
  { id: 'image-tilt', title: 'Tilt', body: 'Capped at seven degrees.', span: '', plate: 0, tilt: true, lift: 0 },
  { id: 'card-scale', title: 'Card scale', body: 'One or two percent, never more.', span: '', plate: 1, tilt: false, lift: 0, scale: 1.02 },
];

export function S05Cards({ onInspect }: { onInspect: (id: string) => void }) {
  return (
    <ShowcaseSection
      id="s05"
      index="05"
      eyebrow="Cards & Bento"
      title="Surfaces that answer back."
      intro="Six card skills, composed rather than duplicated. Hover any of them; on a touch device none of these fire at all, and the cards are simply cards."
    >
      <BentoGrid className="md:grid-cols-4" stagger={0.07}>
        {CARDS.map((c) => {
          const skill = skillsById[c.id]!;
          const body = (
            <HoverCard lift={c.lift} scale={c.scale ?? 1} tilt={c.tilt ? { max: 7 } : false} className="flex h-full flex-col">
              <ZoomImage src={plates[c.plate]!} className="aspect-[16/10] w-full" scale={c.id === 'image-zoom' ? 1.12 : 1.04} />
              <div className="flex flex-1 flex-col p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">{skill.id}</p>
                <h3 className="mt-2 font-display text-xl text-bone">{c.title}</h3>
                <p className="mt-2 flex-1 text-[13px] leading-relaxed text-bone-dim">{c.body}</p>
                <button
                  type="button"
                  onClick={() => onInspect(skill.id)}
                  className="mt-4 self-start font-mono text-[10px] uppercase tracking-[0.18em] text-accent transition-opacity hover:opacity-70"
                >
                  Inspect
                </button>
              </div>
            </HoverCard>
          );

          return (
            <div key={c.id} className={c.span}>
              {c.id === 'hover-glow' ? <GradientBorder radius={16}>{body}</GradientBorder> : body}
            </div>
          );
        })}
      </BentoGrid>

      <div className="mt-6 max-w-sm">
        <SkillLabel skill={skillsById['bento-grid-motion']!} onInspect={onInspect} />
      </div>
    </ShowcaseSection>
  );
}
