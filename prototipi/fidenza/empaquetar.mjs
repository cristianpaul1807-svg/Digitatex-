/**
 * Empaqueta el prototipo en un solo archivo, sin nada externo salvo las
 * tipografías de Google.
 *
 *   node empaquetar.mjs [salida.html]
 *
 * Para qué: enseñárselo al cliente sin desplegar, o publicarlo donde solo se
 * admite un HTML suelto. Con `file://` no hay origen desde el que pedir el
 * vídeo, el fondo ni los 42 fotogramas del montaje, así que van todos dentro
 * como data URI.
 *
 * Sale en el formato que espera un Artifact: sin <!doctype>, sin html, sin
 * head y sin body — eso lo pone el contenedor.
 *
 * Dos detalles que rompen esto si se hacen mal, y los dos ya han mordido:
 *
 * 1. `String.replace` con una CADENA de reemplazo interpreta `$&`, `$1`… y el
 *    JavaScript de la página está lleno de esos símbolos. Aquí siempre se pasa
 *    una FUNCIÓN, que no interpreta nada.
 *
 * 2. El analizador de HTML sale del modo script en cuanto ve la etiqueta de
 *    cierre, aunque vaya dentro de una cadena o de un comentario. Se comprueba
 *    y se escapa.
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';

const salida = process.argv[2] ?? 'prototipo-un-archivo.html';
const aqui = (p) => new URL(p, import.meta.url);

const TIPOS = { '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png', '.mp4': 'video/mp4' };
const dataUri = (p) => {
  const tipo = TIPOS[p.slice(p.lastIndexOf('.'))];
  if (!tipo) throw new Error('tipo desconocido: ' + p);
  return `data:${tipo};base64,${readFileSync(aqui(p)).toString('base64')}`;
};

let s = readFileSync(aqui('index.html'), 'utf8');

/* El <head> aporta el título y las tipografías; el resto son metadatos que en
   un archivo suelto no pintan nada. */
const titulo = /<title>([\s\S]*?)<\/title>/.exec(s)?.[1] ?? 'Fidenza Service';
const fuentes = [...s.matchAll(/<link[^>]+fonts\.(?:googleapis|gstatic)\.com[^>]*>/g)].map((m) => m[0]);
const estilos = /<style>([\s\S]*?)<\/style>/.exec(s)[1];

let cuerpo = /<body[^>]*>([\s\S]*?)<\/body>/.exec(s)[1];
const guion = [...cuerpo.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)];
// El primero es el JSON-LD, que no se ejecuta; el segundo es el de la página.
const js = guion[guion.length - 1][1];
guion.forEach((g) => { cuerpo = cuerpo.replace(g[0], () => ''); });

/* El vídeo va por Blob, no como data URI.
   El motivo es que los navegadores piden el medio por rangos, y una URL
   `data:` no los admite: el soporte de <video> con data: es irregular, y
   cuando falla lo hace en silencio — networkState=3 y duration=NaN, sin
   error en consola. Un `blob:` se comporta como un recurso normal.

   AVISO PARA QUIEN VERIFIQUE ESTO: el navegador sin interfaz con el que se
   prueba aquí NO trae H.264 (canPlayType de avc1 devuelve cadena vacía), así
   que el vídeo del hero da error 4 tanto en el paquete como servido por HTTP.
   Eso NO dice nada sobre el paquete: la secuencia de la caja, que va en WebP,
   sí se comprueba. El vídeo hay que mirarlo en un navegador de verdad. */
const videoB64 = readFileSync(aqui('hero-imballaggio.mp4')).toString('base64');
cuerpo = cuerpo.replace(/<source[^>]+hero-imballaggio\.mp4[^>]*>/g, () => '');
const fondo = estilos.includes('sfondo.jpg')
  ? estilos.replace(/url\((['"]?)sfondo\.jpg\1\)/g, () => `url(${dataUri('sfondo.jpg')})`)
  : estilos;

const cuadros = readdirSync(aqui('montaggio'))
  .filter((f) => f.endsWith('.webp'))
  .sort()
  .map((f) => dataUri('montaggio/' + f));

/* La secuencia se pide por nombre de fichero dentro del guion. Con los
   fotogramas dentro no hay fichero que pedir, así que se sustituye la
   construcción de la ruta por una consulta a la lista incrustada. */
const jsFinal = js.replace(
  "img.src = 'montaggio/f' + String(i).padStart(3, '0') + '.webp';",
  () => 'img.src = window.__CUADROS__ ? window.__CUADROS__[i] : ' +
        "'montaggio/f' + String(i).padStart(3, '0') + '.webp';",
);
if (jsFinal === js) throw new Error('no he podido enganchar los fotogramas incrustados');

const escapar = (t) => t.replace(/<\/script/gi, () => '<\\/script');

const arranque = `
(function(){
  var b = atob(window.__VIDEO__), n = b.length, a = new Uint8Array(n);
  for (var i = 0; i < n; i++) a[i] = b.charCodeAt(i);
  var v = document.getElementById('renov-film');
  if (v) { v.src = URL.createObjectURL(new Blob([a], {type:'video/mp4'})); v.load(); }
  delete window.__VIDEO__;
})();`;

const doc = `<title>${titulo}</title>
${fuentes.join('\n')}
<style>${fondo}</style>
${cuerpo}
<script>window.__VIDEO__=${JSON.stringify(videoB64)};window.__CUADROS__=${escapar(JSON.stringify(cuadros))}</script>
<script>${arranque}</script>
<script>${escapar(jsFinal)}</script>
`;

writeFileSync(salida, doc);
console.log(`${salida}  ${(Buffer.byteLength(doc) / 1024 / 1024).toFixed(2)} MB  (${cuadros.length} fotogramas + vídeo incrustados)`);
