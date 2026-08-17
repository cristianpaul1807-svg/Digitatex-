---
name: scroll-scrub-site
description: Genera un sitio web de una sola página (HTML/CSS/JS autocontenido) reutilizando el sistema de diseño "scroll-scrub" — hero con video scrubbed por scroll, manifiesto, servicios en filas, proceso en 3 fases, testimonios, CTA+formulario y footer. Usar cuando el usuario pida crear un sitio web para un nuevo cliente/nicho basado en este sistema, o invoque explícitamente "usa la skill scroll-scrub-site".
---

# scroll-scrub-site

Genera sitios web de una sola página para distintos clientes/nichos, todos construidos
sobre el mismo sistema de diseño probado en producción (el sitio de "Ta Maison Est Ma
Maison Inc."). El archivo de referencia en `reference/ta-maison-est-ma-maison-premium.html`
es la fuente de verdad de la base fija — está anotado con comentarios `<!-- FIJO -->`
y `<!-- VARIABLE -->` en cada bloque.

## Contrato: qué es fijo y qué es variable

### BASE FIJA — nunca modificar estructura, selectores ni mecánica

- **Secciones y su orden**: nav fija → hero (video scroll-scrubbed) → manifiesto/filosofía
  → servicios (filas horizontales con hover) → proceso (exactamente 3 fases) → testimonios
  (grid de 3) → CTA final + formulario de contacto → footer.
- **Motor de scroll-scrub**: contenedor `.scrub-wrap` de 300-450vh con `.scrub-sticky`
  en `position:sticky`; el `currentTime` del video se controla por scroll (no reproducción
  normal), vía `requestAnimationFrame` en el listener de scroll. Ver `initScrubChapters()`.
- **Unlock de iOS Safari**: el video lleva `muted playsinline autoplay`, y en JS se llama
  `video.play()` seguido de `video.playbackRate = 0` (NUNCA `.pause()` — Safari muestra su
  botón de play nativo sobre cualquier video pausado, sin importar cómo llegó a ese estado;
  la única forma de evitarlo es que seguir "reproduciendo" con velocidad 0). Incluye un
  listener de `pause` que reintenta el priming si el navegador lo pausa solo.
  Esta es una lección aprendida en producción — no simplificar ni "arreglar" esta lógica.
- **Hero en teléfono**: bajo 760px el video va `object-fit:contain` (con `cover` a pantalla
  completa se pierde el 74% del ancho y un video de producto queda decapitado), el texto
  del hero NO se funde (`opacity:1 !important`, porque con el video contenido los dos
  extremos del recorrido dejan medio móvil vacío) y `.chapter-content` lleva su propio
  degradado de fondo. Los tres van juntos: quitar uno rompe a los otros dos. El bloque de
  pantalla corta arranca en `max-height:640px` y solo aprieta el texto — estrechar la caja
  del video empeora el hueco. Ver el punto 5 para quitarle el recuadro a esa banda.
- **Reveal-on-scroll**: `IntersectionObserver` + clases `.reveal` / `.reveal-scale`,
  clases de retraso `.d1`-`.d4`.
- **Firma visual**: línea vertical de acento (`.scroll-spine`) fija en el borde derecho
  del viewport, que se "construye" (crece en altura) con el progreso total de scroll de
  la página — además de la barra horizontal superior (`.page-progress`). Ambas coexisten.
- **Tipografía**: `Fraunces` (serif editorial, títulos) + `Inter` (sans, cuerpo). Google Fonts.
- **Estilos de botones, tarjetas, grids y layout responsive mobile-first**: tal como están
  en el archivo de referencia (breakpoints 760px / 860px / 900px / 960px).
- **Paleta base**: negro/tinta (`--ink`, `--ink-2`) + hueso/crema (`--bone`, `--bone-dim`,
  `--stone`) — estos NUNCA cambian.

### VARIABLE — adaptar en cada generación según los parámetros dados

1. **Idioma**: todos los textos (headlines, subtítulos, botones, formulario, footer,
   meta tags) en el idioma indicado.
2. **Nicho / industria**:
   - Copy de hero, manifiesto, servicios, proceso y testimonios reescrito específicamente
     para ese nicho — nunca dejar el copy de construcción/renovación si el nicho es otro.
   - SEO on-page: `<title>`, meta description, jerarquía H1/H2, densidad natural de
     keywords del nicho + ubicación si se da. JSON-LD con el `@type` de schema.org correcto
     para el sector (LocalBusiness, Restaurant, Dentist, GeneralContractor, etc.).
   - Campos del formulario adaptados al tipo de negocio (ej. "tipo de proyecto",
     "metros cuadrados", "presupuesto estimado", "fecha preferida", etc.).
   - Texto del CTA principal adaptado a la acción real (cotización, cita, demo, reserva...).
3. **Referencia externa** (si el usuario da una URL o descripción de un sitio del mismo
   nicho): usarla SOLO para entender tono, estructura de servicios y vocabulario del
   sector. Nunca copiar texto ni estructura literal de esa referencia.
4. **Video de fondo**: el usuario SIEMPRE lo da por separado (URL o archivo ya generado
   a medida para ese negocio). Nunca generar ni asumir un video — solo insertarlo en
   `<video id="renov-film">` dentro del hero, ajustando `src`. Las dos palabras del
   indicador de progreso (`.chapter-track`, ej. "Avant"/"Après") se ajustan según lo que
   indique el usuario para ese nicho (ej. "Matière première" → "Produit fini").
5. **Fondo de página desde el vídeo** (recomendado cuando el vídeo tiene un
   entorno reconocible): el corte entre el hero y el resto de la página se nota
   porque arriba hay un lugar y debajo negro plano. Se resuelve extrayendo un
   fotograma del propio vídeo del cliente, desenfocándolo fuerte y oscureciéndolo,
   y poniéndolo como fondo fijo de toda la página:

   ```bash
   ffmpeg -ss 0.1 -i video.mp4 -frames:v 1 \
     -vf "gblur=sigma=48,eq=brightness=-0.22:contrast=0.75:saturation=0.5,scale=1600:900" sfondo.jpg
   ```

   Va en un pseudo-elemento `body::before` con `position:fixed` (nunca
   `background-attachment:fixed`, que falla en iOS) y un velo plano encima. Las
   secciones con fondo sólido (`#approach`, `#testimonios`, `.phase`,
   `.testi-card`) pasan a `rgba(21,21,19,0.55-0.66)` para que la textura las
   atraviese, y `.scrub-bg` pasa a `transparent`.

   **El velo se mide, no se elige a ojo**: hay que comprobar el punto más claro
   de la textura contra los cuatro tonos de texto (`--bone`, `--bone-dim`,
   `--stone`, `--brass-2`). En el caso medido, sin velo `--stone` se quedaba en
   2.70:1; con 0.64 el peor de los cuatro sube a 4.6:1 y la textura conserva
   rango suficiente para verse.

   **Y ese mismo fotograma quita el recuadro del hero en el teléfono.** Con el
   vídeo contenido, la banda queda como un rectángulo pegado sobre negro plano,
   con dos bordes duros. La receta, toda dentro del bloque `@media
   (max-width:760px)`:

   - `.scrub-bg::before` con el fotograma otra vez, pero con la mitad de velo y
     `background-size:100% 100%` (estirado, no `cover`: así el horizonte cae más
     o menos donde toca en vez de quedar un campo plano de suelo ampliado). Es la
     sala del vídeo continuada por toda la pantalla.
   - La banda arranca en `top:0`, no centrada en el hueco. El menú va fijo y
     flota sobre ella, y esa parte del fotograma suele ser pared vacía.
   - Se recorta por los lados con `object-fit:cover` y un alto explícito:
     `height:min(max(100vw * 0.5625/f, 40vh), 100vw * 0.879)`, donde `f` es la
     fracción del ancho del fotograma que hay que conservar. **`f` se mide, no se
     elige**: hay que sacar fotogramas a lo largo del vídeo y buscar los
     extremos horizontales del producto — si vive entre el 22% y el 82%, `f=0.80`
     es seguro y la banda crece un 25%.
   - `mask-image:linear-gradient(to bottom,#000 0%,#000 74%,transparent 100%)` en
     el vídeo, y otra máscara parecida en `.scrub-bg::before`, para que ni el
     borde de la banda ni el borde inferior del hero pegajoso dejen escalón.
   - `.chapter-index{display:none}`: con la banda arriba del todo, cae encima
     del producto.

   Efecto secundario que interesa: mientras el vídeo no ha decodificado, lo que
   se ve es la sala desenfocada con la silueta del producto, nunca una caja
   negra.

6. **Paleta de acento**: por defecto usa `--brass`/`--brass-2` (latón/dorado) de la
   referencia. Si el nicho lo justifica (ej. azul industrial, verde sustentable), ajustar
   SOLO esas dos variables — negro/hueso y todo lo demás queda intacto.
7. **Logo**: si el cliente tiene logo, usar `.logo-badge` (fondo blanco, esquinas
   redondeadas, imagen del logo adentro) — nunca ponerlo directamente dentro de `<nav>`
   sin ese contenedor, porque `<nav>` no lleva `mix-blend-mode` (va en `.brand-text` y
   `.navlinks`) precisamente para que un logo con fondo sólido no se invierta de color.
   Si no hay logo, quitar `.logo-badge` y dejar solo `.brand-text`.

## Formato de invocación

El usuario invoca la skill con un prompt corto:

```
Usa la skill scroll-scrub-site.
Idioma: [idioma]
Nicho: [nicho/industria]
Empresa: [nombre]
Ubicación: [ciudad/país, si aplica SEO local]
Referencia: [URL o descripción, opcional]
Video: [URL o ruta del video que ya generó el usuario]
Indicador de progreso: [palabra inicio] → [palabra final]
Paleta de acento (opcional): [color]
```

No todos los campos son obligatorios — como mínimo se necesita idioma, nicho y empresa.
Si falta el video, dejar `<source src="hero-video.mp4">` como placeholder y avisar al
usuario que falta insertarlo (nunca generarlo ni inventar una URL).

## Proceso al invocar la skill

1. Leer `reference/ta-maison-est-ma-maison-premium.html` completo.
2. Copiarlo como punto de partida — no reescribir la estructura ni el `<script>` desde
   cero, solo editar los bloques marcados `<!-- VARIABLE -->` y sus equivalentes en JS/CSS
   (endpoint del formulario, campos del formulario, paleta de acento si aplica).
3. Reescribir todo el copy (meta tags, JSON-LD, hero, manifiesto, servicios, proceso,
   testimonios, formulario, footer) en el idioma y para el nicho indicados.
4. Insertar el video del usuario y las dos palabras del indicador de progreso.
5. Entregar un único archivo HTML autocontenido (CSS y JS inline, sin dependencias
   salvo Google Fonts), listo para producción.
6. Si algo del pedido entra en conflicto con la base fija (ej. "quita el video de fondo"
   o "cambia a un menú lateral"), avisar al usuario explícitamente en vez de romper la
   base fija en silencio — esa es la razón de ser de esta skill.
