import type { Scheda } from './scheda';

/**
 * Dibuja el plano encima de la caja: cotas, globos numerados y líneas guía.
 *
 * Va en SVG y no en divs con bordes porque un plano es geometría: líneas que
 * tienen que tocar exactamente la arista de la pieza, topes perpendiculares a
 * cada una, y trazos que se dibujan solos al entrar.
 *
 * ── El sistema de coordenadas ──────────────────────────────────────────────
 *
 * El viewBox son los píxeles reales del lienzo de la secuencia, 1280×650, con
 * el `preserveAspectRatio` de siempre. Y el contenedor lleva `aspect-ratio:
 * 1280/650`, así que la caja del SVG y la del fotograma son exactamente la
 * misma a cualquier tamaño de pantalla.
 *
 * ── Por qué las cotas van inclinadas ───────────────────────────────────────
 *
 * La caja está fotografiada en tres cuartos. Sus tres dimensiones NO son dos
 * horizontales y una vertical en la imagen: la altura sí es vertical, pero el
 * ancho y el fondo se van cada uno por su fuga. Una cota horizontal debajo de
 * la caja mide la sombra proyectada, no el mueble.
 *
 * Así que las tres cotas salen de la esquina inferior cercana y siguen cada
 * una su arista, desplazadas hacia fuera. Es como se acota una pieza en un
 * plano de taller, y es lo que hace que se lea qué lado mide qué.
 *
 * Las esquinas están medidas sobre el último fotograma, no puestas a ojo.
 */
export const LIENZO = { w: 1280, h: 650 };

/** Vértices del producto, en coordenadas del lienzo. */
export const CAJA = {
  /** La arista vertical cercana: la que está más próxima a la cámara. */
  frenteX: 640,
  /** Canto superior (es casi horizontal: la cámara está a la altura de la tapa). */
  tapaY: 176,
  izqX: 356,
  derX: 922,
  /** Apoyos del pallet en el suelo. */
  pieIzq: { x: 372, y: 588 },
  pieFrente: { x: 640, y: 634 },
  pieDer: { x: 902, y: 580 },
};

const NS = 'http://www.w3.org/2000/svg';

function el<K extends keyof SVGElementTagNameMap>(
  nombre: K,
  attrs: Record<string, string | number>,
): SVGElementTagNameMap[K] {
  const n = document.createElementNS(NS, nombre);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, String(v));
  return n;
}

type P = { x: number; y: number };

const menos = (a: P, b: P): P => ({ x: a.x - b.x, y: a.y - b.y });
const mas = (a: P, b: P): P => ({ x: a.x + b.x, y: a.y + b.y });
const por = (a: P, k: number): P => ({ x: a.x * k, y: a.y * k });
const unidad = (a: P): P => {
  const m = Math.hypot(a.x, a.y) || 1;
  return { x: a.x / m, y: a.y / m };
};
/** Normal a la izquierda del sentido de avance. */
const normal = (d: P): P => ({ x: -d.y, y: d.x });

/**
 * Una cota entre dos vértices, desplazada `fuera` píxeles hacia el lado que
 * indica el signo, con sus dos líneas de referencia, sus topes y su etiqueta.
 *
 * Funciona en cualquier ángulo: los topes se calculan perpendiculares a la
 * propia cota y el texto se gira con ella. La versión anterior solo sabía de
 * vertical y horizontal, que es justo lo que no sirve en un tres cuartos.
 */
function cota(g: SVGGElement, a: P, b: P, fuera: number, texto: string) {
  const d = unidad(menos(b, a));
  const n = por(normal(d), fuera);
  const A = mas(a, n);
  const B = mas(b, n);

  // Líneas de referencia: llevan la medida desde la pieza hasta la cota. Se
  // pasan un poco de largo, como en un plano de verdad.
  const sobra = por(normal(d), fuera + Math.sign(fuera) * 12);
  g.appendChild(el('line', { x1: a.x, y1: a.y, x2: a.x + sobra.x, y2: a.y + sobra.y, class: 'cota-ref' }));
  g.appendChild(el('line', { x1: b.x, y1: b.y, x2: b.x + sobra.x, y2: b.y + sobra.y, class: 'cota-ref' }));

  g.appendChild(el('line', { x1: A.x, y1: A.y, x2: B.x, y2: B.y, class: 'cota-linea' }));

  // Topes: perpendiculares a la cota, no a la pantalla.
  const t = por(normal(d), 9);
  for (const p of [A, B]) {
    g.appendChild(el('line', { x1: p.x - t.x, y1: p.y - t.y, x2: p.x + t.x, y2: p.y + t.y, class: 'cota-tope' }));
  }

  // La etiqueta se gira con la cota y se levanta un poco sobre ella. El ángulo
  // se normaliza para que nunca salga escrita boca abajo.
  let ang = (Math.atan2(d.y, d.x) * 180) / Math.PI;
  if (ang > 90) ang -= 180;
  if (ang < -90) ang += 180;
  const medio = por(mas(A, B), 0.5);
  const alza = por(normal(unidad(menos(B, A))), Math.sign(fuera) * 15);
  const t2 = el('text', {
    x: medio.x + alza.x,
    y: medio.y + alza.y,
    'text-anchor': 'middle',
    'dominant-baseline': 'middle',
    transform: `rotate(${ang.toFixed(2)} ${(medio.x + alza.x).toFixed(1)} ${(medio.y + alza.y).toFixed(1)})`,
    class: 'cota-texto',
  });
  t2.textContent = texto;
  g.appendChild(t2);
}

/**
 * Construye el plano dentro de `raiz`.
 * Devuelve los elementos que el guion tiene que animar.
 */
export function dibujarCotas(raiz: HTMLElement, scheda: Scheda, compacto = false) {
  raiz.textContent = '';

  const svg = el('svg', {
    viewBox: `0 0 ${LIENZO.w} ${LIENZO.h}`,
    class: compacto ? 'plano plano-compacto' : 'plano',
    'aria-hidden': 'true',
  });

  const gGuias = el('g', { class: 'plano-guias' });
  const gCotas = el('g', { class: 'plano-cotas' });
  svg.append(gGuias, gCotas);

  /* La línea de suelo. Es lo que convierte "la caja se paró ahí" en "la caja
     aterrizó": sin una referencia horizontal, un objeto recortado sobre un
     campo plano flota, por mucha sombra que se le ponga debajo. */
  gCotas.appendChild(
    el('line', { x1: -80, y1: CAJA.pieFrente.y + 3, x2: LIENZO.w + 80, y2: CAJA.pieFrente.y + 3, class: 'cota-suelo' }),
  );

  const m = (clave: string) => scheda.misure.find((x) => x.chiave === clave);
  const valor = (clave: string) => {
    const v = m(clave);
    return v ? `${v.valore} ${v.unita}` : '';
  };

  const fuera = compacto ? 34 : 52;

  /* ANCHURA — sigue la arista inferior de la cara izquierda, hacia abajo. */
  if (m('larghezza')) {
    cota(gCotas, CAJA.pieIzq, CAJA.pieFrente, fuera, valor('larghezza'));
  }

  /* FONDO — sigue la arista inferior de la cara derecha, hacia abajo.
     Va de frente hacia el pie derecho, así el desplazamiento cae al otro lado
     sin tener que invertir el signo a mano. */
  if (m('profondita')) {
    cota(gCotas, CAJA.pieFrente, CAJA.pieDer, fuera, valor('profondita'));
  }

  /* ALTURA — vertical, por fuera del canto derecho. De la tapa al suelo:
     es la altura que ocupa en el camión, que es la que importa.

     El sentido de la línea decide de qué lado cae la cota. Va de abajo hacia
     arriba, así que su normal apunta a la derecha y el desplazamiento POSITIVO
     la saca fuera de la caja. Con el signo cambiado se dibuja por dentro,
     encima de la madera. */
  if (m('altezza')) {
    cota(
      gCotas,
      { x: CAJA.derX, y: CAJA.pieDer.y },
      { x: CAJA.derX, y: CAJA.tapaY },
      compacto ? 48 : 74,
      valor('altezza'),
    );
  }

  /* PESO — no es una cota, es un dato: va como etiqueta suelta sobre la tapa. */
  const peso = m('peso');
  if (peso && !compacto) {
    const t = el('text', {
      x: CAJA.frenteX,
      y: CAJA.tapaY - 34,
      'text-anchor': 'middle',
      class: 'cota-texto cota-dato',
    });
    t.textContent = `${peso.etichetta} ${peso.valore} ${peso.unita}`;
    gCotas.appendChild(t);
  }

  /* Globos numerados con su línea guía, uno por pieza de la leyenda. */
  const marcas: SVGGElement[] = [];
  const brazo = compacto ? 42 : 118;
  scheda.legenda.forEach((v) => {
    // El punto señalado va en % del cuerpo de la caja, no del lienzo.
    const px = CAJA.izqX + ((CAJA.derX - CAJA.izqX) * v.x) / 100;
    const py = CAJA.tapaY + ((CAJA.pieFrente.y - CAJA.tapaY) * v.y) / 100;
    const gx = v.lato === 'sx' ? CAJA.izqX - brazo : CAJA.derX + brazo;

    gGuias.appendChild(el('line', { x1: px, y1: py, x2: gx, y2: py, class: 'globo-guia' }));
    gGuias.appendChild(el('circle', { cx: px, cy: py, r: 4, class: 'globo-punto' }));

    const g = el('g', { class: 'globo-marca' });
    // El radio va en el atributo y no en CSS: `r` como propiedad de hoja de
    // estilos es reciente y no la aplican todos los navegadores en uso.
    g.appendChild(el('circle', { cx: gx, cy: py, r: compacto ? 26 : 17, class: 'globo-circulo' }));
    const t = el('text', {
      x: gx,
      y: py,
      'text-anchor': 'middle',
      'dominant-baseline': 'central',
      class: 'globo-num',
    });
    t.textContent = String(v.numero);
    g.appendChild(t);
    marcas.push(g);
    svg.appendChild(g);
  });

  raiz.appendChild(svg);

  return {
    lineas: Array.from(svg.querySelectorAll<SVGLineElement>('line')),
    textos: Array.from(gCotas.querySelectorAll<SVGTextElement>('text')),
    marcas,
    puntos: Array.from(svg.querySelectorAll<SVGCircleElement>('.globo-punto')),
  };
}

/**
 * Rellena la tabla de la leyenda y la lista de materiales.
 *
 * Todo por textContent. Estos textos los va a escribir el cliente desde el
 * panel, y un campo de texto de un panel no es una plantilla: si alguien pega
 * ahí una etiqueta HTML, tiene que salir escrita, no ejecutada.
 */
export function rellenarLeyenda(raiz: HTMLElement, scheda: Scheda) {
  const cuerpo = raiz.querySelector('tbody');
  if (cuerpo) {
    cuerpo.textContent = '';
    scheda.legenda.forEach((v) => {
      const tr = document.createElement('tr');
      for (const celda of [String(v.numero), v.codice, String(v.qta), v.descrizione]) {
        const td = document.createElement('td');
        td.textContent = celda;
        tr.appendChild(td);
      }
      cuerpo.appendChild(tr);
    });
  }

  const mats = raiz.querySelector('[data-materiali]');
  if (mats) {
    mats.textContent = '';
    scheda.materiali.forEach((mat) => {
      const li = document.createElement('li');
      const s = document.createElement('b');
      s.textContent = mat.sigla;
      const n = document.createElement('span');
      n.textContent = mat.nome;
      const d = document.createElement('i');
      d.textContent = mat.dettaglio;
      li.append(s, n, d);
      mats.appendChild(li);
    });
  }

  const mis = raiz.querySelector('[data-misure]');
  if (mis) {
    mis.textContent = '';
    scheda.misure.forEach((x) => {
      const li = document.createElement('li');
      const n = document.createElement('span');
      n.textContent = x.etichetta;
      const v = document.createElement('b');
      v.textContent = `${x.valore} ${x.unita}`;
      li.append(n, v);
      mis.appendChild(li);
    });
  }

  raiz.querySelectorAll<HTMLElement>('[data-campo]').forEach((n) => {
    const clave = n.dataset.campo;
    if (clave === 'riferimento') n.textContent = scheda.riferimento;
    if (clave === 'disegno') n.textContent = scheda.disegno;
  });
}
