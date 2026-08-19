import { gsap } from './gsap';

/**
 * Watchdog: content must never stay invisible because an animation did not run.
 *
 * Every reveal in this system works by hiding an element and then bringing it
 * back. That is fine while the frame loop is alive. It is a blank page when it
 * is not — and there are real environments where it is not: an iframe that a
 * host renders offscreen or with `visibility: hidden` never gets a
 * `requestAnimationFrame` callback, so GSAP's ticker never advances, every
 * `gsap.set(..., { opacity: 0 })` stands, and the visitor scrolls a very tall
 * document with nothing in it.
 *
 * That is exactly how this showcase looked the first time it was opened in a
 * mobile chat panel: laid out to its full 34,000px, scrollbar and all,
 * completely black.
 *
 * The check is precise rather than blunt. `gsap.ticker.frame` counts frames the
 * library has actually processed; if it has moved, animations are running and
 * this does nothing at all. Only a genuinely dead loop triggers the sweep,
 * which clears the inline properties the system uses to hide things.
 *
 * Principle 9 of the system says never hide important content behind animation.
 * This is what makes that true rather than aspirational.
 */
export function installMotionFailsafe(delayMs = 3500) {
  if (typeof window === 'undefined') return () => {};

  const startFrame = gsap.ticker.frame;

  const timer = window.setTimeout(() => {
    // Cinco fotogramas es margen de sobra: a 60Hz son 83ms, y aqui han pasado
    // tres segundos y medio. Si no ha avanzado, el bucle esta muerto.
    if (gsap.ticker.frame > startFrame + 5) return;

    const clear = (el: HTMLElement) => {
      el.style.removeProperty('opacity');
      el.style.removeProperty('transform');
      el.style.removeProperty('clip-path');
      el.style.removeProperty('visibility');
    };

    document.querySelectorAll<HTMLElement>('[style]').forEach((el) => {
      const s = el.style;
      const hidden = s.opacity !== '' && parseFloat(s.opacity) < 0.05;
      const clipped = s.clipPath.includes('100%') || s.clipPath.includes('50%');
      if (hidden || clipped) clear(el);
    });

    // Los titulares partidos son un caso aparte: sus lineas van a opacidad 1 y
    // desplazadas un 110% fuera de una mascara con overflow:hidden, asi que el
    // barrido de arriba no las ve. Sin esto el texto sigue existiendo en el DOM
    // — con su aria-label intacto — pero no se ve una sola letra.
    document.querySelectorAll<HTMLElement>('.split-line-inner, .split-word, .split-char').forEach(clear);

    // Y el propio velo del loader, que tampoco habra podido desvanecerse.
    //
    // Se OCULTA, no se elimina. Ese nodo lo gestiona React: sacarlo del DOM a
    // mano hace que React falle al desmontarlo mas tarde con un
    // "removeChild: the node to be removed is not a child of this node", y ese
    // error desmonta el arbol entero. La red de seguridad acababa causando
    // exactamente el fallo que venia a evitar.
    document.querySelectorAll<HTMLElement>('[aria-label="Loading"]').forEach((el) => {
      el.style.display = 'none';
    });
    document.documentElement.style.overflow = '';
    document.documentElement.setAttribute('data-motion-failsafe', 'fired');
  }, delayMs);

  return () => window.clearTimeout(timer);
}
