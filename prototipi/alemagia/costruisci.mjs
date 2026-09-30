/**
 * Genera las páginas interiores del sitio.
 *
 *   node costruisci.mjs
 *
 * POR QUÉ UN GENERADOR Y NO NUEVE ARCHIVOS A MANO. Todas comparten la misma
 * cabecera, el mismo menú, el mismo pie, el mismo botón de WhatsApp y la misma
 * banda de prototipo. Escritas a mano, cambiar un enlace del menú son nueve
 * ediciones, y a la tercera vez dejan de coincidir.
 *
 * El HTML que sale SÍ se versiona en el repositorio, a propósito: el Dockerfile
 * copia `prototipi/` tal cual y nginx sirve estático. En el servidor no se
 * ejecuta nada, así que lo que no esté generado y subido, no existe.
 *
 * La portada (index.html) NO se genera aquí: tiene el motor de ocasiones y un
 * guion propio, y meterla en la plantilla obligaría a llenar el generador de
 * excepciones para un solo caso.
 */
import { writeFileSync, mkdirSync } from 'node:fs';

/* DATOS DEL NEGOCIO. Todos salen de su perfil de Instagram (@alemagia_). Lo
   que no está ahí no está aquí: no hay dirección de local porque ella no
   publica ninguna —trabaja a domicilio— y no hay número escrito porque su
   contacto es un enlace de WhatsApp, no un teléfono publicado. Inventar
   cualquiera de las dos cosas le crea el problema a ella. */
const SITIO = {
  nombre: 'ALEmagia',
  lema: 'Detalles, amor y magia',
  ciudad: 'Medellín',
  region: 'Antioquia',
  pais: 'CO',
  horario: '9:00 a 22:00, todos los días',
  ig: 'https://www.instagram.com/alemagia_/',
  igUser: '@alemagia_',
  wa: 'https://walink.co/urh5jv',
};

const BASE = 'https://digitatex.com/prototipi/alemagia/';

/* El menú, en un solo sitio. `a` es la ruta desde la RAÍZ del sitio; el armazón
   le antepone `../` en las páginas interiores. */
const MENU = [
  { a: '#ocasiones', t: 'Ocasiones' },
  { a: 'anchetas/', t: 'Anchetas' },
  { a: 'desayunos-sorpresa/', t: 'Desayunos' },
  { a: 'globos-personalizados/', t: 'Globos' },
  { a: 'preguntas-frecuentes/', t: 'Preguntas' },
  { a: 'contacto/', t: 'Contacto' },
];

/* Todas las páginas, para el mapa del pie. Una página a la que no apunta nadie
   existe pero no la encuentra ni Google ni el visitante. */
const MAPA = [
  ['', 'Inicio'],
  ['anchetas/', 'Anchetas'],
  ['desayunos-sorpresa/', 'Desayunos sorpresa'],
  ['globos-personalizados/', 'Globos personalizados'],
  ['detalles-cumpleanos/', 'Detalles de cumpleaños'],
  ['regalos-grado/', 'Regalos de grado'],
  ['zonas-domicilio/', 'Dónde entregamos'],
  ['quienes-somos/', 'Quiénes somos'],
  ['preguntas-frecuentes/', 'Preguntas frecuentes'],
  ['contacto/', 'Contacto'],
];

const attr = (t) => String(t).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

/* ---------------------------------------------------------------------------
   DATOS ESTRUCTURADOS
   Google no lee la maquetación: lee esto. Cada página declara de qué tipo es y
   se le añade siempre la miga de pan, que es lo que hace que en el resultado
   salga la ruta en vez de la dirección cruda.
   --------------------------------------------------------------------------- */
const negocio = {
  '@type': 'Store',
  '@id': BASE + '#negocio',
  name: SITIO.nombre,
  slogan: SITIO.lema,
  description: 'Detalles personalizados a domicilio en Medellín: anchetas, desayunos sorpresa, cajitas, globos y flores.',
  /* Sin `streetAddress`: ella no publica local. Poner una calle inventada en
     datos estructurados es peor que no poner nada — lo recogen directorios y
     mapas, y después hay que ir a corregirlo sitio por sitio. */
  address: {
    '@type': 'PostalAddress',
    addressLocality: SITIO.ciudad,
    addressRegion: SITIO.region,
    addressCountry: SITIO.pais,
  },
  areaServed: [
    { '@type': 'City', name: 'Medellín' },
    { '@type': 'City', name: 'Envigado' },
    { '@type': 'City', name: 'Itagüí' },
    { '@type': 'City', name: 'Sabaneta' },
    { '@type': 'City', name: 'Bello' },
    { '@type': 'City', name: 'La Estrella' },
  ],
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    opens: '09:00',
    closes: '22:00',
  },
  sameAs: [SITIO.ig],
};

const migas = (p) => ({
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: BASE },
    { '@type': 'ListItem', position: 2, name: p.miga || p.h1, item: BASE + p.ruta + '/' },
  ],
});

/* ---------------------------------------------------------------------------
   EL ARMAZÓN
   --------------------------------------------------------------------------- */
function pagina(p) {
  const r = '../';
  const url = BASE + p.ruta + '/';
  const grafo = { '@context': 'https://schema.org', '@graph': [negocio, migas(p), ...(p.datos || [])] };

  const menu = MENU.map((m) => {
    const aqui = m.a === p.ruta + '/' ? ' aria-current="page"' : '';
    return `    <a href="${r}${m.a}"${aqui}>${m.t}</a>`;
  }).join('\n');

  const mapa = MAPA.map(([a, t]) => `    <a href="${r}${a}">${t}</a>`).join('\n');

  return `<!doctype html>
<html lang="es-CO">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">

<title>${attr(p.title)}</title>
<meta name="description" content="${attr(p.desc)}">
<meta name="theme-color" content="#13201d">
<!-- Alojado bajo digitatex.com como prototipo: es la web de otro negocio y no
     debe indexarse bajo nuestro dominio ni competir con el suyo. Cuando pase a
     su propio dominio se quita esta línea y el posicionamiento entra en juego;
     todo lo demás de esta cabecera ya está preparado para ese día. -->
<meta name="robots" content="noindex, nofollow">
<link rel="canonical" href="${url}">

<meta property="og:type" content="article">
<meta property="og:title" content="${attr(p.ogTitle || p.title)}">
<meta property="og:description" content="${attr(p.desc)}">
<meta property="og:image" content="${r}media/${p.og || 'o1.webp'}">
<meta property="og:locale" content="es_CO">
<meta property="og:url" content="${url}">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Figtree:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${r}stile.css">

<script type="application/ld+json">
${JSON.stringify(grafo, null, 2)}
</script>
</head>
<body>

<canvas id="campo" aria-hidden="true"></canvas>

<header class="barra giu" id="barra">
  <a class="marchio" href="${r}">
    <span class="marchio-bollo"><img src="${r}media/logo.webp" alt="" width="440" height="440"></span>
    <span class="marchio-nome">ALE<i>magia</i></span>
  </a>
  <nav class="menu" id="menu">
${menu}
    <a class="btn btn-pieno" href="${r}contacto/">Pedir por WhatsApp</a>
  </nav>
  <a class="btn btn-pieno" href="${r}contacto/">Pedir por WhatsApp</a>
  <button class="apri-menu" id="apri-menu" aria-label="Abrir el menú" aria-expanded="false" aria-controls="menu">
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
  </button>
</header>

<main id="top">

  <nav class="briciole" aria-label="Ruta">
    <div class="wrap">
      <a href="${r}">Inicio</a><span aria-hidden="true">›</span><span>${p.miga || p.h1}</span>
    </div>
  </nav>

  <section class="apertura">
    <div class="wrap">
      <p class="occhiello rivela">${p.occhiello}</p>
      <h1 class="rivela">${p.h1}</h1>
      <p class="guida rivela">${p.intro}</p>
    </div>
  </section>

${p.cuerpo(r)}

  <section class="chiamata">
    <div class="wrap">
      <div class="chiusura">
        <div class="chiamata-dentro">
          <div>
            <p class="occhiello">Pedidos</p>
            <h2>${p.ctaTitulo || 'Cuéntanos el detalle.'}</h2>
            <p class="guida">${p.ctaTexto || 'Escríbenos por WhatsApp con la fecha, la zona de entrega y para quién es. Te respondemos con opciones y precio.'}</p>
          </div>
          <div class="chiamata-azioni">
            <a class="btn btn-pieno" href="${SITIO.wa}" target="_blank" rel="noopener">Escribir por WhatsApp
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </a>
            <a class="btn btn-vuoto-chiaro" href="${r}contacto/">Ver el formulario</a>
          </div>
        </div>
      </div>
    </div>
  </section>

</main>

<footer>
  <div class="wrap pie">
    <span class="pie-marca"><img src="${r}media/logo.webp" alt="ALEmagia — Detalles, amor y magia" width="440" height="440" loading="lazy">${SITIO.nombre} · ${SITIO.lema} · ${SITIO.ciudad}</span>
    <span><a href="${SITIO.wa}" target="_blank" rel="noopener">WhatsApp</a> · <a href="${SITIO.ig}" target="_blank" rel="noopener">${SITIO.igUser}</a></span>
  </div>
  <div class="wrap pie-mappa">
${mapa}
  </div>
</footer>

<a class="wa" id="wa" target="_blank" rel="noopener" href="${SITIO.wa}" aria-label="Escríbenos por WhatsApp">
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.38-.27.3-1.04 1.02-1.04 2.48s1.06 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35zM12.05 21.5h-.01a9.42 9.42 0 0 1-4.8-1.32l-.34-.2-3.57.93.96-3.47-.23-.36a9.4 9.4 0 0 1-1.44-5.02c0-5.2 4.24-9.43 9.44-9.43 2.52 0 4.89.98 6.67 2.77a9.36 9.36 0 0 1 2.76 6.67c0 5.2-4.24 9.43-9.44 9.43zM20.15 3.9A11.32 11.32 0 0 0 12.05.55C5.8.55.72 5.63.72 11.87c0 1.99.52 3.94 1.51 5.65L.63 23.45l6.06-1.59a11.3 11.3 0 0 0 5.36 1.37h.01c6.24 0 11.32-5.08 11.32-11.32 0-3.03-1.18-5.87-3.23-8.01z"/></svg>
  <span>Escríbenos por WhatsApp</span>
</a>

<div class="avviso">
  <span>Prototipo Digitatex · Fotos de @alemagia_ · Datos del negocio por confirmar</span>
  <a class="avviso-btn" href="https://digitatex.com/?lang=es#quote" target="_blank" rel="noopener">
    Llenar el formulario de Digitatex
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
  </a>
</div>

<script src="${r}comune.js"></script>
<script>
document.addEventListener('DOMContentLoaded', function(){
  ambiente();
  barra();
  menuMobile();
  rivelare();
  parallasse();
  medirBanda();
  whatsapp();
  modulo();
});
</script>
</body>
</html>
`;
}

/* --------------------------------------------------------------------------- */
import { PAGINE } from './pagine.mjs';

let n = 0;
for (const p of PAGINE) {
  mkdirSync(new URL(p.ruta + '/', import.meta.url), { recursive: true });
  writeFileSync(new URL(p.ruta + '/index.html', import.meta.url), pagina(p));
  n++;
  console.log('  ' + p.ruta + '/index.html');
}
console.log(n + ' páginas generadas.');

export { SITIO, BASE, negocio };
