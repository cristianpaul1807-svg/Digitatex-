/**
 * Shared vocabulary for the whole motion system.
 *
 * Every skill in the library speaks these types, which is what lets the
 * registry describe a skill the showcase has never seen before.
 */

export type MotionCategory =
  | 'load' | 'hero' | 'text' | 'scroll' | 'product' | 'cards'
  | 'interaction' | 'marquee' | 'ui' | 'transition' | 'atmosphere';

export type MotionTech = 'gsap' | 'scrolltrigger' | 'framer-motion' | 'css' | 'canvas' | 'hls.js' | 'react';

export type PerformanceCost = 'nulo' | 'bajo' | 'medio' | 'alto';
export type Difficulty = 'básico' | 'intermedio' | 'avanzado';

/** How a skill degrades. Never "the same but smaller" — always a decision. */
export type FallbackBehaviour = 'igual' | 'simplificado' | 'estático' | 'desactivado';

export interface SkillFallback {
  behaviour: FallbackBehaviour;
  note: string;
}

export interface MotionSkill {
  id: string;
  name: string;
  category: MotionCategory;
  description: string;
  /** Verbatim fragment of the reference brief this skill was extracted from. */
  sourceReference: string;
  difficulty: Difficulty;
  performanceCost: PerformanceCost;
  dependencies: MotionTech[];
  desktop: string;
  tablet: string;
  mobile: SkillFallback;
  reducedMotion: SkillFallback;
  recommendedUse: string[];
  /** Component or hook a developer imports to get this behaviour. */
  export: string;
  usage: string;
}

export type Axis = 'x' | 'y';
export type Direction = 'up' | 'down' | 'left' | 'right';

export interface ScrollWindow {
  /** ScrollTrigger `start`, e.g. "top 85%". */
  start?: string;
  /** ScrollTrigger `end`, e.g. "bottom 20%". */
  end?: string;
  /** true = tie progress to scroll position, number = smoothing in seconds. */
  scrub?: boolean | number;
  /** Play once and forget, instead of replaying on every re-entry. */
  once?: boolean;
}
