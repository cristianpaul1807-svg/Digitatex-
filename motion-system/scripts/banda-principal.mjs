/**
 * Se queda con la banda vertical MÁS ALTA de contenido y tira lo demás.
 *
 *   node scripts/banda-principal.mjs entrada.png salida.png
 *
 * En los fotogramas del montaje, la lámina de film todavía flota por encima de
 * la caja. Sobrevive a la clave por saturación —es el mismo azul— pero es un
 * trozo suelto, y en un cartel se leería como un error de recorte. Entre ella y
 * la caja hay una franja de filas completamente vacías, así que basta con
 * quedarse con el bloque de filas contiguas más alto.
 *
 * Va después de recortar-producto.mjs, nunca antes: necesita el alfa ya puesto.
 */
import { PNG } from 'pngjs';
import { readFileSync, writeFileSync } from 'node:fs';

const [entrada, salida] = process.argv.slice(2);
if (!entrada || !salida) {
  console.error('uso: banda-principal.mjs entrada.png salida.png');
  process.exit(1);
}

const png = PNG.sync.read(readFileSync(entrada));
const { width: W, height: H, data } = png;

// Una fila cuenta como llena con muy poco: el 2% del ancho. El umbral solo
// tiene que distinguir "hay producto" de "no hay nada", no medir nada.
const llena = [];
for (let y = 0; y < H; y++) {
  let n = 0;
  for (let x = 0; x < W; x++) if (data[(y * W + x) * 4 + 3] > 128) n++;
  llena.push(n > W * 0.02);
}

let mejor = null, actual = null;
for (let y = 0; y <= H; y++) {
  if (y < H && llena[y]) { if (!actual) actual = { a: y, b: y }; else actual.b = y; }
  else if (actual) {
    if (!mejor || actual.b - actual.a > mejor.b - mejor.a) mejor = actual;
    actual = null;
  }
}
if (!mejor) throw new Error('la imagen no tiene ningún píxel opaco');

for (let y = 0; y < H; y++) {
  if (y >= mejor.a && y <= mejor.b) continue;
  for (let x = 0; x < W; x++) data[(y * W + x) * 4 + 3] = 0;
}

// Recorte al contenido que queda.
let x0 = W, x1 = 0;
for (let y = mejor.a; y <= mejor.b; y++) {
  for (let x = 0; x < W; x++) {
    if (data[(y * W + x) * 4 + 3] <= 128) continue;
    if (x < x0) x0 = x; if (x > x1) x1 = x;
  }
}
const aire = 6;
x0 = Math.max(0, x0 - aire); x1 = Math.min(W - 1, x1 + aire);
const y0 = Math.max(0, mejor.a - aire), y1 = Math.min(H - 1, mejor.b + aire);
const w = x1 - x0 + 1, h = y1 - y0 + 1;

const out = new PNG({ width: w, height: h });
for (let y = 0; y < h; y++) {
  for (let x = 0; x < w; x++) {
    const s = ((y + y0) * W + (x + x0)) * 4, d = (y * w + x) * 4;
    out.data[d] = data[s]; out.data[d + 1] = data[s + 1];
    out.data[d + 2] = data[s + 2]; out.data[d + 3] = data[s + 3];
  }
}
writeFileSync(salida, PNG.sync.write(out));
console.log(`${salida}  ${w}x${h}`);
