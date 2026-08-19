import { ShowcaseSection, Demo } from '../components/Section';
import { SkillLabel } from '../components/SkillLabel';
import { skillsById } from '../registry/skills';
import { useParallax } from '@/motion/scroll/useParallax';
import { useScrollScrubVideo } from '@/motion/media/useScrollScrubVideo';
import { StickyStory } from '@/components/sections/StickyStory';
import { HorizontalScrollSection } from '@/components/sections/HorizontalScrollSection';
import { plates } from '../data/content';

function ParallaxDemo() {
  const back = useParallax<HTMLDivElement>({ speed: 0.34 });
  const front = useParallax<HTMLDivElement>({ speed: -0.16 });
  return (
    <div className="relative h-[320px] overflow-hidden">
      <div ref={back} className="absolute inset-[-20%]">
        <img src={plates[0]} alt="" className="h-full w-full object-cover opacity-70" />
      </div>
      <div ref={front} className="absolute inset-0 flex items-center justify-center">
        <div className="rounded-2xl border border-white/15 bg-ink/70 px-8 py-6 backdrop-blur-md">
          <p className="font-display text-2xl text-bone">Two speeds</p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-bone-faint">0.34 back · −0.16 front</p>
        </div>
      </div>
    </div>
  );
}

function ScrubDemo() {
  const { containerRef, videoRef, ready } = useScrollScrubVideo();
  return (
    <div ref={containerRef} className="relative h-[320px]">
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        poster="media/atmosphere-poster.jpg"
      >
        <source src="media/atmosphere.webm" type="video/webm" />
        <source src="media/atmosphere.mp4" type="video/mp4" />
      </video>
      <div className="absolute bottom-4 left-4 rounded-lg border border-white/10 bg-ink/80 px-3 py-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
          {ready ? 'seeking on scroll' : 'buffering'}
        </p>
      </div>
    </div>
  );
}

const chapters = [
  {
    id: 'pin',
    eyebrow: '01 — Pin',
    title: 'The section holds still.',
    body: 'Scrolling stops moving the page and starts moving the content inside it. The visitor keeps the same gesture; the meaning of it changes.',
    visual: <img src={plates[0]} alt="" className="h-full w-full object-cover" />,
  },
  {
    id: 'progress',
    eyebrow: '02 — Progress',
    title: 'One value drives everything.',
    body: 'Text, image and the rail below all read the same number. Nothing is duplicated, so nothing can drift out of sync.',
    visual: <img src={plates[1]} alt="" className="h-full w-full object-cover" />,
  },
  {
    id: 'release',
    eyebrow: '03 — Release',
    title: 'And then it lets go.',
    body: 'On a phone none of this happens. The chapters simply stack, because pinning fights the URL bar and a stuttering pin reads as a broken page.',
    visual: <img src={plates[2]} alt="" className="h-full w-full object-cover" />,
  },
];

export function S03Scroll({ onInspect }: { onInspect: (id: string) => void }) {
  return (
    <>
      <ShowcaseSection
        id="s03"
        index="03"
        eyebrow="Scroll Motion"
        title="Scroll as an instrument."
        intro="The five skills that treat scroll position as an input rather than a way to get to the bottom of the page. This section is deliberately long: these effects cannot be judged in a thumbnail."
      >
        <div className="space-y-5">
          <Demo label={<SkillLabel skill={skillsById['scroll-reveal-engine']!} onInspect={onInspect} />} stageClassName="flex items-center p-8 md:p-12">
            <p className="text-[15px] leading-relaxed text-bone-dim">
              Every reveal on this page went through one hook. It owns the trigger, the cleanup, the initial state and the
              reduced-motion branch, which is why none of the forty other skills has to think about any of them.
            </p>
          </Demo>

          <Demo label={<SkillLabel skill={skillsById['parallax']!} onInspect={onInspect} />} stageClassName="p-0">
            <ParallaxDemo />
          </Demo>

          <Demo label={<SkillLabel skill={skillsById['scroll-scrub-media']!} onInspect={onInspect} />} stageClassName="p-0">
            <ScrubDemo />
          </Demo>
        </div>
      </ShowcaseSection>

      <section className="relative border-t border-white/[0.07] py-20">
        <div className="mx-auto mb-10 max-w-6xl px-6">
          <SkillLabel skill={skillsById['sticky-story']!} onInspect={onInspect} compact />
        </div>
        <StickyStory chapters={chapters} />
      </section>

      <section className="relative border-t border-white/[0.07] py-20">
        <div className="mx-auto mb-10 max-w-6xl px-6">
          <SkillLabel skill={skillsById['horizontal-scroll']!} onInspect={onInspect} compact />
        </div>
        <HorizontalScrollSection className="px-6">
          {plates.concat(plates).map((src, i) => (
            <figure key={i} className="w-[74vw] shrink-0 snap-center overflow-hidden rounded-2xl border border-white/10 md:w-[38vw]">
              <img src={src} alt="" className="aspect-[4/3] w-full object-cover" />
              <figcaption className="flex items-center justify-between p-4">
                <span className="font-display text-lg text-bone">Frame {String(i + 1).padStart(2, '0')}</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-bone-faint">horizontal-scroll</span>
              </figcaption>
            </figure>
          ))}
        </HorizontalScrollSection>
      </section>
    </>
  );
}
