# Motion System

An internal motion-design system for Digitatex. Not a website — a library of
**41 documented, reusable animation and visual-effect skills**, a registry that
describes them, and a showcase that demonstrates every one.

It was extracted from a landing-page specification. Nothing of that page's
branding, copy or commercial content was carried across; what was extracted is
behaviour — timing, layering, thresholds and fallbacks. Every skill traces back
to the fragment it came from in [`MOTION-SOURCE-MAP.md`](./MOTION-SOURCE-MAP.md).

```bash
npm install
npm run dev      # showcase at localhost:5173
npm run build    # type-check + production build
```

---

## The rule this system exists to enforce

Every skill declares four behaviours, and **none of them may be "the same
animation, smaller"**:

| | |
| --- | --- |
| Desktop | what it does with room and a pointer |
| Tablet | usually identical, sometimes toned down |
| **Mobile** | a decision — `identical`, `simplified`, `static` or `disabled` |
| **Reduced motion** | a separate decision, with content always preserved |

The registry refuses to describe a skill without them, and the showcase prints
them next to every demonstration. That is the whole point of the thing: a
developer looking at an effect can see, immediately, what it costs and what
happens to it on a phone.

---

## Architecture

```
src/
  motion/                 the library — no showcase code reaches in here
    core/                 types, one GSAP registration point
    accessibility/        useReducedMotion (live subscription, not a snapshot)
    utilities/            media queries, pointer capability, performance helpers
    presets/              easings, durations, Framer variants
    scroll/               reveal engine, parallax, sticky, horizontal, progress
    text/                 splitter + text reveal
    media/                HLS video, overlay, scroll-scrub video
    interactions/         magnetic, tilt, hover glow
    effects/              grain, glow, vignette, sweep, blur, border, particles
    transitions/          the five section transitions

  components/             the things a page actually imports
    motion/               Reveal, TextReveal, Marquee, Accordion, Cards, Bento…
    effects/              CinematicLoader, PageReveal
    sections/             CinematicHero, StickyStory, HorizontalScroll, ProductScroll

  showcase/               the demonstration site — depends on the library, never
    registry/             skills.ts — the single source of truth      the reverse
    sections/             ten showcase sections
    components/           SkillLabel, SkillInspector, section shell
```

---

## Using it in a new site

1. Copy `src/motion/` and `src/components/` into the project.
2. Copy the `@layer components` block from `src/index.css` — the CSS-only
   skills live there, and without it marquees, glass, glow and grain do nothing.
3. Compose. Nothing needs configuring first; every skill has working defaults.

```tsx
import { CinematicHero } from '@/components/sections/CinematicHero';
import { TextReveal } from '@/components/motion/TextReveal';
import { FadeUp } from '@/components/motion/Reveal';
import { MagneticButton } from '@/components/motion/MagneticButton';

export function Landing() {
  return (
    <CinematicHero media={{ sources: [{ src: '/hero.webm', type: 'video/webm' }] }}>
      <TextReveal as="h1" by="lines">We build the part people remember.</TextReveal>
      <FadeUp delay={0.35}>
        <MagneticButton>Start a project</MagneticButton>
      </FadeUp>
    </CinematicHero>
  );
}
```

Reach for the hooks (`useScrollReveal`, `useParallax`, `useMagnetic`, `useTilt`,
`useHoverGlow`, `useScrollProgress`, `useScrollScrubVideo`) when a component
does not fit the shape you need. Everything above is built from them.

---

## FINAL REPORT

**41 skills · 11 categories**

| Category | Skills |
| --- | --- |
| Load & Transitions | 2 |
| Hero & Cinematic | 4 |
| Text Motion | 6 |
| Scroll Motion | 5 |
| Product Experience | 1 |
| Cards & Bento | 5 |
| Microinteractions | 5 |
| Marquee | 1 |
| UI Motion | 1 |
| Section Transitions | 5 |
| Atmosphere | 6 |

### By technology

**GSAP / ScrollTrigger (23)** — everything tied to scroll position, plus the
cursor-tracked transforms: `cinematic-loader`, `page-reveal`, `text-reveal`,
`split-text-reveal`, `fade-up`, `fade-scale`, `stagger-reveal`, `clip-reveal`,
`scroll-reveal-engine`, `parallax`, `sticky-story`, `horizontal-scroll`,
`scroll-scrub-media`, `product-scroll`, `bento-grid-motion`, `magnetic-button`,
`magnetic-link`, `image-tilt`, and the five section transitions.

**Framer Motion (6)** — component state only: `card-hover-lift`, `card-scale`,
`image-zoom`, `button-scale`, `magnetic-button`, `animated-accordion`.

**CSS only (10)** — no JavaScript at runtime: `media-overlay`, `glass-card`,
`hover-glow`, `infinite-marquee`, `grain`, `radial-glow`, `vignette`,
`light-sweep`, `ambient-blur`, `gradient-border`.

**Canvas (4)** — `cinematic-hero`, `ambient-particles`, `scroll-scrub-media`,
`product-scroll`. **No WebGL anywhere.** A 2D context is enough for particles
and for one convex solid, and it starts instantly.

**hls.js (3)** — `cinematic-hero`, `background-video`, `product-scroll`.
Dynamically imported, so a page with no HLS source never downloads it.

`magnetic-button` appears twice on purpose: GSAP drives the translation and
Framer the scale. They write different transform channels, so they compose.
No single property is ever animated by both libraries.

### Disabled on mobile (7)

`parallax`, `card-hover-lift`, `card-scale`, `image-zoom`, `magnetic-button`,
`magnetic-link`, `image-tilt` — every one because it depends on a cursor that
does not exist, or on a scroll length that a phone does not have.

### Performance-heavy (6)

`background-video`, `scroll-scrub-media`, `product-scroll`, `blur-transition`,
`cinematic-section-transition`, `ambient-blur`.

Medium (5): `cinematic-hero`, `ambient-particles`, `sticky-story`,
`horizontal-scroll`, `glass-card`.

Everything else is transform and opacity, which the compositor handles for free.

### What to reach for, by project type

| Project | Skills that earn their place |
| --- | --- |
| **Agency landing page** | `cinematic-loader`, `cinematic-hero`, `text-reveal`, `infinite-marquee`, `magnetic-button`, `bento-grid-motion`, `radial-glow`, `grain` |
| **SaaS site** | `fade-up`, `stagger-reveal`, `animated-accordion`, `glass-card`, `card-hover-lift`, `button-scale` — and almost nothing else. Restraint reads as confidence. |
| **Product site** | `product-scroll`, `scroll-scrub-media`, `sticky-story`, `clip-reveal`, `vignette`, `gradient-border` |
| **Portfolio** | `horizontal-scroll`, `image-zoom`, `image-tilt`, `parallax`, `light-sweep`, `cinematic-section-transition` |
| **E-commerce** | `image-zoom`, `card-hover-lift`, `stagger-reveal`, `animated-accordion`, `glass-card`. Skip the loader — it stands between a shopper and a purchase. |
| **3D / product storytelling** | `product-scroll` with a `sequence` or `canvas` source, `scroll-scrub-media`, `sticky-story`, `ambient-particles`, `radial-glow` |

---

## Three things that cost a debugging pass, written down so they do not again

**A transform on an ancestor breaks every pin inside it.** `PageReveal` animates
`y` on the page wrapper, and GSAP leaves the transform in place when a tween
finishes. A transformed element becomes the containing block for every
`position: fixed` descendant — which is how ScrollTrigger implements `pin`. The
Product Scroll section rendered as a black screen while its progress value
ticked up perfectly. `clearProps` on completion, then `ScrollTrigger.refresh()`.

**`overflow-x: hidden` on `body` breaks every sticky descendant.** It makes
`body` a scroll container, so `position: sticky` sticks to it rather than to the
viewport. `overflow-x: clip` prevents the horizontal scrollbar without creating
a scroll port.

**Reading `sessionStorage` throws in a sandboxed iframe.** Not writing —
*reading*. Without `allow-same-origin` the document has an opaque origin and no
storage bucket, so the property access itself raises a SecurityError. Thrown
from a React effect it unmounts the entire tree, and the visitor gets a black
page with nothing to explain it. That is how this showcase first arrived when it
was handed over as a file, viewed inside a chat panel.

Everything storage-related now goes through `safeStorage`, and the loader — the
one component guaranteed to be in front of everything else — wraps its whole
effect in a try/catch plus a timer that uncovers the page regardless. A failure
in a loader is not a missing effect; it is a blank site.

---

## Documentation

- [`MOTION-SOURCE-MAP.md`](./MOTION-SOURCE-MAP.md) — every skill traced to its
  reference fragment
- [`docs/README.md`](./docs/README.md) — index of all 41 skill pages
- `docs/skills/<id>.md` — one page per skill

Both are generated from the registry:

```bash
node --experimental-strip-types scripts/generate-docs.mjs
```

Documentation maintained separately from the thing it documents is
documentation that is wrong within a month. Edit `src/showcase/registry/skills.ts`
and regenerate.
