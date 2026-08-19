import type { MotionSkill } from '@/motion/core/types';
import { categoryLabels } from '../registry/skills';

const techLabel: Record<string, string> = {
  gsap: 'GSAP',
  scrolltrigger: 'ScrollTrigger',
  'framer-motion': 'Framer Motion',
  css: 'CSS',
  canvas: 'Canvas',
  'hls.js': 'hls.js',
  react: 'React',
};

const costTone: Record<string, string> = {
  none: 'text-emerald-300/80',
  low: 'text-emerald-300/80',
  medium: 'text-amber-300/80',
  high: 'text-rose-300/80',
};

export interface SkillLabelProps {
  skill: MotionSkill;
  onInspect?: (id: string) => void;
  compact?: boolean;
}

/**
 * The label that turns a demo into documentation.
 *
 * The brief's requirement: a developer should see an effect and immediately
 * know its name, what it does, what implements it, when to use it and what
 * happens on mobile. Everything here is read from the registry, so a label can
 * never drift out of sync with the skill it describes.
 */
export function SkillLabel({ skill, onInspect, compact = false }: SkillLabelProps) {
  return (
    <div className="rounded-xl border border-white/10 bg-ink/70 p-4 backdrop-blur-sm">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-bone-faint">{categoryLabels[skill.category]}</p>
      <div className="mt-1.5 flex items-baseline justify-between gap-3">
        <h4 className="font-display text-lg leading-tight text-bone">{skill.name}</h4>
        <code className="shrink-0 font-mono text-[10px] text-accent/70">{skill.id}</code>
      </div>

      {!compact && <p className="mt-2 text-[13px] leading-relaxed text-bone-dim">{skill.description}</p>}

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {skill.dependencies.map((d) => (
          <span key={d} className="rounded border border-white/10 px-1.5 py-0.5 font-mono text-[9.5px] uppercase tracking-wider text-bone-dim">
            {techLabel[d] ?? d}
          </span>
        ))}
      </div>

      {!compact && (
        <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 border-t border-white/[0.07] pt-3 font-mono text-[10px] uppercase tracking-wider">
          <div className="flex justify-between gap-2">
            <dt className="text-bone-faint">Cost</dt>
            <dd className={costTone[skill.performanceCost]}>{skill.performanceCost}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-bone-faint">Mobile</dt>
            <dd className="text-bone-dim">{skill.mobile.behaviour}</dd>
          </div>
        </dl>
      )}

      {onInspect && (
        <button
          type="button"
          onClick={() => onInspect(skill.id)}
          className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-accent transition-opacity hover:opacity-70"
        >
          Inspect skill
        </button>
      )}
    </div>
  );
}
