import { SkillLabel } from '../components/SkillLabel';
import { skillsById } from '../registry/skills';
import { ProductScroll } from '@/components/sections/ProductScroll';
import { renderProduct } from '../data/productRenderer';
import { productChapters, productHotspots } from '../data/content';
import { TextReveal } from '@/components/motion/TextReveal';

/** The mobile and reduced-motion layout: stacked, readable, still annotated. */
function Fallback() {
  return (
    <div className="mx-auto max-w-6xl space-y-10 px-6">
      {productChapters.map((c) => (
        <div key={c.title} className="space-y-3">
          {c.eyebrow && <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">{c.eyebrow}</p>}
          <h3 className="whitespace-pre-line font-display text-3xl leading-tight text-bone">{c.title}</h3>
          <p className="text-[15px] leading-relaxed text-bone-dim">{c.body}</p>
        </div>
      ))}
    </div>
  );
}

export function S04Product({ onInspect }: { onInspect: (id: string) => void }) {
  return (
    <section id="s04" className="relative border-t border-white/[0.07] py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex items-baseline gap-4">
          <span className="font-mono text-[11px] tracking-[0.2em] text-accent">04</span>
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-bone-faint">Experiencia de producto</span>
        </div>
        <TextReveal as="h2" by="lines" className="mt-5 max-w-3xl font-display text-4xl leading-[1.05] text-bone md:text-6xl">
          Un producto que responde al scroll.
        </TextReveal>
        <div className="mt-8 max-w-sm">
          <SkillLabel skill={skillsById['product-scroll']!} onInspect={onInspect} />
        </div>
      </div>

      <div className="mt-16">
        <ProductScroll
          source={{ type: 'canvas', render: renderProduct }}
          chapters={productChapters}
          hotspots={productHotspots}
          length={4}
          fallback={<Fallback />}
        />
      </div>
    </section>
  );
}
