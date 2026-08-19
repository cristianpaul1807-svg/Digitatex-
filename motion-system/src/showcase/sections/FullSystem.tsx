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
  { t: 'Webs de marca', d: 'Heros cinematográficos, ritmo editorial, un solo momento de autor.' },
  { t: 'Relatos de producto', d: 'Escenarios movidos por el scroll, con anotaciones y texto sincronizado.' },
  { t: 'Páginas de campaña', d: 'Rápidas de montar, ruidosas donde importa y calladas en todo lo demás.' },
  { t: 'Sistemas de diseño', d: 'La capa de movimiento, documentada y reutilizable en toda la cartera.' },
];

const chapters = [
  {
    id: 'brief',
    eyebrow: '01 — El encargo',
    title: 'Empieza por el relato.',
    body: 'Las decisiones de movimiento van al final. ¿Qué partes de la página premian explorar y cuáles solo tienen que responder una pregunta? Todo lo demás sale de ahí.',
    visual: <img src={plates[0]} alt="" className="h-full w-full object-cover" />,
  },
  {
    id: 'compose',
    eyebrow: '02 — Componer',
    title: 'Elige una jerarquía, no una lista.',
    body: 'Un solo momento cinematográfico por página. Todo lo que lo rodea se gana la atención en proporción a lo que merece, y casi nada merece mucha.',
    visual: <img src={plates[1]} alt="" className="h-full w-full object-cover" />,
  },
  {
    id: 'measure',
    eyebrow: '03 — Medir',
    title: 'Y luego míralo en un móvil.',
    body: 'Con la barra de direcciones puesta, con conexión lenta y con el movimiento reducido activado. Cada alternativa de este sistema existe porque esa comprobación falló una vez.',
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
          Diecisiete efectos, una página, y no debería notarse que son diecisiete.
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
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent">La web completa</span>
        <TextReveal as="h2" by="lines" className="mt-5 max-w-3xl font-display text-4xl leading-[1.05] text-bone md:text-6xl">
          Todo lo de arriba, funcionando junto.
        </TextReveal>
        <FadeUp delay={0.1}>
          <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-bone-dim">
            Una landing completa construida solo con la librería. Debajo hay diecisiete efectos corriendo. La contención es lo importante:
            un momento cinematográfico, un relato anclado, un parallax, y la entrada de siempre en todo lo demás.
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
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">Un estudio, hipotéticamente</p>
        <TextReveal as="p" by="lines" className="mt-6 font-display text-[clamp(2.4rem,7vw,5.5rem)] font-light leading-[0.98] text-bone">
          Construimos la parte que la gente recuerda.
        </TextReveal>
        <FadeUp delay={0.4}>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <MagneticButton>Empezar un proyecto</MagneticButton>
            <MagneticButton variant="ghost">Ver trabajos</MagneticButton>
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
              El movimiento no es adorno. Es la parte de la interfaz que te dice qué importa.
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
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">Caso {String(i + 1).padStart(2, '0')}</p>
                  <h4 className="mt-2 font-display text-xl text-bone">Un proyecto que no existe</h4>
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
              Preguntas que salen siempre.
            </TextReveal>
          </div>
          <Accordion items={faqItems} mode="single" />
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-white/10 py-28">
        <RadialGlow y="112%" size="80vw" intensity={1} animated />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <TextReveal as="h3" by="lines" className="font-display text-4xl leading-tight text-bone md:text-6xl">
            Y eso es todo el sistema.
          </TextReveal>
          <FadeUp delay={0.15}>
            <p className="mx-auto mt-6 max-w-xl text-[15px] leading-relaxed text-bone-dim">
              Cuarenta y un efectos, un solo registro, y una regla: cada uno tiene que declarar qué hace en un móvil y qué hace para
              alguien que ha pedido menos movimiento.
            </p>
          </FadeUp>
          <FadeUp delay={0.3}>
            <div className="mt-10 flex justify-center">
              <MagneticButton onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Volver arriba</MagneticButton>
            </div>
          </FadeUp>
        </div>
      </section>

      <footer className="border-t border-white/10 py-10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 font-mono text-[10px] uppercase tracking-[0.18em] text-bone-faint">
          <span>Digitatex · Sistema de Movimiento v1.0</span>
          <MagneticLink href="#s01" className="text-bone-faint">
            Volver al catálogo
          </MagneticLink>
        </div>
      </footer>
    </div>
  );
}
