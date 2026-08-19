/**
 * Collapses the single-file build into one self-contained .html.
 *
 * Inlines the stylesheet, inlines the bundle, and turns every media reference
 * into a data URI. The result opens from a local disk with no server, no
 * network and no build step — which is the only way to hand somebody a
 * scroll-driven site and have them actually be able to look at it.
 *
 * The webfonts are inlined too, as base64 woff2, latin subset only. A file that
 * still fetches its typography from a CDN is not self-contained — and the panel
 * this tends to be viewed in blocks external requests, so without this the whole
 * showcase falls back to Georgia.
 *
 * Two things this cannot carry, both by design:
 *  - HLS. A manifest is a playlist of separate segment files; there is nothing
 *    for it to point at inside one document. The build aliases hls.js to a stub
 *    and the video plays from the inlined progressive sources instead.
 *  - Range requests. A data: URI is not seekable the way an HTTP resource with
 *    206 responses is, so the scroll-scrubbed video demo is the one thing that
 *    behaves better from a real server than from this file.
 *
 * Run:  node scripts/build-single-file.mjs
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist-single');

const MIME = {
  '.webm': 'video/webm', '.mp4': 'video/mp4', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml',
};

let html = readFileSync(join(dist, 'index.html'), 'utf8');

// 1 · webfonts: la etiqueta a Google Fonts se sustituye por las mismas familias
//     incrustadas en base64, para que el archivo no dependa de la red.
const fontCss = readFileSync(join(root, 'src/single-file/fonts-latin.css'), 'utf8');
html = html
  .replace(/<link rel="preconnect"[^>]*>/g, '')
  .replace(/<link\s+href="https:\/\/fonts\.googleapis\.com[^>]*>/, () => `<style>\n${fontCss}\n</style>`);

// 2 · stylesheet
const cssHref = html.match(/<link rel="stylesheet" crossorigin href="([^"]+)">/);
if (cssHref) {
  const css = readFileSync(join(dist, cssHref[1].replace('./', '')), 'utf8');
  // Funcion de reemplazo, no cadena: ver el comentario del bundle mas abajo.
  html = html.replace(cssHref[0], () => `<style>\n${css}\n</style>`);
}

// 3 · bundle, with every media path swapped for a data URI first
const jsSrc = html.match(/<script type="module" crossorigin src="([^"]+)"><\/script>/);
let js = readFileSync(join(dist, jsSrc[1].replace('./', '')), 'utf8');

const mediaDir = join(root, 'public/media');
let inlined = 0;
let bytes = 0;
for (const name of readdirSync(mediaDir)) {
  const file = join(mediaDir, name);
  if (statSync(file).isDirectory()) continue;      // la carpeta hls no se usa aqui
  const mime = MIME[extname(name)];
  if (!mime) continue;
  const uri = `data:${mime};base64,${readFileSync(file).toString('base64')}`;
  const needle = `media/${name}`;
  if (!js.includes(needle)) continue;
  js = js.split(`"${needle}"`).join(JSON.stringify(uri));
  inlined += 1;
  bytes += statSync(file).size;
}

// El parser de HTML sale del modo script en cuanto ve `</script` seguido de
// espacio, `>` o `/` — no hace falta la etiqueta completa. El bundle minificado
// de React contiene varios `"</script"` sueltos, y cada uno cortaba el script a
// la mitad: la pagina acababa mostrando el codigo como texto. Se escapan todos,
// mas `<!--`, que tambien cambia el estado del parser.
js = js.replace(/<\/(script)/gi, '<\\/$1').replace(/<!--/g, '<\\u0021--');
// El reemplazo va como FUNCION y no como cadena. `String.replace` interpreta
// `$&` dentro de la cadena de reemplazo y lo sustituye por lo que acaba de
// encontrar — y el bundle minificado usa `$` en los nombres de variable, asi
// que aparecian secuencias `$&` sueltas. El resultado fue que la etiqueta
// `<script src=...></script>` original quedo inyectada diez veces dentro del
// propio codigo, cortando el script y dejando la pagina como texto plano.
html = html.replace(jsSrc[0], () => `<script type="module">\n${js}\n</script>`);

// 4 · una nota para quien abra el archivo sin contexto
html = html.replace(
  '</head>',
  `<!--
  Digitatex Motion System — showcase autocontenido.
  Un solo archivo: CSS, JavaScript y medios incrustados. Se abre desde el disco,
  sin servidor. La version completa vive en el repositorio, en motion-system/.
-->
</head>`,
);

const out = join(root, 'motion-system-showcase.html');
writeFileSync(out, html);

const mb = (n) => (n / 1024 / 1024).toFixed(2) + ' MB';
console.log(`escrito ${out}`);
console.log(`  ${inlined} archivos de medios incrustados (${mb(bytes)} en origen)`);
console.log(`  tamano final: ${mb(Buffer.byteLength(html))}`);
