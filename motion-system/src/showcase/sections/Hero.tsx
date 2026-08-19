import { CinematicHero } from '@/components/sections/CinematicHero';
import { TextReveal } from '@/components/motion/TextReveal';
import { FadeUp } from '@/components/motion/Reveal';
import { MagneticButton } from '@/components/motion/MagneticButton';

/** Every skill running in this hero, named. The showcase is a reference tool
    first and a landing page second. */
const ACTIVE = [
  'cinematic-hero', 'background-video', 'media-overlay', 'ambient-particles',
  'grain', 'radial-glow', 'vignette', 'text-reveal', 'magnetic-button',
];

const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

export function Hero() {
  return (
    <CinematicHero
      media={{
        // En la version de un solo archivo no hay manifiesto que servir: todo
        // esta incrustado. Safari reproduce HLS de forma nativa y se quedaria
        // con un src roto, asi que ahi se omite y tiran las fuentes progresivas.
        hls: __SINGLE_FILE__ ? undefined : 'media/hls/index.m3u8',
        sources: [
          { src: 'media/atmosphere.webm', type: 'video/webm' },
          { src: 'media/atmosphere.mp4', type: 'video/mp4' },
        ],
        poster: 'media/atmosphere-poster.jpg',
      }}
      overlay={{ opacity: 0.62, gradient: 'to-bottom' }}
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">Digitatex · Uso interno</p>

      <TextReveal as="h1" by="lines" className="mt-7 font-display text-[clamp(3rem,9vw,7.5rem)] font-light leading-[0.95] tracking-tight text-bone">
        Sistema de Movimiento
      </TextReveal>

      <FadeUp delay={0.35}>
        <p className="mx-auto mt-7 max-w-xl text-balance text-[17px] leading-relaxed text-bone-dim">
          Animación y efectos visuales reutilizables, para webs que se recuerdan.
        </p>
      </FadeUp>

      <FadeUp delay={0.5}>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <MagneticButton onClick={() => go('s01')}>Ver los efectos</MagneticButton>
          <MagneticButton variant="ghost" onClick={() => go('full-system')}>
            La web completa
          </MagneticButton>
        </div>
      </FadeUp>

      <FadeUp delay={0.7}>
        <div className="mx-auto mt-14 flex max-w-3xl flex-wrap items-center justify-center gap-1.5">
          {ACTIVE.map((id) => (
            <code key={id} className="rounded border border-white/10 bg-ink/50 px-2 py-1 font-mono text-[9.5px] uppercase tracking-wider text-bone-dim backdrop-blur-sm">
              {id}
            </code>
          ))}
        </div>
      </FadeUp>
    </CinematicHero>
  );
}
