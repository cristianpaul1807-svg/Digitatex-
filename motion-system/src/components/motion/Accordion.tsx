import { useId, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useReducedMotion } from '@/motion/accessibility/useReducedMotion';
import { accordionPanel, reducedVariants } from '@/motion/presets/variants';

export interface AccordionItem {
  id: string;
  question: ReactNode;
  answer: ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  /** 'single' closes the previous panel; 'multiple' allows several open. */
  mode?: 'single' | 'multiple';
  defaultOpen?: string[];
  className?: string;
}

/**
 * I01 — Animated Accordion.
 *
 * Reference: "FAQ accordion", "Smooth height + opacity transition (300ms
 * ease-out)". Framer Motion rather than GSAP: this is component state, not
 * scroll.
 *
 * The accessibility is the actual work here, and it is what most accordions get
 * wrong. Real `<button>` elements, so Enter and Space work with no keydown
 * handler. `aria-expanded` and `aria-controls`, so the state is announced
 * rather than just the heading read. `role="region"` labelled back to its
 * trigger. And the panel unmounts when closed, so its content leaves the tab
 * order entirely — a `height: 0` panel with live links inside is a keyboard
 * trap that sighted testing never finds.
 */
export function Accordion({ items, mode = 'single', defaultOpen = [], className = '' }: AccordionProps) {
  const [open, setOpen] = useState<string[]>(defaultOpen);
  const baseId = useId();
  const reduced = useReducedMotion();
  const variants = reduced ? reducedVariants : accordionPanel;

  const toggle = (id: string) =>
    setOpen((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : mode === 'single' ? [id] : [...prev, id],
    );

  return (
    <div className={`divide-y divide-white/10 border-y border-white/10 ${className}`}>
      {items.map((item) => {
        const isOpen = open.includes(item.id);
        const triggerId = `${baseId}-${item.id}-trigger`;
        const panelId = `${baseId}-${item.id}-panel`;
        return (
          <div key={item.id}>
            <button
              id={triggerId}
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => toggle(item.id)}
              className="flex w-full items-center justify-between gap-6 py-6 text-left transition-colors duration-200 hover:text-accent"
            >
              <span className="font-display text-lg text-bone md:text-xl">{item.question}</span>
              <span
                aria-hidden="true"
                className={`shrink-0 text-2xl leading-none text-bone-dim transition-transform duration-300 ease-entrance ${isOpen ? 'rotate-45' : ''}`}
              >
                +
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="panel"
                  id={panelId}
                  role="region"
                  aria-labelledby={triggerId}
                  variants={variants}
                  initial="collapsed"
                  animate="open"
                  exit="collapsed"
                  className="overflow-hidden"
                >
                  <div className="pb-6 pr-10 text-[15px] leading-relaxed text-bone-dim">{item.answer}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
