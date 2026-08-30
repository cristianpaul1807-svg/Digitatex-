/**
 * Saca del render la secuencia de la caja montándose, recortada sobre
 * transparencia y con TODOS los fotogramas en el mismo encuadre.
 *
 *   node scripts/secuencia-montaje.mjs <carpetaPNG> <carpetaSalida> [sueloRel]
 *
 * Por qué un script aparte y no el recortador normal:
 *
 * 1. El encuadre tiene que ser COMÚN. Si cada fotograma se recorta a su propio
 *    contenido, la caja da un salto en cada cambio: el recorte se mueve con
 *    ella y el objeto parece vibrar. Se calcula la caja envolvente de la unión
 *    de todos y se aplica la misma a los 40.
 *
 * 2. Aquí sí interesan las piezas sueltas. En el cartel del hero se tiran —son
 *    un trozo de film flotando que parece un error de recorte—, pero en la
 *    secuencia los paneles que entran volando SON el efecto. Así que no se
 *    filtra por banda contigua.
 *
 * 3. El suelo se corta por una línea FIJA, no por la cobertura de cada
 *    fotograma. El reflejo del hormigón sobrevive a la clave por saturación, y
 *    si la línea se recalcula por fotograma sube y baja: la caja acaba
 *    creciendo y encogiendo por abajo mientras se monta.
 */
import { PNG } from 'pngjs';
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const [entrada, salida, sueloRel = '0.92'] = process.argv.slice(2);
if (!entrada || !salida) {
  console.error('uso: secuencia-montaje.mjs <carpetaPNG> <carpetaSalida> [sueloRel]');
  process.exit(1);
}
mkdirSync(salida, { recursive: true });

const ficheros = readdirSync(entrada).filter((f) => f.endsWith('.png')).sort();
if (!ficheros.length) throw new Error('no hay PNG en ' + entrada);

/* Clave por SATURACIÓN. El fondo es hormigón gris —casi sin saturación— y el
   producto es madera cálida o lona azul, los dos saturados.

   ── Un intento fallido, anotado para no repetirlo ──────────────────────────

   Bajo el pallet quedaban grumos del reflejo del suelo. Muestreando el ÚLTIMO
   fotograma salía que el reflejo (brillo 0.30) y la madera (brillo 0.56) se
   separan muy bien por brillo, así que se añadió un segundo factor: saturado
   Y iluminado. En el último fotograma funcionaba.

   Y destrozaba los primeros. Ahí el pallet cae solo, iluminado desde arriba y
   sin nada alrededor que lo sombree: su cara superior es pálida y poco
   saturada, justo lo que ese filtro descarta. El resultado eran tablas con
   agujeros negros y bordes dentados — mucho peor que los grumos que se querían
   quitar.

   La lección no es "el brillo no sirve": es que un umbral medido en UN
   fotograma no vale para una secuencia donde cambia la iluminación. Si se
   vuelve a intentar, tiene que ser adaptativo por fotograma, y hay que mirar
   los fotogramas del PRINCIPIO, no solo el final.

   Mientras tanto, el reflejo se controla con la línea de suelo, que es
   geométrica y no depende de la luz. */
const SAT_BAJO = 0.13;
const SAT_ALTO = 0.27;

/** Clave por saturación + corte de suelo fijo. Devuelve el PNG ya con alfa. */
function clavar(ruta) {
  const png = PNG.sync.read(readFileSync(ruta));
  const { width: W, height: H, data } = png;
  const suelo = Math.round(H * parseFloat(sueloRel));
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4;
      const r = data[i], g = data[i + 1], b = data[i + 2];
      const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
      const sat = mx === 0 ? 0 : (mx - mn) / mx;
      // Rampa suave, nunca un umbral duro: un recorte con borde de escalera es
      // la señal más rápida de que una imagen está pegada.
      let a = Math.max(0, Math.min(1, (sat - SAT_BAJO) / (SAT_ALTO - SAT_BAJO)));
      if (mx / 255 < 0.08) a = 0;           // sombra, no producto
      if (y > suelo) {
        // Desvanecido corto por debajo de la línea de apoyo en vez de un corte
        // seco: un borde recto ahí abajo se lee como una etiqueta pegada.
        a *= Math.max(0, 1 - (y - suelo) / 12);
      }
      data[i + 3] = Math.round(a * 255);
    }
  }
  desmotar(png);
  quitarGrumos(png, 420);
  return png;
}

/**
 * Borra las manchas sueltas por debajo de cierta área.
 *
 * `desmotar` quita el píxel aislado, pero el reflejo del hormigón no deja
 * píxeles sueltos: deja grumos de veinte o treinta juntos, que se sostienen
 * entre ellos y pasan el filtro de vecinos. En una imagen fija son serrín; en
 * la secuencia van cambiando de sitio en cada fotograma y el ojo los sigue.
 *
 * Se etiquetan las regiones conectadas y se tira lo que no llegue al umbral.
 * El umbral está por debajo de la pieza más pequeña que vuela por el aire —los
 * listones del fondo rondan las 3.000— así que no se lleva nada real por
 * delante.
 *
 * La cola es un Int32Array y no un array normal a propósito: son 830.000
 * píxeles por fotograma y 42 fotogramas, y con push/shift esto tarda minutos.
 */
function quitarGrumos(png, minArea) {
  const { width: W, height: H, data } = png;
  const visto = new Uint8Array(W * H);
  const cola = new Int32Array(W * H);
  const region = new Int32Array(W * H);

  const solido = (p) => data[p * 4 + 3] > 110;

  for (let inicio = 0; inicio < W * H; inicio++) {
    if (visto[inicio] || !solido(inicio)) continue;

    let cabeza = 0, fin = 0, n = 0;
    cola[fin++] = inicio;
    visto[inicio] = 1;

    while (cabeza < fin) {
      const p = cola[cabeza++];
      region[n++] = p;
      const x = p % W, y = (p / W) | 0;
      // Cuatro vecinos, no ocho: con ocho, dos grumos que solo se tocan por una
      // esquina cuentan como uno y entre los dos superan el umbral.
      if (x > 0 && !visto[p - 1] && solido(p - 1)) { visto[p - 1] = 1; cola[fin++] = p - 1; }
      if (x < W - 1 && !visto[p + 1] && solido(p + 1)) { visto[p + 1] = 1; cola[fin++] = p + 1; }
      if (y > 0 && !visto[p - W] && solido(p - W)) { visto[p - W] = 1; cola[fin++] = p - W; }
      if (y < H - 1 && !visto[p + W] && solido(p + W)) { visto[p + W] = 1; cola[fin++] = p + W; }
    }

    if (n < minArea) for (let i = 0; i < n; i++) data[region[i] * 4 + 3] = 0;
  }
}

/**
 * Quita las motas sueltas.
 *
 * El reflejo del hormigón y el grano del render dejan píxeles aislados de
 * saturación media que pasan la clave. En una imagen fija no se ven; en una
 * secuencia sí, porque cambian en cada fotograma y el ojo lee ese hormigueo
 * mucho antes que la propia caja. Un píxel que no tiene al menos tres vecinos
 * opacos no es producto: es ruido.
 */
function desmotar(png) {
  const { width: W, height: H, data } = png;
  const original = new Uint8Array(W * H);
  for (let p = 0; p < W * H; p++) original[p] = data[p * 4 + 3];

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const p = y * W + x;
      const a = original[p];
      if (a === 0 || a > 200) continue;      // ni vacío ni claramente producto
      let vecinos = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (!dx && !dy) continue;
          const nx = x + dx, ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
          if (original[ny * W + nx] > 120) vecinos++;
        }
      }
      if (vecinos < 3) data[p * 4 + 3] = 0;
    }
  }
}

// Primera pasada: clavar todo y medir la unión de las cajas envolventes.
const clavados = [];
let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;

const areas = [];
for (const f of ficheros) {
  const png = clavar(join(entrada, f));
  clavados.push(png);
  let opacos = 0;
  for (let i = 3; i < png.data.length; i += 4) if (png.data[i] > 140) opacos++;
  areas.push(opacos);
  const { width: W, height: H, data } = png;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (data[(y * W + x) * 4 + 3] <= 40) continue;
      if (x < x0) x0 = x; if (x > x1) x1 = x;
      if (y < y0) y0 = y; if (y > y1) y1 = y;
    }
  }
}

// El aire se recorta contra los bordes de la imagen. Sin esto la ventana se
// sale del fotograma y la secuencia sale con columnas transparentes pegadas a
// un lado, que en pantalla se ven como un desplazamiento del objeto.
const aire = 6;
const { width: W0, height: H0 } = clavados[0];
x0 = Math.max(0, x0 - aire); y0 = Math.max(0, y0 - aire);
x1 = Math.min(W0 - 1, x1 + aire); y1 = Math.min(H0 - 1, y1 + aire);
const w = x1 - x0 + 1, h = y1 - y0 + 1;

// Segunda pasada: recortar todos con la MISMA ventana.
clavados.forEach((png, i) => {
  const { width: W, data } = png;
  const out = new PNG({ width: w, height: h });
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const sx = x + x0, sy = y + y0;
      const s = (sy * W + sx) * 4, d = (y * w + x) * 4;
      if (sx >= W || sy >= png.height) { out.data[d + 3] = 0; continue; }
      out.data[d] = data[s]; out.data[d + 1] = data[s + 1];
      out.data[d + 2] = data[s + 2]; out.data[d + 3] = data[s + 3];
    }
  }
  writeFileSync(join(salida, `f${String(i).padStart(3, '0')}.png`), PNG.sync.write(out));
});

console.log(`${clavados.length} fotogramas  ${w}x${h}  (ventana común ${x0},${y0})`);

/* GUARDARRAÍL.
   Una clave mal ajustada no falla: se come parte del producto y sigue
   escribiendo ficheros con buena pinta. Ya pasó una vez —las tablas del pallet
   salieron agujereadas en los primeros fotogramas y no se vio hasta tenerlo
   publicado— así que aquí se compara cada fotograma con sus vecinos.

   El área conservada cambia poco a poco a lo largo de una secuencia de
   montaje: crece según se añaden piezas. Un bajón brusco respecto a la
   mediana local no es la animación, es la clave comiéndose algo. */
const mediana = (a) => { const b = [...a].sort((x, y) => x - y); return b[b.length >> 1]; };
const sospechosos = [];
for (let i = 0; i < areas.length; i++) {
  const ventana = areas.slice(Math.max(0, i - 3), i + 4);
  const m = mediana(ventana);
  if (m > 0 && areas[i] < m * 0.72) {
    sospechosos.push(`f${String(i).padStart(3, '0')} (${Math.round(areas[i] / m * 100)}% de sus vecinos)`);
  }
}
if (sospechosos.length) {
  console.warn(`\n  AVISO: ${sospechosos.length} fotograma(s) conservan mucho menos que los de al lado.`);
  console.warn('  Suele significar que la clave se está comiendo parte del producto.');
  console.warn('  Míralos compuestos sobre el fondo oscuro antes de publicar:');
  console.warn('    ' + sospechosos.join('\n    '));
}
