/**
 * Empaqueta la web en UN SOLO archivo para enseñarla sin desplegar.
 *
 *   node empaquetar.mjs [salida.html]
 *
 * Con `file://` no hay origen desde el que pedir la hoja de estilos, el guion,
 * las fotos ni el vídeo, así que entra todo dentro.
 *
 * El vídeo entra en la versión ligera (540 de ancho en vez de 720). Aquí no se
 * sirve por trozos: el archivo suelto no empieza a verse hasta que ha llegado
 * entero, y la diferencia entre siete megas y tres es la diferencia entre que
 * lo abra o cierre la pestaña.
 *
 * Y entra como Blob, no como `src="data:…"`: Safari ha sido históricamente
 * caprichoso buscando dentro de un vídeo en data URI, y buscar es lo ÚNICO
 * que este vídeo hace. Si el Blob no pasa —hay contenedores que no lo admiten
 * y entonces el vídeo no falla, simplemente no aparece nunca— se reintenta con
 * el data URI.
 *
 * Dos trampas que ya han mordido en otros empaquetados:
 *
 * 1. `String.replace` con una CADENA interpreta `$&`, `$1`… y el JavaScript de
 *    la página está lleno de esos símbolos. Aquí siempre se pasa una FUNCIÓN.
 * 2. El analizador de HTML sale del modo script en cuanto ve la etiqueta de
 *    cierre, aunque vaya dentro de una cadena. Se escapa.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const salida = process.argv[2] ?? 'calzetti-un-archivo.html';
const aqui = (p) => new URL(p, import.meta.url);

const TIPOS = { '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg' };
const dataUri = (p) => {
  const tipo = TIPOS[p.slice(p.lastIndexOf('.'))];
  if (!tipo) throw new Error('tipo desconocido: ' + p);
  return `data:${tipo};base64,${readFileSync(aqui(p)).toString('base64')}`;
};

const s = readFileSync(aqui('index.html'), 'utf8');
const fuentes = [...s.matchAll(/<link[^>]+fonts\.(?:googleapis|gstatic)\.com[^>]*>/g)].map((m) => m[0]);
const estilos = readFileSync(aqui('stile.css'), 'utf8');
const comun = readFileSync(aqui('comune.js'), 'utf8');
let cuerpo = /<body[^>]*>([\s\S]*?)<\/body>/.exec(s)[1];

const guiones = [...cuerpo.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)];
const js = guiones[guiones.length - 1][1];
guiones.forEach((g) => { cuerpo = cuerpo.replace(g[0], () => ''); });

const antes = cuerpo;
cuerpo = cuerpo.replace(/<script[^>]+src="comune\.js"[^>]*><\/script>\s*/g, () => '');
if (cuerpo === antes) throw new Error('no encuentro la etiqueta de comune.js: revisa el index');

// Imágenes a data URI, estén en src o en poster.
cuerpo = cuerpo.replace(/(src|poster)="(media\/[^"]+\.(?:webp|png))"/g, (_m, at, p) => `${at}="${dataUri(p)}"`);

// La fuente del vídeo se quita: la pone el guion de abajo, como Blob.
const antesVideo = cuerpo;
cuerpo = cuerpo.replace(/\s*<source src="media\/lavaggio\.mp4"[^>]*>/g, () => '');
if (cuerpo === antesVideo) throw new Error('no encuentro la fuente del vídeo');

// El enlace a la página de reseñas no lleva a ninguna parte dentro del archivo
// suelto. Se desactiva con una explicación en vez de dejar un botón muerto.
cuerpo = cuerpo.replace(/href="recensioni\/"/g, () => 'href="#recensioni" data-suelto="1"');

const videoB64 = readFileSync(aqui('media/lavaggio-ligero.mp4')).toString('base64');

const guionVideo = `
(function(){
  var v = document.getElementById('hero-video');
  var d = document.getElementById('mon-datos');
  if(!v || !d) return;
  var b64 = d.textContent.replace(/\\s+/g, '');
  var plan = 0;
  function conBlob(){
    var cruda = atob(b64);
    var bytes = new Uint8Array(cruda.length);
    for(var i=0;i<cruda.length;i++) bytes[i] = cruda.charCodeAt(i);
    v.src = URL.createObjectURL(new Blob([bytes], {type:'video/mp4'}));
    v.load();
  }
  function conDatos(){ v.src = 'data:video/mp4;base64,' + b64; v.load(); }
  v.addEventListener('error', function(){ if(plan === 0){ plan = 1; conDatos(); } });
  v.addEventListener('loadedmetadata', function(){ d.textContent = ''; });
  try{ conBlob(); }catch(e){ plan = 1; conDatos(); }
})();`;

const escapar = (t) => t.replace(/<\/script/gi, () => '<\\/script');

/* El base64 va en un <script> con un tipo que el navegador no ejecuta: es la
   forma de meter tres megas de texto sin que el analizador de HTML se ponga a
   buscar etiquetas dentro. El alfabeto de base64 no contiene `<`. */
const doc = `<title>Autolavaggio Calzetti</title>
${fuentes.join('\n')}
<style>${estilos}</style>
${cuerpo}
<script type="application/octet-stream" id="mon-datos">${videoB64}</script>
<script>${escapar(comun)}</script>
<script>${guionVideo}</script>
<script>${escapar(js)}</script>
`;

writeFileSync(salida, doc);
console.log(`${salida}  ${(Buffer.byteLength(doc) / 1024 / 1024).toFixed(2)} MB`);
