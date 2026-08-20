/**
 * Recorta el producto de un render sobre transparencia.
 *
 *   node scripts/recortar-producto.mjs entrada.png salida.png [satMin] [satMax]
 *
 * La clave va por SATURACIÓN, no por brillo. El fondo de estos renders es
 * hormigón gris —casi sin saturación— y el producto es madera cálida o film
 * azul, los dos muy saturados. Una clave por luminancia fallaría: la sombra de
 * la caja es tan oscura como la pared, y el reflejo del suelo tan claro como
 * la tapa.
 *
 * El borde se suaviza con una rampa en vez de un umbral duro. Un recorte con
 * borde de escalera es la señal más rápida de que una imagen está pegada.
 */
import { PNG } from 'pngjs';
import { readFileSync, writeFileSync } from 'node:fs';

const [entrada, salida, satMin = '0.16', satMax = '0.30'] = process.argv.slice(2);
if (!entrada || !salida) {
  console.error('uso: recortar-producto.mjs entrada.png salida.png [satMin] [satMax]');
  process.exit(1);
}

const png = PNG.sync.read(readFileSync(entrada));
const { width: W, height: H, data } = png;

const bajo = parseFloat(satMin);
const alto = parseFloat(satMax);

let guardados = 0;

for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const i = (y * W + x) * 4;
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
    const sat = mx === 0 ? 0 : (mx - mn) / mx;
    const val = mx / 255;

    // Rampa suave entre los dos umbrales.
    let a = (sat - bajo) / (alto - bajo);
    a = Math.max(0, Math.min(1, a));
    // Lo muy oscuro se descarta pase lo que pase: es sombra, no producto.
    if (val < 0.08) a = 0;

    data[i + 3] = Math.round(a * 255);
    if (a > 0.5) guardados++;
  }
}

/* El reflejo del suelo sobrevive a la clave: es el mismo azul, más apagado.
   Se corta por la línea de apoyo, que se detecta por cobertura: la base del
   producto es la última fila ancha, y por debajo solo quedan restos estrechos
   y salteados del reflejo. */
const cobertura = new Array(H).fill(0);
for (let y = 0; y < H; y++) {
  let n = 0;
  for (let x = 0; x < W; x++) if (data[(y * W + x) * 4 + 3] > 128) n++;
  cobertura[y] = n;
}
const maxCob = Math.max(...cobertura);
let base = H - 1;
for (let y = H - 1; y >= 0; y--) {
  if (cobertura[y] > maxCob * 0.45) { base = y; break; }
}
// Un desvanecido corto justo por debajo, para que el corte no sea una línea.
const desvanecido = 10;
for (let y = 0; y < H; y++) {
  if (y <= base) continue;
  const k = Math.max(0, 1 - (y - base) / desvanecido);
  for (let x = 0; x < W; x++) {
    const i = (y * W + x) * 4 + 3;
    data[i] = Math.round(data[i] * k);
  }
}

// Recorte al contenido, con un poco de aire. Se mide AHORA, después de haber
// quitado el reflejo, o la caja resultante llevaría dentro el suelo entero.
let x0 = W, x1 = 0, y0 = H, y1 = 0;
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    if (data[(y * W + x) * 4 + 3] <= 128) continue;
    if (x < x0) x0 = x; if (x > x1) x1 = x;
    if (y < y0) y0 = y; if (y > y1) y1 = y;
  }
}
const aire = 8;
x0 = Math.max(0, x0 - aire); y0 = Math.max(0, y0 - aire);
x1 = Math.min(W - 1, x1 + aire); y1 = Math.min(H - 1, y1 + aire);
const w = x1 - x0 + 1, h = y1 - y0 + 1;

const out = new PNG({ width: w, height: h });
for (let y = 0; y < h; y++) {
  for (let x = 0; x < w; x++) {
    const s = ((y + y0) * W + (x + x0)) * 4;
    const d = (y * w + x) * 4;
    out.data[d] = data[s];
    out.data[d + 1] = data[s + 1];
    out.data[d + 2] = data[s + 2];
    out.data[d + 3] = data[s + 3];
  }
}
writeFileSync(salida, PNG.sync.write(out));
console.log(`${salida}  ${w}x${h}  ${(guardados / (W * H) * 100).toFixed(1)}% del cuadro`);
