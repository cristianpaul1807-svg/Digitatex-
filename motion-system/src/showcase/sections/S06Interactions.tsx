import { ShowcaseSection } from '../components/Section';
import { SkillLabel } from '../components/SkillLabel';
import { skillsById } from '../registry/skills';
import { MagneticButton, MagneticLink } from '@/components/motion/MagneticButton';
import { useHoverGlow } from '@/motion/interactions/useHoverGlow';
import { useTilt } from '@/motion/interactions/useTilt';
import { plates } from '../data/content';

function Bench({ id, onInspect, children }: { id: string; onInspect: (id: string) => void; children: React.ReactNode }) {
  return (
    <div className="grid gap-4">
      <div className="flex min-h-[190px] items-center justify-center rounded-2xl border border-white/10 bg-ink-soft p-8">{children}</div>
      <SkillLabel skill={skillsById[id]!} onInspect={onInspect} compact />
    </div>
  );
}

function GlowPanel() {
  const ref = useHoverGlow<HTMLDivElement>({ size: 280, intensity: 1 });
  return (
    <div ref={ref} className="hover-glow flex h-32 w-full items-center justify-center rounded-xl border border-white/10 bg-white/[0.03]">
      <span className="relative z-[2] font-mono text-[10px] uppercase tracking-[0.2em] text-bone-dim">move the cursor here</span>
    </div>
  );
}

function TiltPlate() {
  const ref = useTilt<HTMLDivElement>({ max: 8, lift: 18 });
  return (
    <div ref={ref} className="overflow-hidden rounded-xl border border-white/10">
      <img src={plates[2]} alt="" className="h-32 w-48 object-cover" />
    </div>
  );
}

export function S06Interactions({ onInspect }: { onInspect: (id: string) => void }) {
  return (
    <ShowcaseSection
      id="s06"
      index="06"
      eyebrow="Microinteractions"
      title="An interaction laboratory."
      intro="Five cursor-driven skills, all live. Every one of them checks pointer capability rather than screen width, and attaches no listener at all on a device without a fine pointer."
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Bench id="button-scale" onInspect={onInspect}>
          <MagneticButton strength={0} radius={0}>
            Scale only
          </MagneticButton>
        </Bench>

        <Bench id="magnetic-button" onInspect={onInspect}>
          <MagneticButton strength={0.4} radius={80}>
            Magnetic
          </MagneticButton>
        </Bench>

        <Bench id="magnetic-link" onInspect={onInspect}>
          <p className="text-center text-[15px] leading-relaxed text-bone-dim">
            An inline <MagneticLink href="#s06">magnetic link</MagneticLink> inside a sentence, pulling gently and never scaling.
          </p>
        </Bench>

        <Bench id="hover-glow" onInspect={onInspect}>
          <GlowPanel />
        </Bench>

        <Bench id="image-tilt" onInspect={onInspect}>
          <TiltPlate />
        </Bench>

        <Bench id="card-hover-lift" onInspect={onInspect}>
          <div className="text-center">
            <p className="font-display text-2xl text-bone">6px</p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-bone-faint">
              the lift, straight from the brief
            </p>
          </div>
        </Bench>
      </div>
    </ShowcaseSection>
  );
}
