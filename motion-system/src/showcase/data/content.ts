import type { AccordionItem } from '@/components/motion/Accordion';
import type { ProductChapter, ProductHotspot } from '@/components/sections/ProductScroll';

export const productChapters: ProductChapter[] = [
  {
    at: 0,
    eyebrow: '01 — Source',
    title: 'One stage.\nThree sources.',
    body: 'Video, image sequence or a canvas renderer. Everything downstream reads the same progress value, so swapping the source changes one prop and nothing else.',
  },
  {
    at: 0.34,
    eyebrow: '02 — Sequence',
    title: 'Scroll is\nthe timeline.',
    body: 'The visitor sets the pace. Nothing plays on its own, nothing has to be waited out, and the same gesture that reads the page drives the object.',
  },
  {
    at: 0.66,
    eyebrow: '03 — Annotation',
    title: 'Detail arrives\nwhen it is earned.',
    body: 'Hotspots appear inside a progress window and leave again, so a specification lands at the moment the object is showing the thing it describes.',
  },
];

export const productHotspots: ProductHotspot[] = [
  { from: 0.4, to: 0.72, x: 22, y: 30, label: 'Canvas source', detail: 'No asset. Eight vertices and one light vector.' },
  { from: 0.56, to: 0.9, x: 28, y: 62, label: 'Contact shadow', detail: 'Grounds the object instead of floating it.' },
  { from: 0.76, to: 1, x: 18, y: 44, label: 'Rim light', detail: 'Arrives last, once the shape has been read.' },
];

export const faqItems: AccordionItem[] = [
  {
    id: 'when',
    question: 'When should a section not animate?',
    answer:
      'When the content is the reason someone came. Pricing, specifications, contact details and error states should be present on arrival. Motion is for the parts of a page that reward exploration, not for the parts that answer a question.',
  },
  {
    id: 'both',
    question: 'Why two animation libraries?',
    answer:
      'They do different jobs. GSAP owns anything tied to scroll position — timelines, pinning, scrubbing — because ScrollTrigger has no real equivalent. Framer Motion owns component state, where declarative variants and AnimatePresence are far less code than the imperative alternative. The rule is that no single property is ever animated by both.',
  },
  {
    id: 'reduced',
    question: 'What does reduced motion actually change?',
    answer:
      'Every skill declares its own fallback, and none of them is the same animation played faster. Parallax and particles stop existing. Text reveals stop splitting, which also leaves the accessibility tree untouched. Marquees become scrollable strips. Pinned sections become stacked ones. Content is never hidden behind an animation that no longer runs.',
  },
  {
    id: 'budget',
    question: 'What does all this cost?',
    answer:
      'Most of it is free: transform and opacity are composited. The expensive ones are named in the registry — backdrop-filter, filter: blur, scrubbed video and particle canvases. Each carries a performance rating, so the cost is a decision at the point of use rather than a discovery at the end of the project.',
  },
];

export const marqueeStatements = [
  'MOTION AS HIERARCHY',
  'NOT EVERYTHING SHOULD ANIMATE',
  'ACCESSIBILITY OVERRIDES EFFECT',
  'SCROLL REWARDS EXPLORATION',
  'MEASURE, DO NOT GUESS',
];

export const plates = ['media/plate-a.jpg', 'media/plate-b.jpg', 'media/plate-c.jpg', 'media/plate-d.jpg'];
