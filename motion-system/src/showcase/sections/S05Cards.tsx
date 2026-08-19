import { ShowcaseSection } from '../components/Section';
import { SkillLabel } from '../components/SkillLabel';
import { skillsById } from '../registry/skills';
import { BentoGrid } from '@/components/motion/BentoGrid';
import { HoverCard, ZoomImage } from '@/components/motion/Cards';
import { GradientBorder } from '@/motion/effects/GradientBorder';
import { plates } from '../data/content';

const CARDS = [
  { id: 'glass-card', title: 'Superficie de cristal', body: 'Relleno translúcido, borde de un píxel, y el brillo del canto superior que la hace leerse como cristal y no como una caja apagada.', span: 'md:col-span-2 md:row-span-2', plate: 0, tilt: false, lift: 6 },
  { id: 'card-hover-lift', title: 'Se eleva', body: 'Seis píxeles hacia quien mira.', span: '', plate: 1, tilt: false, lift: 6 },
  { id: 'image-zoom', title: 'Zoom de imagen', body: 'La imagen crece; el marco no se mueve.', span: '', plate: 2, tilt: false, lift: 0 },
  { id: 'hover-glow', title: 'Resplandor', body: 'Dos variables alimentando un único degradado fijo.', span: 'md:col-span-2', plate: 3, tilt: false, lift: 4 },
  { id: 'image-tilt', title: 'Inclinación', body: 'Con tope en siete grados.', span: '', plate: 0, tilt: true, lift: 0 },
  { id: 'card-scale', title: 'Crece un poco', body: 'Un uno o un dos por ciento, nunca más.', span: '', plate: 1, tilt: false, lift: 0, scale: 1.02 },
];

export function S05Cards({ onInspect }: { onInspect: (id: string) => void }) {
  return (
    <ShowcaseSection
      id="s05"
      index="05"
      eyebrow="Tarjetas y bento"
      title="Superficies que responden."
      intro="Seis efectos de tarjeta, combinados en vez de duplicados. Pasa el cursor por cualquiera; en una pantalla táctil ninguno se dispara, y las tarjetas son simplemente tarjetas."
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
                  Ver ficha
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
