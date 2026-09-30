/**
 * Empaqueta la PORTADA en un solo archivo, sin nada externo salvo las
 * tipografías de Google.
 *
 *   node empaquetar.mjs [salida.html]
 *
 * Para qué: enseñarla sin desplegar, o publicarla donde solo se admite un HTML
 * suelto. Con `file://` no hay origen desde el que pedir la hoja de estilos, el
 * guion ni las imágenes, así que entran todos dentro.
 *
 * Sale en el formato que espera un Artifact: sin <!doctype>, sin html, sin head
 * y sin body — eso lo pone el contenedor.
 *
 * Las páginas interiores NO entran: son nueve y el archivo se iría a decenas de
 * megas. Sus enlaces se reescriben a la dirección publicada, que sí existe, en
 * vez de quedarse en rutas relativas que dentro del archivo único no llevan a
 * ninguna parte.
 *
 * Dos detalles que rompen esto si se hacen mal, y los dos ya han mordido:
 *
 * 1. `String.replace` con una CADENA de reemplazo interpreta `$&`, `$1`… y el
 *    JavaScript de la página está lleno de esos símbolos. Aquí siempre se pasa
 *    una FUNCIÓN, que no interpreta nada.
 *
 * 2. El analizador de HTML sale del modo script en cuanto ve la etiqueta de
 *    cierre, aunque vaya dentro de una cadena o de un comentario. Se escapa.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const salida = process.argv[2] ?? 'alemagia-un-archivo.html';
const aqui = (p) => new URL(p, import.meta.url);
const PUBLICADO = 'https://digitatex.com/prototipi/alemagia/';

const TIPOS = { '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png' };
const dataUri = (p) => {
  const tipo = TIPOS[p.slice(p.lastIndexOf('.'))];
  if (!tipo) throw new Error('tipo desconocido: ' + p);
  return `data:${tipo};base64,${readFileSync(aqui(p)).toString('base64')}`;
};

const s = readFileSync(aqui('index.html'), 'utf8');

const fuentes = [...s.matchAll(/<link[^>]+fonts\.(?:googleapis|gstatic)\.com[^>]*>/g)].map((m) => m[0]);
/* El título del index es el de Google —una frase con la ciudad y el servicio—
   y ahí está bien. Aquí no: este archivo se publica como una tarjeta con su
   nombre debajo, y una frase de once palabras en ese sitio se lee como un
   error. El de buscador se queda en la página desplegada, que es la que Google
   mira; esto es una copia para enseñar. */
const titulo = 'ALEmagia';
const estilos = readFileSync(aqui('stile.css'), 'utf8');
let cuerpo = /<body[^>]*>([\s\S]*?)<\/body>/.exec(s)[1];

const guiones = [...cuerpo.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)];
const js = guiones[guiones.length - 1][1];
guiones.forEach((g) => { cuerpo = cuerpo.replace(g[0], () => ''); });

/* comune.js entra ENTERO y ANTES del guion de la portada, porque la portada
   llama a funciones suyas: si el orden se invierte, el archivo único arranca
   con «aplicaPaleta is not defined» y no se mueve nada. */
const comun = readFileSync(aqui('comune.js'), 'utf8');
const antes = cuerpo;
cuerpo = cuerpo.replace(/<script[^>]+src="comune\.js"[^>]*><\/script>\s*/g, () => '');
if (cuerpo === antes) throw new Error('no he encontrado la etiqueta de comune.js: revisa el index antes de empaquetar');

// Todo lo que sea imagen de media/ pasa a data URI, esté en src o en poster.
cuerpo = cuerpo.replace(/(src|poster)="(media\/[^"]+\.webp)"/g, (_m, at, p) => `${at}="${dataUri(p)}"`);

/* ---------------------------------------------------------------------------
   EL VÍDEO DEL MONTAJE
   Entra en versión ligera —960 de ancho en vez de 1280— porque aquí no se
   sirve por trozos: el archivo suelto no empieza a verse hasta que ha llegado
   ENTERO, y la diferencia entre 4,9 y 2,2 megas es la diferencia entre que la
   persona a la que se lo mandas lo abra o cierre la pestaña. En el servidor se
   queda el de 1280, que sí se sirve por trozos y se ve mejor.

   No se pone como `src="data:…"`: Safari ha sido históricamente caprichoso
   buscando dentro de un vídeo en data URI, y buscar es LO ÚNICO que este vídeo
   hace. Va como Blob, que es un origen normal para el buscador del navegador.

   El guion se escribe ANTES que el de la portada porque `montaje()` lee la
   duración: si la fuente no está puesta cuando arranca, no hay duración que
   leer y la ancheta no se mueve.
   --------------------------------------------------------------------------- */
const VIDEO = 'media/montaje-ligero.mp4';
const videoB64 = readFileSync(aqui(VIDEO)).toString('base64');
const antesVideo = cuerpo;
cuerpo = cuerpo.replace(/\s*<source src="media\/montaje\.mp4"[^>]*>/g, () => '');
if (cuerpo === antesVideo) throw new Error('no he encontrado la fuente del vídeo del montaje');

/* Se intenta primero como Blob, que es lo que mejor se busca. Pero un Blob vive
   en un origen `blob:` y hay contenedores que no lo dejan pasar en `media-src`:
   ahí el vídeo no falla con estruendo, simplemente no aparece nunca. Por eso, si
   salta el `error` del elemento, se reintenta con el data URI —peor buscando,
   pero de origen normal— antes de darse por vencido. Un archivo suelto se manda
   por ahí y se abre en sitios que uno no controla; que se vea es más importante
   que que se busque fino. */
const guionVideo = `
(function(){
  var v = document.getElementById('mon-video');
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
  function conDatos(){
    v.src = 'data:video/mp4;base64,' + b64;
    v.load();
  }
  v.addEventListener('error', function(){
    if(plan === 0){ plan = 1; conDatos(); }
  });
  v.addEventListener('loadedmetadata', function(){
    d.textContent = '';   // ya cargó: fuera los megas de texto del documento
  });
  try{ conBlob(); }catch(e){ plan = 1; conDatos(); }
})();`;

/* Los enlaces a las páginas interiores se vuelven absolutos. Dentro del archivo
   único una ruta como `anchetas/` no lleva a ninguna parte; apuntando a la
   dirección publicada, el que mire el archivo suelto puede seguir navegando. */
cuerpo = cuerpo.replace(/href="((?!https?:|#|mailto:|tel:)[a-z0-9-]+\/)"/g, (_m, r) => `href="${PUBLICADO}${r}"`);

const escapar = (t) => t.replace(/<\/script/gi, () => '<\\/script');

/* El base64 va en un <script> con un tipo que el navegador no ejecuta: es la
   forma de meter tres megas de texto en la página sin que el analizador de
   HTML se ponga a buscar etiquetas dentro. El alfabeto de base64 no contiene
   `<`, así que no hay nada que escapar. */
const doc = `<title>${titulo}</title>
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
