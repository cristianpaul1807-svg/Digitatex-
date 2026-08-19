import { useEffect, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { MotionSkill } from '@/motion/core/types';
import { categoryLabels } from '../registry/skills';
import { useReducedMotion } from '@/motion/accessibility/useReducedMotion';
import { modal, reducedVariants } from '@/motion/presets/variants';

export interface SkillInspectorProps {
  skill: MotionSkill | null;
  onClose: () => void;
}

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="grid grid-cols-[110px_1fr] gap-4 border-t border-white/[0.07] py-3 md:grid-cols-[128px_1fr]">
      <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-bone-faint">{label}</dt>
      <dd className="text-[13.5px] leading-relaxed text-bone-dim">{value}</dd>
    </div>
  );
}

/**
 * The Inspect Skill panel.
 *
 * A dialog, done properly: Escape closes it, the backdrop closes it, the page
 * behind it cannot scroll, and `role="dialog"` with `aria-modal` tells
 * assistive tech the rest of the page is inert. A modal that traps nothing and
 * announces nothing is a div pretending to be a dialog.
 */
export function SkillInspector({ skill, onClose }: SkillInspectorProps) {
  const reduced = useReducedMotion();
  const variants = reduced ? reducedVariants : modal;

  useEffect(() => {
    if (!skill) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.documentElement.style.overflow = prev;
    };
  }, [skill, onClose]);

  return (
    <AnimatePresence>
      {skill && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-end justify-center p-4 md:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 bg-ink/80 backdrop-blur-sm" />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="inspector-title"
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative max-h-[86svh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/[0.12] bg-ink-soft p-6 shadow-2xl md:p-7"
          >
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">{categoryLabels[skill.category]}</p>
                <h3 id="inspector-title" className="mt-2 font-display text-3xl leading-tight text-bone">
                  {skill.name}
                </h3>
                <code className="mt-1 block font-mono text-[11px] text-bone-faint">{skill.id}</code>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="shrink-0 rounded-full border border-white/15 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-bone-dim transition-colors hover:border-accent/60 hover:text-accent"
              >
                Esc
              </button>
            </div>

            <p className="mt-5 text-[15px] leading-relaxed text-bone">{skill.description}</p>

            <dl className="mt-6">
              <Row label="Technology" value={skill.dependencies.join(' · ')} />
              <Row label="Difficulty" value={skill.difficulty} />
              <Row label="Performance" value={skill.performanceCost} />
              <Row label="Desktop" value={skill.desktop} />
              <Row label="Tablet" value={skill.tablet} />
              <Row label="Mobile" value={<><span className="text-bone">{skill.mobile.behaviour}</span> — {skill.mobile.note}</>} />
              <Row label="Reduced motion" value={<><span className="text-bone">{skill.reducedMotion.behaviour}</span> — {skill.reducedMotion.note}</>} />
              <Row label="Recommended" value={skill.recommendedUse.join(' · ')} />
              <Row label="Source" value={<em className="text-bone-faint">{skill.sourceReference}</em>} />
            </dl>

            <div className="mt-6 rounded-xl border border-white/10 bg-black/40 p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-bone-faint">Usage</p>
              <pre className="mt-2 overflow-x-auto font-mono text-[12px] leading-relaxed text-accent/90">
                <code>{skill.usage}</code>
              </pre>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
