import { gsap, ScrollTrigger } from '@/motion/core/gsap';
import { prefersReducedMotion } from '@/motion/accessibility/useReducedMotion';
import { leerScheda } from './scheda';
import { dibujarCotas, rellenarLeyenda } from './cotas';
import { cargarSecuencia } from './secuencia';
import './fuentes.css';
import './tokens.css';
import './viaje.css';

/**
 * Carpeta de la secuencia.
 *
 * `import.meta.env.BASE_URL` y no una ruta absoluta: la página se publica en
 * /motion/, así que "/fidenza/..." apuntaría a la raíz del dominio. Vite
 * reescribe las rutas de los atributos del HTML, pero no las cadenas que se
 * construyen en JavaScript — eso hay que hacerlo a mano.
 */
const URL_SECUENCIA = `${import.meta.env.BASE_URL}fidenza/montaggio`.replace(/\/{2,}/g, '/');

/**
 * Fidenza — página de cartel.
 *
 * Lo que cambió respecto a la primera versión, y por qué:
 *
 * Antes había un objeto 3D dibujado a mano con rectángulos planos sobre un
 * campo casi negro. Era una demostración técnica, no un diseño. Ninguna
 * animación arregla un producto que parece un marcador de posición.
 *
 * Ahora el producto es el render real del cliente, recortado sobre
 * transparencia. En el cartel de arriba está quieto; en el montaje son 42
 * fotogramas recortados uno a uno, así que la caja se arma ENCIMA de la
 * página, con las secciones pasando por detrás, y acaba aterrizando sobre una
 * línea de suelo con su plano acotado alrededor.
 *
 * Las medidas, los materiales y la lista de piezas no están escritos aquí:
 * salen de scheda.ts, que es el fichero que el panel del cliente va a editar.
 */

const reducido = prefersReducedMotion();

/* ── el montaje, recorrido por scroll ──────────────────────────────────── */

/** Fotogramas de la secuencia. Los genera scripts/secuencia-montaje.mjs. */
const TOTAL = 42;

/**
 * El montaje: la caja se arma sola en el centro mientras la página le pasa por
 * detrás, y al final aterriza y se dibuja el plano alrededor.
 *
 * El reparto del recorrido, y por qué así:
 *
 *   0.00 – 0.62   se monta. Ocupa casi dos tercios porque es lo que hay que
 *                 mirar; el resto son consecuencias.
 *   0.00 – 0.72   baja. Sigue bajando un poco después de montarse, para que el
 *                 aterrizaje no coincida con el último tornillo.
 *   0.72 – 0.80   toca suelo: se para, aparece la sombra, y da un rebote
 *                 mínimo. El rebote es lo que convierte "se detuvo" en "cayó".
 *   0.80 – 1.00   se dibuja el plano y entra la ficha.
 */
function iniciarMontaje() {
  const seccion = document.getElementById('montaggio');
  const escena = document.querySelector<HTMLElement>('[data-escena]');
  const hueco = document.querySelector<HTMLElement>('[data-lienzo]');
  const sombra = document.querySelector<HTMLElement>('[data-sombra]');
  const planoRaiz = document.querySelector<HTMLElement>('[data-plano]');
  const ficha = document.querySelector<HTMLElement>('[data-ficha]');
  if (!seccion || !escena || !hueco || !sombra || !planoRaiz || !ficha) return;

  const scheda = leerScheda();
  rellenarLeyenda(ficha, scheda);

  const lienzo = hueco;
  const seq = cargarSecuencia(URL_SECUENCIA, TOTAL);
  hueco.appendChild(seq.canvas);
  // Se decide una vez, al cargar. El plano se redibujaría en cada resize si se
  // recalculara, y eso obligaría a rehacer la línea de tiempo entera; girar el
  // teléfono deja las guías un poco largas, que es un precio muy pequeño.
  const compacto = window.matchMedia('(max-width: 899px)').matches;
  const plano = dibujarCotas(planoRaiz, scheda, compacto);

  // El plano arranca sin dibujar. Se le da a cada trazo su propia longitud como
  // guion para poder "dibujarlo" moviendo el desfase — es la única forma de
  // animar un trazo de SVG sin recalcular la geometría en cada fotograma.
  const preparar = () => {
    plano.lineas.forEach((l) => {
      const largo = l.getTotalLength() || 1;
      l.style.strokeDasharray = `${largo}`;
      l.style.strokeDashoffset = `${largo}`;
    });
    gsap.set([...plano.textos, ...plano.marcas, ...plano.puntos], { opacity: 0 });
  };

  if (reducido) {
    // Sin movimiento: la caja ya montada, el plano dibujado y la ficha visible.
    seq.lista.then(() => seq.dibujar(1));
    gsap.set(sombra, { opacity: 1, scaleX: 1 });
    return;
  }

  preparar();
  seq.lista.then(() => {
    seq.dibujar(0);
    // La secuencia cambia la altura del documento en cuanto entra la primera
    // imagen, y la altura del documento es el denominador de todo disparador.
    ScrollTrigger.refresh();
  });

  const linea = gsap.timeline({
    scrollTrigger: {
      trigger: seccion,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.6,
      invalidateOnRefresh: true,
    },
  });

  // El montaje. Va por un objeto intermedio y no directamente sobre el canvas
  // porque lo que se interpola es un progreso, no una propiedad de estilo.
  const estado = { p: 0 };
  linea.to(estado, {
    p: 1,
    duration: 0.62,
    ease: 'none',
    onUpdate: () => seq.dibujar(estado.p),
  }, 0);

  /* La caída.
   *
   * No es una bajada recta. Un objeto que solo baja por el eje Y se lee como un
   * ascensor; lo que hace que parezca que CAE es que además cruce y voltee. Así
   * que van tres cosas a la vez y con recorridos distintos:
   *
   *   - baja, con la ventana pasándole por detrás,
   *   - cruza de derecha a izquierda y vuelve a centrarse,
   *   - y voltea, con dos vaivenes, hasta quedarse recta.
   *
   * Que los tres recorridos no acaben a la vez es lo que lo salva de parecer
   * una animación: si todo llega junto al final, se nota el guion. */
  linea.fromTo(escena, { yPercent: -22 }, { yPercent: 7, duration: 0.72, ease: 'none' }, 0);
  linea.fromTo(escena, { xPercent: 13 }, { xPercent: -9, duration: 0.42, ease: 'sine.inOut' }, 0);
  linea.to(escena, { xPercent: 0, duration: 0.3, ease: 'sine.inOut' }, 0.42);

  // El volteo. Termina en 0 antes de tocar suelo: una caja que aterriza
  // torcida no se apoya, se cae.
  linea.fromTo(lienzo, { rotate: -19 }, { rotate: 13, duration: 0.34, ease: 'sine.inOut' }, 0);
  linea.to(lienzo, { rotate: -7, duration: 0.24, ease: 'sine.inOut' }, 0.34);
  linea.to(lienzo, { rotate: 0, duration: 0.14, ease: 'power2.out' }, 0.58);

  // Rebote corto al tocar suelo.
  linea.to(escena, { yPercent: 4.2, duration: 0.04, ease: 'power2.out' }, 0.72);
  linea.to(escena, { yPercent: 7, duration: 0.04, ease: 'power2.in' }, 0.76);

  linea.fromTo(sombra, { opacity: 0, scaleX: 0.7 }, { opacity: 1, scaleX: 1, duration: 0.08 }, 0.7);

  // El plano se dibuja: primero los trazos, luego los números y las medidas.
  linea.to(plano.lineas, { strokeDashoffset: 0, duration: 0.12, stagger: 0.004, ease: 'none' }, 0.79);
  linea.to([...plano.textos, ...plano.marcas, ...plano.puntos], { opacity: 1, duration: 0.07, stagger: 0.006 }, 0.88);
}

/* ── entradas del texto ────────────────────────────────────────────────── */

/**
 * Lo que ya está en pantalla al cargar tiene que entrar solo.
 *
 * Con `start: 'top 92%'`, un elemento que arranca en el 93% de la ventana
 * —los botones del hero en un portátil, por ejemplo— se queda invisible hasta
 * que el usuario mueve la rueda. Y si esa primera pantalla es lo único que
 * mira, no la mueve nunca. El disparador de scroll solo tiene sentido para lo
 * que está por debajo del pliegue.
 */
const enPantalla = (el: Element) => el.getBoundingClientRect().top < window.innerHeight;

function iniciarTexto() {
  if (reducido) {
    gsap.set('[data-sube]', { opacity: 1, y: 0 });
    return;
  }

  // Los titulares de cartel entran por líneas desde detrás de una máscara. Se
  // parten aquí a mano: son tres o cuatro líneas y no compensa cargar nada.
  // El original se guarda en aria-label, porque partir texto destruye el árbol
  // de accesibilidad si no se hace así.
  document.querySelectorAll<HTMLElement>('[data-cartel]').forEach((el) => {
    const lineas = (el.textContent ?? '')
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);
    if (!lineas.length) return;
    el.setAttribute('aria-label', lineas.join(' '));

    // El énfasis se pierde al partir por texto plano, así que se recupera
    // marcando las líneas que lo llevaban.
    const conEnfasis = new Set<number>();
    el.querySelectorAll('em').forEach((em) => {
      const t = (em.textContent ?? '').trim();
      lineas.forEach((l, i) => {
        if (t && l.includes(t)) conEnfasis.add(i);
      });
    });

    const visible = enPantalla(el);

    el.textContent = '';
    lineas.forEach((l, i) => {
      const mascara = document.createElement('span');
      mascara.className = 'mascara';
      mascara.setAttribute('aria-hidden', 'true');
      const dentro = document.createElement('span');
      dentro.className = 'dentro';
      dentro.setAttribute('data-linea', '');
      if (conEnfasis.has(i)) {
        const em = document.createElement('em');
        em.textContent = l;
        dentro.appendChild(em);
      } else {
        dentro.textContent = l;
      }
      mascara.appendChild(dentro);
      el.appendChild(mascara);
    });

    gsap.fromTo(
      el.querySelectorAll('[data-linea]'),
      { yPercent: 110 },
      {
        yPercent: 0,
        duration: 1.1,
        ease: 'power3.out',
        stagger: 0.08,
        ...(visible ? {} : { scrollTrigger: { trigger: el, start: 'top 90%', once: true } }),
      },
    );
  });

  let orden = 0;
  gsap.utils.toArray<HTMLElement>('[data-sube]').forEach((el) => {
    const visible = enPantalla(el);
    gsap.fromTo(
      el,
      { opacity: 0, y: 22 },
      {
        opacity: 1,
        y: 0,
        duration: 0.85,
        ease: 'power3.out',
        ...(visible
          ? { delay: 0.15 + orden++ * 0.07 }
          : { scrollTrigger: { trigger: el, start: 'top 92%', once: true } }),
      },
    );
  });

  // El producto del hero entra con el titular, un punto más tarde y desde algo
  // más abajo: el objeto pesa más que la letra y tiene que llegar después.
  const producto = document.querySelector('.hero .producto');
  if (producto) {
    gsap.fromTo(
      producto,
      { opacity: 0, y: 46, scale: 1.03 },
      { opacity: 1, y: 0, scale: 1, duration: 1.3, delay: 0.25, ease: 'power3.out' },
    );
  }
}

/* ── arranque ──────────────────────────────────────────────────────────── */

function arrancar() {
  iniciarMontaje();
  iniciarTexto();
  // Las tipografías cambian la altura del documento, y la altura del documento
  // es el denominador de todos los disparadores.
  if (document.fonts) document.fonts.ready.then(() => ScrollTrigger.refresh());
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', arrancar);
} else {
  arrancar();
}
