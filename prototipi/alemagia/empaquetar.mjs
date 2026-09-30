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
const titulo = /<title>([\s\S]*?)<\/title>/.exec(s)?.[1] ?? 'ALEmagia';
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

/* Los enlaces a las páginas interiores se vuelven absolutos. Dentro del archivo
   único una ruta como `anchetas/` no lleva a ninguna parte; apuntando a la
   dirección publicada, el que mire el archivo suelto puede seguir navegando. */
cuerpo = cuerpo.replace(/href="((?!https?:|#|mailto:|tel:)[a-z0-9-]+\/)"/g, (_m, r) => `href="${PUBLICADO}${r}"`);

const escapar = (t) => t.replace(/<\/script/gi, () => '<\\/script');

const doc = `<title>${titulo}</title>
${fuentes.join('\n')}
<style>${estilos}</style>
${cuerpo}
<script>${escapar(comun)}</script>
<script>${escapar(js)}</script>
`;

writeFileSync(salida, doc);
console.log(`${salida}  ${(Buffer.byteLength(doc) / 1024 / 1024).toFixed(2)} MB`);
