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
      let a = (sat - SAT_BAJO) / (SAT_ALTO - SAT_BAJO);
      a = Math.max(0, Math.min(1, a));
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
  return png;
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

for (const f of ficheros) {
  const png = clavar(join(entrada, f));
  clavados.push(png);
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
