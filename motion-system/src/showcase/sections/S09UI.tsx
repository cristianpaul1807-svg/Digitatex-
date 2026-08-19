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
      eyebrow="Movimiento de interfaz"
      title="Movimiento que informa."
      intro="La categoría menos vistosa y la que más peso lleva: estas son las animaciones con las que un visitante interactúa de verdad, en vez de mirarlas."
    >
      <div className="grid gap-12 lg:grid-cols-[1fr_320px] lg:items-start">
        <div>
          <Accordion items={faqItems} mode="single" defaultOpen={['when']} />
          <p className="mt-6 text-[13px] leading-relaxed text-bone-faint">
            Pruébalo con el teclado. Llega a una pregunta con el tabulador y pulsa Intro o Espacio. Los paneles cerrados no están
            solo ocultos: no existen, así que el tabulador nunca cae dentro de uno.
          </p>
        </div>

        <div className="space-y-4">
          <SkillLabel skill={skillsById['animated-accordion']!} onInspect={onInspect} />
          <div className="rounded-xl border border-white/10 bg-ink/70 p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-bone-faint">Ventana modal</p>
            <p className="mt-2 text-[13px] leading-relaxed text-bone-dim">
              El mismo diálogo que usa la ficha de cada efecto: se cierra con Escape o tocando fuera, y bloquea el scroll de detrás.
            </p>
            <div className="mt-4">
              <MagneticButton variant="ghost" onClick={() => setDemoModal(true)}>
                Abrir la ventana
              </MagneticButton>
            </div>
          </div>
        </div>
      </div>

      <SkillInspector skill={demoModal ? skillsById['animated-accordion']! : null} onClose={() => setDemoModal(false)} />
    </ShowcaseSection>
  );
}
