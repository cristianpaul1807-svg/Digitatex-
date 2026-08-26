/**
 * Empaqueta la página de Fidenza en un solo archivo, sin nada externo.
 *
 *   node scripts/empaquetar-viaje.mjs [salida.html]
 *
 * Para qué: enseñar la página sin servidor —abriéndola con doble clic, o
 * publicándola donde solo se admite un HTML suelto—. Con `file://` no hay
 * origen desde el que pedir los 42 fotogramas, las dos tipografías ni los dos
 * recortes del producto, así que van todos dentro como data URI.
 *
 * Sale en el formato que espera un Artifact: sin <!doctype>, sin <html>, sin
 * <head> y sin <body>, porque eso lo pone el contenedor. Solo el título, los
 * estilos, el contenido y el script.
 *
 * ── El detalle que rompe esto si se hace mal ───────────────────────────────
 *
 * Dos, y los dos ya han mordido antes:
 *
 * 1. `String.replace` con una CADENA de reemplazo interpreta `$&`, `$1`… y el
 *    JavaScript compilado está lleno de esos símbolos. Aquí siempre se pasa una
 *    FUNCIÓN, que no interpreta nada.
 *
 * 2. El analizador de HTML sale del modo script en cuanto ve `</script`
 *    seguido de espacio, `>` o `/`. Si esa secuencia aparece dentro del código
 *    —dentro de una cadena, por ejemplo— el resto de la página se pinta como
 *    texto. Se escapa la barra.
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

// dist-viaje y no dist: esa compilación lleva todo el JavaScript en un solo
// bundle (ver vite.config.viaje.ts). En la normal, GSAP vive en un trozo
// compartido con el catálogo, y un archivo suelto no puede ir a buscarlo.
const DIST = new URL('../dist-viaje/', import.meta.url);
const salida = process.argv[2] ?? 'viaje-un-archivo.html';

const ruta = (p) => new URL(p, DIST);
const leer = (p) => readFileSync(ruta(p));
const texto = (p) => leer(p).toString('utf8');

const TIPOS = {
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
};
const dataUri = (p) => {
  const ext = p.slice(p.lastIndexOf('.'));
  const tipo = TIPOS[ext];
  if (!tipo) throw new Error('tipo desconocido: ' + p);
  return `data:${tipo};base64,${leer(p).toString('base64')}`;
};

const html = texto('viaje.html');

/* ── estilos ───────────────────────────────────────────────────────────── */

const cssRef = /<link[^>]+href="\.\/(assets\/[^"]+\.css)"[^>]*>/.exec(html);
if (!cssRef) throw new Error('no encuentro la hoja de estilos en dist/viaje.html');
let css = texto(cssRef[1]);

// Las url(../fuentes/x.woff2) del CSS son relativas a assets/, que es donde
// vive la hoja. Se resuelven contra esa carpeta antes de incrustarlas.
css = css.replace(/url\(\.\.\/([^)"']+)\)/g, (_m, p) => `url(${dataUri(p)})`);

/* ── script ────────────────────────────────────────────────────────────── */

const jsRef = /<script[^>]+src="\.\/(assets\/[^"]+\.js)"[^>]*><\/script>/.exec(html);
if (!jsRef) throw new Error('no encuentro el script en dist-viaje/viaje.html');
const js = texto(jsRef[1]);

// Un único bundle, sin imports pendientes. Si aparece alguno es que el build
// se ha hecho con la configuración equivocada, y conviene enterarse aquí y no
// al abrir el fichero.
if (/\bimport\s*[{*]|\bfrom\s*["']\.\//.test(js)) {
  throw new Error('el bundle todavía importa otros ficheros: compila con vite.config.viaje.ts');
}

/* ── el cuerpo ─────────────────────────────────────────────────────────── */

let cuerpo = /<body[^>]*>([\s\S]*)<\/body>/.exec(html)[1];
cuerpo = cuerpo.replace(cssRef[0], () => '');
cuerpo = cuerpo.replace(jsRef[0], () => '');
// Las precargas apuntan a ficheros que ya no existen aparte.
cuerpo = cuerpo.replace(/<link[^>]+rel="(?:preload|modulepreload)"[^>]*>/g, () => '');
// Los dos recortes del producto, a data URI.
cuerpo = cuerpo.replace(/src="\.\/(fidenza\/[^"]+)"/g, (_m, p) => `src="${dataUri(p)}"`);

/* ── los 42 fotogramas ─────────────────────────────────────────────────── */

const dirSeq = 'fidenza/montaggio';
const cuadros = readdirSync(ruta(dirSeq))
  .filter((f) => f.endsWith('.webp'))
  .sort()
  .map((f) => dataUri(join(dirSeq, f)));

/* ── montaje ───────────────────────────────────────────────────────────── */

const escapar = (s) => s.replace(/<\/script/gi, () => '<\\/script');

const doc = `<title>Fidenza Casse su Misura</title>
<style>${css}</style>
${cuerpo}
<script>window.__MONTAGGIO__=${escapar(JSON.stringify(cuadros))}</script>
<script type="module">${escapar(js)}</script>
`;

writeFileSync(salida, doc);
const mb = (Buffer.byteLength(doc) / 1024 / 1024).toFixed(2);
console.log(`${salida}  ${mb} MB  (${cuadros.length} fotogramas incrustados)`);
