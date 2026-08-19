import { ShowcaseSection, Demo } from '../components/Section';
import { SkillLabel } from '../components/SkillLabel';
import { skillsById } from '../registry/skills';
import { TextReveal } from '@/components/motion/TextReveal';
import { FadeUp, FadeScale, ClipReveal, StaggerReveal } from '@/components/motion/Reveal';

export function S02Text({ onInspect }: { onInspect: (id: string) => void }) {
  return (
    <ShowcaseSection
      id="s02"
      index="02"
      eyebrow="Movimiento de texto"
      title="Tipografía que llega."
      intro="Seis entradas, ordenadas de más a menos atención que piden. El titular de aquí arriba usó la primera — como todos los títulos de sección de esta página."
    >
      <div className="space-y-5">
        <Demo label={<SkillLabel skill={skillsById['text-reveal']!} onInspect={onInspect} />} stageClassName="flex items-center p-8 md:p-12">
          <TextReveal as="p" by="lines" className="font-display text-3xl leading-tight text-bone md:text-4xl">
            Las líneas suben desde detrás de una máscara, una tras otra, en el orden en que se leen.
          </TextReveal>
        </Demo>

        <Demo label={<SkillLabel skill={skillsById['split-text-reveal']!} onInspect={onInspect} />} stageClassName="flex items-center p-8 md:p-12">
          <TextReveal as="p" by="words" stagger={0.03} className="font-display text-3xl leading-tight text-bone md:text-4xl">
            O palabra por palabra, cuando lo que importa es la frase misma.
          </TextReveal>
        </Demo>

        <Demo label={<SkillLabel skill={skillsById['fade-up']!} onInspect={onInspect} />} stageClassName="flex items-center p-8 md:p-12">
          <FadeUp>
            <p className="text-[15px] leading-relaxed text-bone-dim">
              La de siempre. Treinta y seis píxeles y una opacidad en ochocientas milésimas. Si dudas cuál usar, es esta —
              y la mayoría de las veces debería seguir siendo esta.
            </p>
          </FadeUp>
        </Demo>

        <Demo label={<SkillLabel skill={skillsById['fade-scale']!} onInspect={onInspect} />} stageClassName="flex items-center justify-center p-8">
          <FadeScale>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-10 py-14 text-center">
              <p className="font-display text-2xl text-bone">0.94 → 1</p>
              <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.18em] text-bone-faint">se asienta, no aterriza</p>
            </div>
          </FadeScale>
        </Demo>

        <Demo label={<SkillLabel skill={skillsById['stagger-reveal']!} onInspect={onInspect} />} stageClassName="p-8">
          <StaggerReveal stagger={0.09} className="grid gap-3 sm:grid-cols-2">
            {['La secuencia implica orden', 'El orden implica importancia', 'La importancia es jerarquía', 'La jerarquía es todo el trabajo'].map((t) => (
              <div key={t} className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4 text-[14px] text-bone-dim">
                {t}
              </div>
            ))}
          </StaggerReveal>
        </Demo>

        <Demo label={<SkillLabel skill={skillsById['clip-reveal']!} onInspect={onInspect} />} stageClassName="p-8">
          <div className="grid gap-3 sm:grid-cols-3">
            {(['bottom', 'left', 'center'] as const).map((origin) => (
              <ClipReveal key={origin} clipFrom={origin}>
                <div className="flex h-40 items-end rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-transparent p-4">
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">desde {origin}</span>
                </div>
              </ClipReveal>
            ))}
          </div>
        </Demo>
      </div>
    </ShowcaseSection>
  );
}
