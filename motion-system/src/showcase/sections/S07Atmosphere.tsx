import { ShowcaseSection } from '../components/Section';
import { SkillLabel } from '../components/SkillLabel';
import { skillsById } from '../registry/skills';
import { Grain } from '@/motion/effects/Grain';
import { RadialGlow } from '@/motion/effects/RadialGlow';
import { Vignette } from '@/motion/effects/Vignette';
import { LightSweep } from '@/motion/effects/LightSweep';
import { AmbientBlur } from '@/motion/effects/AmbientBlur';
import { GradientBorder } from '@/motion/effects/GradientBorder';
import { DustParticles } from '@/motion/effects/DustParticles';
import { plates } from '../data/content';

/**
 * Every effect is shown over a real composition rather than an empty box: an
 * atmospheric effect on a blank rectangle demonstrates nothing, because the
 * whole point of it is what it does to an image underneath.
 */
function Plate({ id, onInspect, children, plate = 0 }: { id: string; onInspect: (id: string) => void; children?: React.ReactNode; plate?: number }) {
  return (
    <div className="grid gap-4">
      <div className="sweep-host relative h-56 overflow-hidden rounded-2xl border border-white/10">
        <img src={plates[plate]} alt="" className="absolute inset-0 h-full w-full object-cover" />
        {children}
        <span className="absolute bottom-3 left-3 z-[6] rounded border border-white/15 bg-ink/70 px-2 py-1 font-mono text-[9.5px] uppercase tracking-wider text-bone-dim backdrop-blur-sm">
          {id}
        </span>
      </div>
      <SkillLabel skill={skillsById[id]!} onInspect={onInspect} compact />
    </div>
  );
}

export function S07Atmosphere({ onInspect }: { onInspect: (id: string) => void }) {
  return (
    <ShowcaseSection
      id="s07"
      index="07"
      eyebrow="Atmósfera"
      title="Lo que va entre las capas."
      intro="Siete efectos que por sí solos no significan nada y cambian cómo se siente todo lo que tienen debajo. Van sobre composiciones reales, porque sobre una caja vacía no demuestran nada."
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Plate id="grain" onInspect={onInspect} plate={0}>
          <Grain opacity={0.13} />
        </Plate>

        <Plate id="radial-glow" onInspect={onInspect} plate={1}>
          <RadialGlow y="100%" size="70vw" intensity={1} animated />
        </Plate>

        <Plate id="vignette" onInspect={onInspect} plate={2}>
          <Vignette intensity={0.8} spread={0.35} />
        </Plate>

        <Plate id="light-sweep" onInspect={onInspect} plate={3}>
          <LightSweep onHover={false} speed={4} color="rgba(255,255,255,0.16)" />
        </Plate>

        <Plate id="ambient-blur" onInspect={onInspect} plate={0}>
          <AmbientBlur blur={18} tint="rgba(8,9,10,0.35)" />
        </Plate>

        <Plate id="ambient-particles" onInspect={onInspect} plate={1}>
          <DustParticles count={60} opacity={0.9} />
        </Plate>

        <div className="grid gap-4">
          <GradientBorder radius={16} width={1.5} className="h-56 overflow-hidden">
            <div className="relative h-full overflow-hidden rounded-2xl">
              <img src={plates[2]} alt="" className="absolute inset-0 h-full w-full object-cover" />
              <AmbientBlur blur={10} tint="rgba(8,9,10,0.3)" />
              <span className="absolute bottom-3 left-3 z-[6] rounded border border-white/15 bg-ink/70 px-2 py-1 font-mono text-[9.5px] uppercase tracking-wider text-bone-dim">
                gradient-border
              </span>
            </div>
          </GradientBorder>
          <SkillLabel skill={skillsById['gradient-border']!} onInspect={onInspect} compact />
        </div>
      </div>
    </ShowcaseSection>
  );
}
