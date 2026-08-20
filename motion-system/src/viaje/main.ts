import { gsap, ScrollTrigger } from '@/motion/core/gsap';
import { prefersReducedMotion } from '@/motion/accessibility/useReducedMotion';
import './fuentes.css';
import './tokens.css';
import './viaje.css';

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
 * transparencia y apoyado sobre el campo. Y el montaje —que es lo que merecía
 * la pena de la idea original— sigue estando, pero recorrido sobre el vídeo
 * real en una banda a sangre, donde su fondo de estudio deja de ser un estorbo
 * y pasa a ser el escenario.
 *
 * Queda muy poco JavaScript, y es justo lo que debe ser: casi todo el peso de
 * esta página está en la composición, no en el movimiento.
 */

const reducido = prefersReducedMotion();

/* ── el vídeo, recorrido por scroll ────────────────────────────────────── */

/**
 * El render del montaje se sirve desde la raíz del sitio, no desde /motion/.
 * Ya está publicado ahí para el otro prototipo del mismo cliente y pesa 1,5 MB:
 * no hay ninguna razón para tener dos copias en el repositorio.
 *
 * Va aquí y no en el atributo `src` del HTML porque Vite reescribe las rutas de
 * los atributos con el `base` de la aplicación, y esta ruta tiene que quedarse
 * tal cual.
 */
const RENDER = '/prototipi/fidenza/hero-imballaggio.mp4';

function iniciarMontaje() {
  const banda = document.getElementById('montaggio');
  const video = document.getElementById('film') as HTMLVideoElement | null;
  if (!banda || !video) return;

  video.src = RENDER;

  // NUNCA .pause(). Safari dibuja su propio botón de play encima de cualquier
  // vídeo pausado, llegue como llegue a ese estado, y no hay CSS que lo quite.
  // Se mantiene "reproduciendo" a velocidad 0.
  const cebar = () => {
    const p = video.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
    video.playbackRate = 0;
  };
  cebar();
  video.addEventListener('pause', cebar);

  if (reducido) return;

  let frame = 0;
  let objetivo = 0;

  const aplicar = () => {
    frame = 0;
    // readyState >= 2, no loadedmetadata: los metadatos dan duración y un
    // fotograma negro; HAVE_CURRENT_DATA es el primer momento en que hay imagen.
    if (video.readyState < 2 || !Number.isFinite(video.duration)) return;
    const t = objetivo * video.duration;
    if (Math.abs(video.currentTime - t) > 1 / 60) video.currentTime = t;
  };

  ScrollTrigger.create({
    trigger: banda,
    start: 'top top',
    end: 'bottom bottom',
    scrub: true,
    invalidateOnRefresh: true,
    onUpdate: (self) => {
      objetivo = self.progress;
      // El seek va dentro de requestAnimationFrame: escribirlo directamente
      // desde el listener pide más saltos de los que el decodificador entrega.
      if (!frame) frame = requestAnimationFrame(aplicar);
    },
  });
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
