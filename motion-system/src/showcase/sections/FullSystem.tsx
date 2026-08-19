import { TextReveal } from '@/components/motion/TextReveal';
import { FadeUp, StaggerReveal } from '@/components/motion/Reveal';
import { MagneticButton, MagneticLink } from '@/components/motion/MagneticButton';
import { Marquee } from '@/components/motion/Marquee';
import { Accordion } from '@/components/motion/Accordion';
import { HoverCard, ZoomImage } from '@/components/motion/Cards';
import { BentoGrid } from '@/components/motion/BentoGrid';
import { SectionTransition } from '@/motion/transitions/SectionTransition';
import { CinematicHero } from '@/components/sections/CinematicHero';
import { StickyStory } from '@/components/sections/StickyStory';
import { RadialGlow } from '@/motion/effects/RadialGlow';
import { Grain } from '@/motion/effects/Grain';
import { useParallax } from '@/motion/scroll/useParallax';
import { faqItems, marqueeStatements, plates } from '../data/content';

const services = [
  { t: 'Brand sites', d: 'Cinematic heroes, editorial pacing, one signature moment.' },
  { t: 'Product stories', d: 'Scroll-driven stages with annotation and synchronised copy.' },
  { t: 'Campaign pages', d: 'Fast to build, loud where it matters, quiet everywhere else.' },
  { t: 'Design systems', d: 'The motion layer, documented and reusable across a portfolio.' },
];

const chapters = [
  {
    id: 'brief',
    eyebrow: '01 — Brief',
    title: 'Start from the story.',
    body: 'Motion decisions come last. Which parts of the page reward exploration, and which just need to answer a question? Everything else follows from that.',
    visual: <img src={plates[0]} alt="" className="h-full w-full object-cover" />,
  },
  {
    id: 'compose',
    eyebrow: '02 — Compose',
    title: 'Pick a hierarchy, not a list.',
    body: 'One cinematic moment per page. Everything around it earns attention in proportion to how much it deserves, and most of it deserves very little.',
    visual: <img src={plates[1]} alt="" className="h-full w-full object-cover" />,
  },
  {
    id: 'measure',
    eyebrow: '03 — Measure',
    title: 'Then check it on a phone.',
    body: 'With the address bar showing, on a slow connection, with reduced motion on. Every fallback in this system exists because that check failed once.',
    visual: <img src={plates[2]} alt="" className="h-full w-full object-cover" />,
  },
];

function ParallaxPlate() {
  const ref = useParallax<HTMLDivElement>({ speed: 0.28 });
  return (
    <div className="relative h-[420px] overflow-hidden rounded-3xl border border-white/10">
      <div ref={ref} className="absolute inset-[-18%]">
        <img src={plates[3]} alt="" className="h-full w-full object-cover opacity-80" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
      <div className="absolute bottom-8 left-8 right-8">
        <TextReveal as="p" by="lines" className="max-w-lg font-display text-3xl leading-tight text-bone md:text-4xl">
          Seventeen skills, one page, and it should not feel like seventeen.
        </TextReveal>
      </div>
    </div>
  );
}

/**
 * The FULL MOTION SYSTEM demo.
 *
 * Seventeen skills composed into one page. The restraint is the demonstration:
 * there is exactly one cinematic moment (the hero), one pinned narrative, one
 * parallax, and everything else is the quiet workhorse reveal. A page where
 * every section shouts is a page with no hierarchy, which is the failure this
 * whole system exists to prevent.
 */
export function FullSystem() {
  return (
    <div id="full-system" className="relative border-t border-white/[0.07]">
      <div className="mx-auto max-w-6xl px-6 pb-10 pt-24">
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent">Full Motion System</span>
        <TextReveal as="h2" by="lines" className="mt-5 max-w-3xl font-display text-4xl leading-[1.05] text-bone md:text-6xl">
          Everything above, working together.
        </TextReveal>
        <FadeUp delay={0.1}>
          <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-bone-dim">
            A complete landing page built only from the library. Seventeen skills are running below. The restraint is the point:
            one cinematic moment, one pinned narrative, one parallax, and the workhorse reveal everywhere else.
          </p>
        </FadeUp>
      </div>

      <CinematicHero
        media={{
          sources: [
            { src: 'media/atmosphere.webm', type: 'video/webm' },
            { src: 'media/atmosphere.mp4', type: 'video/mp4' },
          ],
          poster: 'media/atmosphere-poster.jpg',
        }}
        overlay={{ opacity: 0.66, gradient: 'to-bottom' }}
        height="svh"
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">A studio, hypothetically</p>
        <TextReveal as="p" by="lines" className="mt-6 font-display text-[clamp(2.4rem,7vw,5.5rem)] font-light leading-[0.98] text-bone">
          We build the part people remember.
        </TextReveal>
        <FadeUp delay={0.4}>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <MagneticButton>Start a project</MagneticButton>
            <MagneticButton variant="ghost">See the work</MagneticButton>
          </div>
        </FadeUp>
      </CinematicHero>

      <Marquee speed={34} className="border-y border-white/10 py-6">
        {marqueeStatements.map((s) => (
          <span key={s} className="flex items-center gap-10 font-mono text-[12px] uppercase tracking-[0.24em] text-bone-dim">
            {s}
            <span aria-hidden="true" className="text-accent">
              ·
            </span>
          </span>
        ))}
      </Marquee>

      <SectionTransition kind="cinematic">
        <section className="relative overflow-hidden py-28">
          <RadialGlow x="80%" y="0%" size="60vw" color="rgba(200,242,74,0.18)" />
          <Grain opacity={0.03} />
          <div className="relative mx-auto max-w-6xl px-6">
            <TextReveal as="h3" by="lines" className="max-w-3xl font-display text-3xl leading-tight text-bone md:text-5xl">
              Motion is not decoration. It is the part of the interface that tells you what matters.
            </TextReveal>
            <StaggerReveal stagger={0.08} className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/5 sm:grid-cols-2 lg:grid-cols-4">
              {services.map((s) => (
                <div key={s.t} className="bg-ink p-6">
                  <h4 className="font-display text-xl text-bone">{s.t}</h4>
                  <p className="mt-2 text-[13px] leading-relaxed text-bone-dim">{s.d}</p>
                </div>
              ))}
            </StaggerReveal>
          </div>
        </section>
      </SectionTransition>

      <StickyStory chapters={chapters} />

      <section className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <ParallaxPlate />
        </div>
      </section>

      <section className="py-8">
        <div className="mx-auto max-w-6xl px-6">
          <BentoGrid className="md:grid-cols-3">
            {plates.slice(0, 3).map((src, i) => (
              <HoverCard key={src} lift={6} className="flex flex-col">
                <ZoomImage src={src} className="aspect-[4/3] w-full" />
                <div className="p-5">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">Case {String(i + 1).padStart(2, '0')}</p>
                  <h4 className="mt-2 font-display text-xl text-bone">A project that does not exist</h4>
                </div>
              </HoverCard>
            ))}
          </BentoGrid>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <TextReveal as="h3" by="lines" className="font-display text-3xl leading-tight text-bone md:text-4xl">
              Questions that come up every time.
            </TextReveal>
          </div>
          <Accordion items={faqItems} mode="single" />
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-white/10 py-28">
        <RadialGlow y="112%" size="80vw" intensity={1} animated />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <TextReveal as="h3" by="lines" className="font-display text-4xl leading-tight text-bone md:text-6xl">
            That is the whole system.
          </TextReveal>
          <FadeUp delay={0.15}>
            <p className="mx-auto mt-6 max-w-xl text-[15px] leading-relaxed text-bone-dim">
              Forty-one skills, one registry, and a rule that every one of them has to declare what it does on a phone and for
              somebody who asked for less motion.
            </p>
          </FadeUp>
          <FadeUp delay={0.3}>
            <div className="mt-10 flex justify-center">
              <MagneticButton onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Back to the top</MagneticButton>
            </div>
          </FadeUp>
        </div>
      </section>

      <footer className="border-t border-white/10 py-10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 font-mono text-[10px] uppercase tracking-[0.18em] text-bone-faint">
          <span>Digitatex · Motion System v1.0</span>
          <MagneticLink href="#s01" className="text-bone-faint">
            Back to the library
          </MagneticLink>
        </div>
      </footer>
    </div>
  );
}
