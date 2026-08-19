import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../accessibility/useReducedMotion';
import { useIsMobile } from '../utilities/useMediaQuery';

export interface DustParticlesProps {
  /** Particle count at desktop. Mobile uses a third. */
  count?: number;
  color?: string;
  size?: number;
  speed?: number;
  opacity?: number;
  /** Render nothing at all on phones instead of a reduced count. */
  disableOnMobile?: boolean;
  className?: string;
}

/**
 * B04 — Dust / Ambient Particles.
 *
 * Reference: "Subtle dust particle layer on top".
 *
 * Canvas, not DOM. Sixty absolutely-positioned divs animating transforms is
 * sixty composited layers and a style recalculation per frame; one canvas is
 * one layer and one draw call's worth of work. On a mid-range phone that
 * difference is the whole frame budget.
 *
 * The loop stops entirely when the layer scrolls out of view — an invisible
 * canvas repainting sixty sprites is the kind of cost that never shows up in a
 * profile taken at the top of the page.
 */
export function DustParticles({
  count = 46,
  color = 'rgba(242,239,233,0.55)',
  size = 1.8,
  speed = 0.16,
  opacity = 0.5,
  disableOnMobile = false,
  className = '',
}: DustParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();
  const off = reduced || (isMobile && disableOnMobile);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || off) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const n = isMobile ? Math.round(count / 3) : count;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const particles = Array.from({ length: n }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * size + 0.3,
      vx: (Math.random() - 0.5) * speed,
      vy: -(Math.random() * speed + speed * 0.3),
      a: Math.random() * 0.6 + 0.25,
      // Each mote breathes at its own rate; otherwise the field pulses as one
      // and stops reading as dust.
      phase: Math.random() * Math.PI * 2,
      pulse: 0.4 + Math.random() * 0.9,
    }));

    let raf = 0;
    let running = true;
    let t = 0;

    const draw = () => {
      if (!running) return;
      t += 0.016;
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -8) {
          p.y = h + 8;
          p.x = Math.random() * w;
        }
        if (p.x < -8) p.x = w + 8;
        if (p.x > w + 8) p.x = -8;
        ctx.globalAlpha = p.a * (0.6 + 0.4 * Math.sin(t * p.pulse + p.phase));
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };
    draw();

    const io = new IntersectionObserver(([entry]) => {
      if (!entry) return;
      if (entry.isIntersecting && !running) {
        running = true;
        draw();
      } else if (!entry.isIntersecting) {
        running = false;
        cancelAnimationFrame(raf);
      }
    });
    io.observe(canvas);
    window.addEventListener('resize', resize);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, [count, color, size, speed, off, isMobile]);

  if (off) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-[2] h-full w-full ${className}`}
      style={{ opacity }}
    />
  );
}
