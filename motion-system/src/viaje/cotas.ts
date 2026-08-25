import type { Scheda } from './scheda';

/**
 * Dibuja el plano encima de la caja: cotas, globos numerados y líneas guía.
 *
 * Va en SVG y no en divs con bordes porque un plano es geometría: flechas que
 * tienen que tocar exactamente el borde de la pieza, líneas que se cruzan sin
 * pisarse, y trazos que se dibujan solos al entrar. Con divs sale un dibujo
 * aproximado; con SVG sale el dibujo.
 *
 * ── El sistema de coordenadas ──────────────────────────────────────────────
 *
 * El viewBox son los píxeles reales del lienzo de la secuencia, 1280×650, con
 * el `preserveAspectRatio` de siempre. Y el contenedor lleva `aspect-ratio:
 * 1280/650`, así que la caja del SVG y la del canvas son exactamente la misma
 * a cualquier tamaño de pantalla: lo que se dibuja en la coordenada 354,178
 * cae sobre el píxel 354,178 del fotograma, se vea la página donde se vea.
 *
 * El primer intento fue con dos SVG —uno estirado para las líneas y otro
 * proporcional para los círculos— y estaba mal: al conservar la proporción, el
 * segundo encajaba sus 100 unidades contra el lado corto y las centraba
 * respecto al otro, así que las dos capas dejaban de coincidir. Con un único
 * sistema en píxeles del lienzo el problema no existe: los círculos salen
 * redondos y los textos sin deformar porque nada se estira.
 *
 * ── Dónde está la caja ─────────────────────────────────────────────────────
 *
 * Medido sobre el último fotograma de la secuencia, no puesto a ojo.
 */
export const LIENZO = { w: 1280, h: 650 };
export const CAJA = { izq: 354, der: 935, arr: 178, aba: 639 };

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
) {
  grupo.appendChild(el('line', { x1: a.x, y1: a.y, x2: b.x, y2: b.y, class: 'cota-linea' }));

  // Topes perpendiculares en los extremos. En un plano de verdad son lo que
  // dice hasta dónde llega la medida; sin ellos la línea es solo una raya.
  const vertical = Math.abs(b.x - a.x) < Math.abs(b.y - a.y);
  const t = 9;
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

  const t2 = el('text', {
    x: vertical ? mx - 8 : mx,
    y: vertical ? my : my + 26,
    'text-anchor': 'middle',
    'dominant-baseline': vertical ? 'auto' : 'auto',
    class: 'cota-texto',
  });
  // La cota vertical va girada, como en cualquier plano de taller. No es un
  // guiño: escrita en horizontal ocupa a lo ancho lo que mide la palabra, y
  // ahí al lado están los globos numerados. Girada ocupa el alto de una línea.
  if (vertical) t2.setAttribute('transform', `rotate(-90 ${mx - 8} ${my})`);
  t2.textContent = texto;
  grupo.appendChild(t2);
}

/**
 * Construye el plano dentro de `raiz`.
 * Devuelve los elementos que main.ts tiene que animar.
 */
export function dibujarCotas(raiz: HTMLElement, scheda: Scheda, compacto = false) {
  raiz.textContent = '';

  const svg = el('svg', {
    viewBox: `0 0 ${LIENZO.w} ${LIENZO.h}`,
    class: compacto ? 'plano plano-compacto' : 'plano',
    'aria-hidden': 'true',
  });

  /* En vertical el plano se aprieta contra el producto y pierde la cota de
     profundidad. No es una versión recortada por pereza: el dibujo se escala
     con el ancho de la pantalla, y en 390 px las guías largas dejan los globos
     fuera del recuadro y los números a 6 px. Un plano que no se lee no es un
     plano. La profundidad sigue estando escrita en la ficha de abajo. */
  const brazo = compacto ? 46 : 120;

  const gGuias = el('g', { class: 'plano-guias' });
  const gCotas = el('g', { class: 'plano-cotas' });
  svg.append(gGuias, gCotas);

  /* La línea de suelo. Es lo que convierte "la caja se paró ahí" en "la caja
     aterrizó": sin una referencia horizontal, un objeto recortado sobre un
     campo plano flota, por mucha sombra que se le ponga debajo. Se dibuja a la
     altura exacta de la base del pallet y se sale por los dos lados. */
  gCotas.appendChild(
    el('line', { x1: -60, y1: CAJA.aba + 2, x2: LIENZO.w + 60, y2: CAJA.aba + 2, class: 'cota-suelo' }),
  );

  const m = (clave: string) => scheda.misure.find((x) => x.chiave === clave);
  const valor = (clave: string) => {
    const v = m(clave);
    return v ? `${v.valore} ${v.unita}` : '';
  };

  /* Altura: a la izquierda, en vertical. */
  const xAlt = CAJA.izq - (compacto ? 96 : 62);
  if (m('altezza')) {
    cota(gCotas, { x: xAlt, y: CAJA.arr }, { x: xAlt, y: CAJA.aba }, valor('altezza'));
    // Líneas de referencia que llevan la cota hasta la pieza. Punteadas y más
    // tenues: no son la medida, solo dicen de dónde sale.
    gCotas.appendChild(el('line', { x1: xAlt, y1: CAJA.arr, x2: CAJA.izq, y2: CAJA.arr, class: 'cota-ref' }));
    gCotas.appendChild(el('line', { x1: xAlt, y1: CAJA.aba, x2: CAJA.izq, y2: CAJA.aba, class: 'cota-ref' }));
  }

  /* Anchura: debajo, en horizontal. */
  const yAnc = CAJA.aba - 4;
  if (m('larghezza')) {
    cota(gCotas, { x: CAJA.izq, y: yAnc }, { x: CAJA.der, y: yAnc }, valor('larghezza'));
  }

  /* Profundidad: arriba a la derecha, siguiendo la fuga. La caja está en tres
     cuartos, así que la cota del fondo va paralela a esa arista y no recta. */
  if (m('profondita') && !compacto) {
    cota(
      gCotas,
      { x: CAJA.der - 150, y: CAJA.arr - 42 },
      { x: CAJA.der + 26, y: CAJA.arr - 42 },
      valor('profondita'),
    );
    gCotas.appendChild(el('line', { x1: CAJA.der + 26, y1: CAJA.arr - 42, x2: CAJA.der, y2: CAJA.arr + 6, class: 'cota-ref' }));
  }

  /* Globos numerados con su línea guía, uno por pieza de la leyenda. */
  const marcas: SVGGElement[] = [];
  scheda.legenda.forEach((v) => {
    // El punto señalado va en % de la CAJA, no del lienzo: así una pieza
    // apuntada al 50/50 cae en el centro del producto y no en el del hueco.
    const px = CAJA.izq + ((CAJA.der - CAJA.izq) * v.x) / 100;
    const py = CAJA.arr + ((CAJA.aba - CAJA.arr) * v.y) / 100;
    const gx = v.lato === 'sx' ? CAJA.izq - brazo : CAJA.der + brazo;

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

  raiz.querySelectorAll<HTMLElement>('[data-campo]').forEach((n) => {
    const clave = n.dataset.campo;
    if (clave === 'riferimento') n.textContent = scheda.riferimento;
    if (clave === 'disegno') n.textContent = scheda.disegno;
  });
}
