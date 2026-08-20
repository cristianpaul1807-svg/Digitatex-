/**
 * El objeto que recorre la página entera.
 *
 * No es el renderizador del showcase con más piezas: es otra cosa. Aquel
 * dibujaba un sólido girando dentro de una sección anclada. Este dibuja una
 * caja que nace en pedazos, se monta, se cierra, se envuelve en film y acaba
 * posada sobre un palé — y lo hace atravesando toda la página, no una sección.
 *
 * Sigue siendo una tubería 3D mínima sobre un canvas 2D: rotar vértices,
 * proyectar, ordenar caras por profundidad y sombrear cada una según lo de
 * frente que mire a la luz. Sin WebGL, sin shaders, sin modelo que descargar.
 * Arranca en el primer fotograma y pesa cero.
 */

type V3 = [number, number, number];
export interface Escena {
  w: number;
  h: number;
  /** Avance total de la página, 0 → 1. */
  t: number;
  /** En pantalla estrecha el objeto no se encoge: se aparta. Ver abajo. */
  movil: boolean;
}

const LUZ: V3 = [-0.42, -0.78, 0.46];

/* ── matemática mínima ─────────────────────────────────────────────────── */

function girar([x, y, z]: V3, ry: number, rx: number): V3 {
  const cy = Math.cos(ry), sy = Math.sin(ry);
  const x1 = x * cy - z * sy;
  const z1 = x * sy + z * cy;
  const cx = Math.cos(rx), sx = Math.sin(rx);
  return [x1, y * cx - z1 * sx, y * sx + z1 * cx];
}

function normal(a: V3, b: V3, c: V3): V3 {
  const u: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
  const v: V3 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
  const n: V3 = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
  const L = Math.hypot(n[0], n[1], n[2]) || 1;
  return [n[0] / L, n[1] / L, n[2] / L];
}

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
/** Reasigna un tramo del recorrido a 0–1, para encadenar actos. */
const tramo = (t: number, desde: number, hasta: number) => clamp((t - desde) / (hasta - desde));
const suave = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const mezcla = (a: number, b: number, t: number) => a + (b - a) * t;

/* ── una caja rectangular cualquiera ───────────────────────────────────── */

interface Caja {
  cx: number; cy: number; cz: number;
  sx: number; sy: number; sz: number;
  /** Color base. La luz lo modula; el color no cambia. */
  color: [number, number, number];
  /** 0 = filo apenas visible, 1 = filo marcado. */
  filo?: number;
  /** Desplazamiento propio mientras la pieza «vuela» a su sitio. */
  offset?: V3;
  alfa?: number;
}

const CARAS: [number, number, number, number][] = [
  [0, 1, 2, 3], [5, 4, 7, 6], [4, 0, 3, 7], [1, 5, 6, 2], [3, 2, 6, 7], [4, 5, 1, 0],
];

function dibujarCaja(
  ctx: CanvasRenderingContext2D,
  c: Caja,
  vista: { ry: number; rx: number; escala: number; ox: number; oy: number },
) {
  const off = c.offset ?? [0, 0, 0];
  const v: V3[] = [
    [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
    [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1],
  ].map((p) => [
    c.cx + off[0] + (p[0] as number) * c.sx,
    c.cy + off[1] + (p[1] as number) * c.sy,
    c.cz + off[2] + (p[2] as number) * c.sz,
  ] as V3);

  const proy = v.map((p) => {
    const r = girar(p, vista.ry, vista.rx);
    // Perspectiva débil: suficiente para leer profundidad, no tanta como para
    // deformar. Una caja industrial deformada parece rota, no dinámica.
    const k = 5.2 / (5.2 - r[2]);
    return { x: vista.ox + r[0] * vista.escala * k, y: vista.oy + r[1] * vista.escala * k, z: r[2] };
  });

  const caras = CARAS.map((f) => {
    const pts = f.map((i) => proy[i]!);
    const z = pts.reduce((s, p) => s + p.z, 0) / 4;
    const rot = f.map((i) => girar(v[i]!, vista.ry, vista.rx));
    const n = normal(rot[0]!, rot[1]!, rot[2]!);
    const lam = Math.max(0, n[0] * LUZ[0] + n[1] * LUZ[1] + n[2] * LUZ[2]);
    return { pts, z, lam };
  }).sort((a, b) => a.z - b.z);

  const alfa = c.alfa ?? 1;
  for (const cara of caras) {
    // Suelo ambiente alto a proposito. La escena es casi negra y el velo le
    // resta todavia mas: con 0.22 la madera se leia como carbon. El rango util
    // de esta paleta esta arriba, no abajo.
    const k = 0.52 + cara.lam * 0.62;
    ctx.beginPath();
    cara.pts.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
    ctx.closePath();
    ctx.fillStyle = `rgba(${Math.round(c.color[0] * k)},${Math.round(c.color[1] * k)},${Math.round(c.color[2] * k)},${alfa})`;
    ctx.fill();
    if (c.filo) {
      ctx.strokeStyle = `rgba(255,255,255,${0.09 * c.filo * alfa + cara.lam * 0.16 * c.filo * alfa})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }
}

/* ── las piezas ────────────────────────────────────────────────────────── */

const MADERA: [number, number, number] = [201, 160, 106];
const MADERA_OSCURA: [number, number, number] = [150, 116, 74];
const FILM: [number, number, number] = [74, 144, 226];

/** Palé: tres tacos y cuatro tablas. */
function pale(): Caja[] {
  const piezas: Caja[] = [];
  for (const x of [-0.72, 0, 0.72]) {
    piezas.push({ cx: x, cy: 0.9, cz: 0, sx: 0.1, sy: 0.1, sz: 0.62, color: MADERA_OSCURA, filo: 0.5 });
  }
  for (const z of [-0.52, -0.17, 0.17, 0.52]) {
    piezas.push({ cx: 0, cy: 0.78, cz: z, sx: 0.95, sy: 0.045, sz: 0.13, color: MADERA, filo: 0.7 });
  }
  return piezas;
}

/** Bastidor de la caja: cuatro montantes y los travesaños de arriba. */
function bastidor(): Caja[] {
  const piezas: Caja[] = [];
  for (const x of [-0.82, 0.82]) {
    for (const z of [-0.5, 0.5]) {
      piezas.push({ cx: x, cy: 0.1, cz: z, sx: 0.07, sy: 0.66, sz: 0.07, color: MADERA, filo: 0.8 });
    }
  }
  for (const z of [-0.5, 0.5]) {
    piezas.push({ cx: 0, cy: -0.58, cz: z, sx: 0.86, sy: 0.06, sz: 0.06, color: MADERA, filo: 0.8 });
  }
  for (const x of [-0.82, 0.82]) {
    piezas.push({ cx: x, cy: -0.58, cz: 0, sx: 0.06, sy: 0.06, sz: 0.54, color: MADERA, filo: 0.8 });
  }
  return piezas;
}

/** Duelas de los laterales, que se rellenan de abajo arriba. */
function duelas(relleno: number): Caja[] {
  const piezas: Caja[] = [];
  const filas = 5;
  for (let i = 0; i < filas; i++) {
    // Cada duela entra a su turno: el relleno global se reparte entre las cinco.
    const p = clamp((relleno - i / filas) * filas);
    if (p <= 0) continue;
    const s = suave(p);
    const y = -0.42 + i * 0.24;

    // Caras larga (frente y espalda) y corta (los dos costados).
    for (const z of [-0.5, 0.5]) {
      piezas.push({ cx: 0, cy: y, cz: z, sx: 0.8 * s, sy: 0.1, sz: 0.035, color: MADERA, filo: 0.6, alfa: s });
    }
    for (const x of [-0.82, 0.82]) {
      piezas.push({ cx: x, cy: y, cz: 0, sx: 0.035, sy: 0.1, sz: 0.48 * s, color: MADERA_OSCURA, filo: 0.6, alfa: s });
    }
  }
  return piezas;
}

/** Tapa, que baja y encaja al final del segundo acto. */
function tapa(cerrado: number): Caja[] {
  if (cerrado <= 0) return [];
  const s = suave(cerrado);
  return [{
    cx: 0, cy: mezcla(-1.9, -0.72, s), cz: 0,
    sx: 0.9, sy: 0.06, sz: 0.56,
    color: MADERA, filo: 0.9, alfa: s,
  }];
}

/**
 * Film barrera: una caja azul que ENVUELVE la madera, no que la sustituye.
 *
 * La opacidad es lo único que decide si esto se lee como film o como una caja
 * azul: a 0.86 la madera desaparecía y el producto pasaba a ser otro objeto.
 * A 0.46 se ve el bastidor por debajo, que es exactamente lo que hace un film
 * translúcido de verdad.
 *
 * Y va un pelo más grande que la caja por los tres lados. Un envoltorio a ras
 * deja las aristas de la madera asomando y se lee como un error de dibujo.
 */
function film(envuelto: number): Caja[] {
  if (envuelto <= 0) return [];
  const s = suave(envuelto);
  return [{
    cx: 0, cy: mezcla(-0.78, 0.02, s), cz: 0,
    sx: 0.88, sy: mezcla(0.03, 0.8, s), sz: 0.55,
    color: FILM, filo: 1, alfa: 0.46 * s,
  }];
}

/* ── el recorrido ──────────────────────────────────────────────────────── */

export interface Acto {
  /** Dónde empieza este acto dentro del recorrido total, 0–1. */
  en: number;
  /** Posición del objeto en pantalla, en fracción del ancho y del alto. */
  x: number;
  y: number;
  escala: number;
  /** Vueltas completas acumuladas. */
  giro: number;
  inclinacion: number;
}

/**
 * Los seis actos del viaje. Cambiar esta tabla cambia toda la coreografía sin
 * tocar una línea de dibujo — que es justo el motivo de que exista.
 */
export const ACTOS: Acto[] = [
  { en: 0.00, x: 0.74, y: 0.50, escala: 0.80, giro: 0.00, inclinacion: -0.30 },
  { en: 0.18, x: 0.76, y: 0.48, escala: 0.66, giro: 0.30, inclinacion: -0.26 },
  { en: 0.38, x: 0.26, y: 0.52, escala: 0.70, giro: 0.78, inclinacion: -0.34 },
  { en: 0.58, x: 0.76, y: 0.50, escala: 0.66, giro: 1.22, inclinacion: -0.24 },
  { en: 0.78, x: 0.26, y: 0.52, escala: 0.72, giro: 1.66, inclinacion: -0.32 },
  { en: 1.00, x: 0.50, y: 0.50, escala: 0.86, giro: 2.00, inclinacion: -0.30 },
];

function interpolarActos(t: number) {
  let i = 0;
  for (let k = 0; k < ACTOS.length - 1; k++) if (t >= ACTOS[k]!.en) i = k;
  const a = ACTOS[i]!;
  const b = ACTOS[Math.min(i + 1, ACTOS.length - 1)]!;
  const p = b.en === a.en ? 0 : suave(clamp((t - a.en) / (b.en - a.en)));
  return {
    x: mezcla(a.x, b.x, p),
    y: mezcla(a.y, b.y, p),
    escala: mezcla(a.escala, b.escala, p),
    giro: mezcla(a.giro, b.giro, p),
    inclinacion: mezcla(a.inclinacion, b.inclinacion, p),
  };
}

/**
 * Dibuja un fotograma completo del viaje.
 *
 * Los cinco actos del montaje se solapan a propósito: la tapa empieza a bajar
 * antes de que la última duela termine de entrar, y el film empieza a subir
 * antes de que la tapa asiente. Un montaje por pasos limpios se lee como un
 * manual de instrucciones; solapado se lee como un taller.
 */
export function dibujarViaje(ctx: CanvasRenderingContext2D, esc: Escena) {
  const { w, h, t, movil } = esc;
  const pos = interpolarActos(t);

  // En el teléfono el objeto NO hace el mismo recorrido más pequeño: se sale
  // de la coreografía y se atraca en la banda de arriba, centrado, mientras el
  // texto pasa por debajo. A 390px de ancho, un objeto que cruza de un lado al
  // otro pasa la mitad del tiempo fuera de la pantalla, y encima se pelea con
  // cada párrafo. El montaje se sigue viendo entero — lo que se pierde es el
  // viaje lateral, que es lo que menos importa de los dos.
  const base = Math.min(w, h);
  const vista = movil
    ? {
        ry: pos.giro * Math.PI * 2,
        rx: pos.inclinacion,
        escala: base * 0.19 * 0.68,
        ox: w * 0.5,
        oy: h * 0.23,
      }
    : {
        ry: pos.giro * Math.PI * 2,
        rx: pos.inclinacion,
        escala: base * 0.19 * pos.escala,
        ox: w * pos.x,
        oy: h * pos.y,
      };

  // Sombra de contacto. Pequeña y con contraste: un degradado enorme a muy
  // baja opacidad sobre un fondo casi negro deja ver las baldosas de trama del
  // navegador y se lee como un fallo de dibujo, no como sombra.
  const sy = vista.oy + vista.escala * 1.15;
  const g = ctx.createRadialGradient(vista.ox, sy, 0, vista.ox, sy, vista.escala * 1.5);
  g.addColorStop(0, 'rgba(0,0,0,0.55)');
  g.addColorStop(0.5, 'rgba(0,0,0,0.2)');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.save();
  ctx.translate(vista.ox, sy);
  ctx.scale(1, 0.3);
  ctx.translate(-vista.ox, -sy);
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(vista.ox, sy, vista.escala * 1.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Acto 1 · las piezas llegan volando y se montan.
  const montaje = suave(tramo(t, 0.02, 0.22));
  // Acto 2 · las duelas rellenan los laterales.
  const relleno = tramo(t, 0.18, 0.44);
  // Acto 3 · la tapa baja.
  const cerrado = tramo(t, 0.40, 0.56);
  // Acto 4 · el film envuelve.
  const envuelto = tramo(t, 0.54, 0.74);

  const piezas: Caja[] = [];
  piezas.push(...pale());
  for (const p of bastidor()) {
    // Cada montante entra desde una dirección distinta, sembrada por su
    // posición, para que el montaje no parezca coreografiado a mano.
    const semilla = (p.cx * 3.1 + p.cz * 7.7 + p.cy * 1.3);
    const d = 1 - montaje;
    piezas.push({
      ...p,
      offset: [Math.sin(semilla) * 3.4 * d, -Math.abs(Math.cos(semilla)) * 2.6 * d, Math.cos(semilla * 1.7) * 3.4 * d],
      alfa: clamp(montaje * 1.4),
    });
  }
  piezas.push(...duelas(relleno));
  piezas.push(...tapa(cerrado));

  // Se ordenan todas las piezas juntas por profundidad antes de pintar, o las
  // duelas del fondo aparecen delante del bastidor.
  const conZ = piezas.map((c) => {
    const off = c.offset ?? [0, 0, 0];
    const centro = girar([c.cx + off[0], c.cy + off[1], c.cz + off[2]] as V3, vista.ry, vista.rx);
    return { c, z: centro[2] };
  }).sort((a, b) => a.z - b.z);

  for (const { c } of conZ) dibujarCaja(ctx, c, vista);

  // El film va el último y sin ordenar: es translúcido y tiene que quedar por
  // encima de todo lo que envuelve.
  for (const c of film(envuelto)) dibujarCaja(ctx, c, vista);
}
