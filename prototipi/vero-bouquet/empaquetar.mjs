/**
 * Empaqueta el prototipo en un solo archivo, sin nada externo salvo las
 * tipografías de Google.
 *
 *   node empaquetar.mjs [salida.html]
 *
 * Con `file://` no hay origen desde el que pedir el vídeo ni las diez
 * imágenes, así que van todos dentro.
 *
 * Sale en el formato que espera un Artifact: sin <!doctype>, sin html, sin
 * head y sin body — eso lo pone el contenedor.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const salida = process.argv[2] ?? 'vero-bouquet-un-archivo.html';
const aqui = (p) => new URL(p, import.meta.url);

const TIPOS = { '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png' };
const dataUri = (p) => {
  const tipo = TIPOS[p.slice(p.lastIndexOf('.'))];
  if (!tipo) throw new Error('tipo desconocido: ' + p);
  return `data:${tipo};base64,${readFileSync(aqui(p)).toString('base64')}`;
};

let s = readFileSync(aqui('index.html'), 'utf8');

const fuentes = [...s.matchAll(/<link[^>]+fonts\.(?:googleapis|gstatic)\.com[^>]*>/g)].map((m) => m[0]);
const estilos = /<style>([\s\S]*?)<\/style>/.exec(s)[1];
let cuerpo = /<body[^>]*>([\s\S]*?)<\/body>/.exec(s)[1];

const guiones = [...cuerpo.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)];
const js = guiones[guiones.length - 1][1];
guiones.forEach((g) => { cuerpo = cuerpo.replace(g[0], () => ''); });

/* El vídeo va por Blob, no como data URI: los navegadores piden el medio por
   rangos y el soporte de <video> con `data:` es irregular. Un `blob:` se
   comporta como un recurso normal. El arranque lo monta antes de que corra el
   guion de la página. */
const videoB64 = readFileSync(aqui('media/hero.mp4')).toString('base64');
cuerpo = cuerpo.replace(/<source[^>]+media\/hero\.mp4[^>]*>/g, () => '');

// Todo lo que sea imagen de media/ pasa a data URI, esté en src o en poster.
cuerpo = cuerpo.replace(/(src|poster)="(media\/[^"]+\.webp)"/g, (_m, at, p) => `${at}="${dataUri(p)}"`);

const escapar = (t) => t.replace(/<\/script/gi, () => '<\\/script');

const arranque = `
(function(){
  var b = atob(window.__VIDEO__), n = b.length, a = new Uint8Array(n);
  for (var i = 0; i < n; i++) a[i] = b.charCodeAt(i);
  var v = document.getElementById('film');
  if (v) { v.src = URL.createObjectURL(new Blob([a], {type:'video/mp4'})); v.load(); }
  delete window.__VIDEO__;
})();`;

const doc = `<title>Vero Bouquet</title>
${fuentes.join('\n')}
<style>${estilos}</style>
${cuerpo}
<script>window.__VIDEO__=${JSON.stringify(videoB64)}</script>
<script>${arranque}</script>
<script>${escapar(js)}</script>
`;

writeFileSync(salida, doc);
console.log(`${salida}  ${(Buffer.byteLength(doc) / 1024 / 1024).toFixed(2)} MB`);
