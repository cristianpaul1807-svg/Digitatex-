import { gsap, ScrollTrigger } from '@/motion/core/gsap';
import { prefersReducedMotion } from '@/motion/accessibility/useReducedMotion';
import { dibujarViaje } from './objeto';
import './tokens.css';
import './viaje.css';

/**
 * OBJETO EN VIAJE — la skill nueva.
 *
 * La diferencia con `product-scroll` no es de grado, es de idea.
 *
 * `product-scroll` ancla una sección y mete al producto dentro: el producto
 * vive en ese hueco, y cuando la sección termina, desaparece. Es la solución
 * segura, la que se ve en el 90% de las webs de producto.
 *
 * Esto es lo otro: un lienzo fijo detrás de TODA la página, con el objeto
 * dibujado encima, y un único valor de avance que va del primer píxel al
 * último del documento. El objeto no pertenece a ninguna sección — las
 * atraviesa. Se monta mientras lees el manifiesto, se cierra mientras lees el
 * proceso, se envuelve mientras lees la garantía y aterriza en el cierre.
 *
 * El contenido pasa por delante; el objeto vive detrás. Esa es toda la
 * arquitectura, y es lo que hace que la página se lea como una sola escena en
 * vez de como una lista de secciones.
 *
 * Coste: un canvas del tamaño de la ventana y un dibujado por fotograma solo
 * mientras se hace scroll. En reposo no se dibuja nada.
 */

const lienzo = document.getElementById('escena') as HTMLCanvasElement | null;
const ctx = lienzo?.getContext('2d') ?? null;
const reducido = prefersReducedMotion();

/* ── el lienzo ─────────────────────────────────────────────────────────── */

let ancho = 0;
let alto = 0;

function medir() {
  if (!lienzo || !ctx) return;
  // Tope de 2 en la densidad de píxel: por encima, el coste de relleno es real
  // y la diferencia visible no.
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  ancho = window.innerWidth;
  alto = window.innerHeight;
  lienzo.width = Math.round(ancho * dpr);
  lienzo.height = Math.round(alto * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

let avance = 0;
let pedido = 0;

function pintar() {
  pedido = 0;
  if (!ctx) return;
  ctx.clearRect(0, 0, ancho, alto);
  dibujarViaje(ctx, { w: ancho, h: alto, t: avance, movil: ancho < 900 });
}

function programar() {
  if (!pedido) pedido = requestAnimationFrame(pintar);
}

/* ── el avance, de la primera a la última línea del documento ──────────── */

function iniciarViaje() {
  if (!lienzo || !ctx) return;
  medir();

  if (reducido) {
    // Movimiento reducido: la caja se dibuja una vez, terminada y envuelta.
    // El objeto sigue estando — lo que se quita es el viaje, no el producto.
    avance = 0.82;
    pintar();
    return;
  }

  ScrollTrigger.create({
    trigger: document.documentElement,
    start: 'top top',
    end: 'bottom bottom',
    scrub: true,
    invalidateOnRefresh: true,
    onUpdate: (self) => {
      avance = self.progress;
      programar();
    },
  });

  window.addEventListener('resize', () => {
    medir();
    programar();
  });

  pintar();
}

/* ── entradas del texto ────────────────────────────────────────────────── */

function iniciarTexto() {
  if (reducido) {
    gsap.set('[data-sube], [data-linea]', { opacity: 1, y: 0 });
    return;
  }

  // Los titulares de cartel entran por líneas desde detrás de una máscara. Se
  // parten aquí, a mano, en vez de con una librería: son cuatro líneas por
  // titular y no compensa cargar nada.
  document.querySelectorAll<HTMLElement>('[data-cartel]').forEach((el) => {
    const lineas = (el.textContent ?? '').split('\n').map((l) => l.trim()).filter(Boolean);
    el.setAttribute('aria-label', lineas.join(' '));
    el.textContent = '';
    for (const l of lineas) {
      const mascara = document.createElement('span');
      mascara.className = 'mascara';
      mascara.setAttribute('aria-hidden', 'true');
      const dentro = document.createElement('span');
      dentro.className = 'dentro';
      dentro.setAttribute('data-linea', '');
      dentro.textContent = l;
      mascara.appendChild(dentro);
      el.appendChild(mascara);
    }
  });

  document.querySelectorAll<HTMLElement>('[data-cartel]').forEach((el) => {
    gsap.fromTo(
      el.querySelectorAll('[data-linea]'),
      { yPercent: 108 },
      {
        yPercent: 0,
        duration: 1.05,
        ease: 'power3.out',
        stagger: 0.09,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      },
    );
  });

  gsap.utils.toArray<HTMLElement>('[data-sube]').forEach((el) => {
    gsap.fromTo(
      el,
      { opacity: 0, y: 26 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      },
    );
  });
}

/* ── el capítulo actual, en el riel lateral ────────────────────────────── */

function iniciarRiel() {
  const riel = document.getElementById('riel');
  if (!riel) return;
  const puntos = Array.from(riel.querySelectorAll<HTMLElement>('[data-punto]'));
  const secciones = puntos
    .map((p) => document.getElementById(p.dataset.punto!))
    .filter((s): s is HTMLElement => !!s);

  secciones.forEach((sec, i) => {
    ScrollTrigger.create({
      trigger: sec,
      start: 'top 55%',
      end: 'bottom 55%',
      onToggle: (self) => {
        if (!self.isActive) return;
        puntos.forEach((p, k) => p.classList.toggle('activo', k === i));
      },
    });
  });
}

/* ── arranque ──────────────────────────────────────────────────────────── */

function arrancar() {
  iniciarViaje();
  iniciarTexto();
  iniciarRiel();
  // Las tipografías cambian la altura del documento, y la altura del documento
  // es el denominador de todo el viaje. Sin esto, el objeto llega al final del
  // recorrido antes que el lector.
  if (document.fonts) document.fonts.ready.then(() => ScrollTrigger.refresh());
  document.documentElement.classList.add('listo');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', arrancar);
} else {
  arrancar();
}
