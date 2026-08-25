import type { Scheda } from './scheda';

/**
 * Dibuja el plano encima de la caja: cotas, globos numerados y líneas guía.
 *
 * Va en SVG y no en divs con bordes porque un plano es geometría: flechas que
 * tienen que tocar exactamente el borde de la pieza, líneas que se cruzan sin
 * pisarse, y un trazo que se dibuja solo al entrar. Con divs sale un dibujo
 * aproximado; con SVG sale el dibujo.
 *
 * ── El sistema de coordenadas ──────────────────────────────────────────────
 *
 * El viewBox es 0–100 en los dos ejes, y NO conserva la proporción
 * (preserveAspectRatio="none"). Es decir: 0,0 es la esquina superior izquierda
 * del lienzo de la secuencia y 100,100 la inferior derecha, se estire lo que se
 * estire. Así los anclajes se escriben una vez en porcentaje y valen para
 * cualquier tamaño de pantalla, sin recalcular nada al redimensionar.
 *
 * El precio de no conservar la proporción es que un círculo saldría ovalado y
 * un trazo horizontal más fino que uno vertical. Por eso TODO lo que tiene que
 * salir redondo o de grosor constante —globos, textos, puntas de flecha— se
 * dibuja en un segundo SVG superpuesto que sí conserva la proporción, y solo
 * las líneas rectas viven en el estirado.
 *
 * ── Dónde está la caja ─────────────────────────────────────────────────────
 *
 * Medido sobre el último fotograma de la secuencia con scripts/, no a ojo.
 */
export const CAJA = { izq: 27.7, der: 73.0, arr: 27.4, aba: 98.3 };

const NS = 'http://www.w3.org/2000/svg';

function el<K extends keyof SVGElementTagNameMap>(
  nombre: K,
  attrs: Record<string, string | number>,
): SVGElementTagNameMap[K] {
  const n = document.createElementNS(NS, nombre);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, String(v));
  return n;
}

/** Línea de cota: el trazo, los dos topes y la etiqueta. */
function cota(
  grupo: SVGGElement,
  a: { x: number; y: number },
  b: { x: number; y: number },
  texto: string,
  lado: 'arriba' | 'abajo' | 'izquierda' | 'derecha',
) {
  const linea = el('line', { x1: a.x, y1: a.y, x2: b.x, y2: b.y, class: 'cota-linea' });
  grupo.appendChild(linea);

  // Topes perpendiculares en los extremos. En un plano de verdad son lo que
  // dice hasta dónde llega la medida; sin ellos la línea es solo una raya.
  const vertical = Math.abs(b.x - a.x) < Math.abs(b.y - a.y);
  const t = 1.1;
  for (const p of [a, b]) {
    grupo.appendChild(
      el('line', {
        x1: vertical ? p.x - t : p.x,
        y1: vertical ? p.y : p.y - t,
        x2: vertical ? p.x + t : p.x,
        y2: vertical ? p.y : p.y + t,
        class: 'cota-tope',
      }),
    );
  }

  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const sep = 2.2;
  const desp = {
    arriba: { x: mx, y: my - sep, anchor: 'middle' },
    abajo: { x: mx, y: my + sep + 1.4, anchor: 'middle' },
    izquierda: { x: mx - sep, y: my, anchor: 'end' },
    derecha: { x: mx + sep, y: my, anchor: 'start' },
  }[lado];

  const t2 = el('text', {
    x: desp.x,
    y: desp.y,
    'text-anchor': desp.anchor,
    'dominant-baseline': 'middle',
    class: 'cota-texto',
  });
  t2.textContent = texto;
  grupo.appendChild(t2);
}

/**
 * Construye el plano dentro de `raiz`.
 * Devuelve los elementos que main.ts tiene que animar.
 */
export function dibujarCotas(raiz: HTMLElement, scheda: Scheda) {
  raiz.textContent = '';

  const svg = el('svg', {
    viewBox: '0 0 100 100',
    preserveAspectRatio: 'none',
    class: 'plano',
    'aria-hidden': 'true',
  });

  const gCotas = el('g', { class: 'plano-cotas' });
  const gGuias = el('g', { class: 'plano-guias' });
  svg.append(gGuias, gCotas);

  const m = (clave: string) => scheda.misure.find((x) => x.chiave === clave);
  const valor = (clave: string) => {
    const v = m(clave);
    return v ? `${v.valore} ${v.unita}` : '';
  };

  /* Altura: a la izquierda de la caja, en vertical. */
  const xAlt = CAJA.izq - 6;
  if (m('altezza')) {
    cota(gCotas, { x: xAlt, y: CAJA.arr }, { x: xAlt, y: CAJA.aba }, valor('altezza'), 'izquierda');
    // Líneas de referencia que llevan la cota hasta la pieza. Punteadas y más
    // finas: no son la medida, solo dicen de dónde sale.
    gCotas.appendChild(el('line', { x1: xAlt, y1: CAJA.arr, x2: CAJA.izq, y2: CAJA.arr, class: 'cota-ref' }));
    gCotas.appendChild(el('line', { x1: xAlt, y1: CAJA.aba, x2: CAJA.izq, y2: CAJA.aba, class: 'cota-ref' }));
  }

  /* Anchura: debajo, en horizontal. */
  const yAnc = CAJA.aba + 4.5;
  if (m('larghezza')) {
    cota(gCotas, { x: CAJA.izq, y: yAnc }, { x: CAJA.der, y: yAnc }, valor('larghezza'), 'abajo');
    gCotas.appendChild(el('line', { x1: CAJA.izq, y1: CAJA.aba, x2: CAJA.izq, y2: yAnc, class: 'cota-ref' }));
    gCotas.appendChild(el('line', { x1: CAJA.der, y1: CAJA.aba, x2: CAJA.der, y2: yAnc, class: 'cota-ref' }));
  }

  /* Profundidad: en diagonal, siguiendo la fuga del render. La caja está en
     tres cuartos, así que la única cota honesta para el fondo es la que va
     paralela a esa arista. */
  if (m('profondita')) {
    cota(
      gCotas,
      { x: CAJA.der + 3, y: CAJA.arr + 6 },
      { x: CAJA.der + 3, y: CAJA.arr - 3 },
      valor('profondita'),
      'derecha',
    );
  }

  /* Globos numerados con su línea guía, uno por pieza de la leyenda. */
  const globos: SVGGElement[] = [];
  scheda.legenda.forEach((v) => {
    // El punto que se señala va en % de la CAJA, no del lienzo: así una pieza
    // apuntada al 50/50 cae en el centro del producto y no en el del hueco.
    const px = CAJA.izq + ((CAJA.der - CAJA.izq) * v.x) / 100;
    const py = CAJA.arr + ((CAJA.aba - CAJA.arr) * v.y) / 100;
    // El globo se aparta hacia el lado más cercano, para no taparlo todo.
    const haciaIzq = v.x < 50;
    const gx = haciaIzq ? CAJA.izq - 11 : CAJA.der + 11;
    const gy = py;

    const g = el('g', { class: 'globo' });
    g.appendChild(el('line', { x1: px, y1: py, x2: gx, y2: gy, class: 'globo-guia' }));
    g.appendChild(el('circle', { cx: px, cy: py, r: 0.5, class: 'globo-punto' }));
    globos.push(g);
    gGuias.appendChild(g);
  });

  raiz.appendChild(svg);

  /* Capa que SÍ conserva proporción: aquí van los globos redondos y sus
     números, que en el SVG estirado saldrían ovalados. */
  const svg2 = el('svg', { viewBox: '0 0 100 100', class: 'plano plano-fijo', 'aria-hidden': 'true' });
  scheda.legenda.forEach((v) => {
    const py = CAJA.arr + ((CAJA.aba - CAJA.arr) * v.y) / 100;
    const haciaIzq = v.x < 50;
    const gx = haciaIzq ? CAJA.izq - 11 : CAJA.der + 11;
    const g = el('g', { class: 'globo-marca' });
    g.appendChild(el('circle', { cx: gx, cy: py, r: 2.6, class: 'globo-circulo' }));
    const t = el('text', {
      x: gx,
      y: py,
      'text-anchor': 'middle',
      'dominant-baseline': 'central',
      class: 'globo-num',
    });
    t.textContent = String(v.numero);
    g.appendChild(t);
    svg2.appendChild(g);
  });
  raiz.appendChild(svg2);

  return {
    lineas: Array.from(svg.querySelectorAll<SVGLineElement>('line')),
    textos: Array.from(svg.querySelectorAll<SVGTextElement>('text')),
    marcas: Array.from(svg2.querySelectorAll<SVGGElement>('.globo-marca')),
    globos,
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

  raiz.querySelectorAll<HTMLElement>('[data-campo]').forEach((n) => {
    const clave = n.dataset.campo;
    if (clave === 'riferimento') n.textContent = scheda.riferimento;
    if (clave === 'disegno') n.textContent = scheda.disegno;
  });
}
