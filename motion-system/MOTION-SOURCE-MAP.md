# MOTION SOURCE MAP

Every skill in the library, traced back to the fragment of the reference
brief it was extracted from.

**A note on the reference.** Section 01 of the commissioning brief left the
reference specification unpasted — the placeholder `[PASTE THE ORIGINAL
HYLIOX PROMPT HERE]` is still there. The brief does, however, quote the
specification verbatim throughout sections 05 to 18, and those quoted
fragments are the corpus used here. They are reproduced exactly.

No branding, copy, template name or commercial content from the reference
was carried across. What was extracted is behaviour: timing, layering,
thresholds, fallbacks.

---

## 22 reference fragments → 41 skills

### REFERENCE: "then ease-out fade"

→ **`page-reveal`** — Entrada de página  
   La entrada que sigue al loader: una subida corta y una opacidad.  
   *GSAP · React · nulo cost · mobile: igual · reduced motion: estático*

→ **`fade-section-transition`** — Sección que aparece  
   La sección aparece al entrar en pantalla.  
   *GSAP · ScrollTrigger · nulo cost · mobile: igual · reduced motion: estático*

→ **`scale-section-transition`** — Sección que se asienta  
   La sección se asienta del 106% al 100%.  
   *GSAP · ScrollTrigger · nulo cost · mobile: igual · reduced motion: estático*

→ **`clip-section-transition`** — Sección que se descubre  
   La sección se descubre desde un recuadro redondeado hasta ocupar todo el ancho.  
   *GSAP · ScrollTrigger · CSS · bajo cost · mobile: igual · reduced motion: estático*

→ **`blur-transition`** — Sección que enfoca  
   La sección pasa de desenfocada a nítida.  
   *GSAP · ScrollTrigger · CSS · alto cost · mobile: simplificado · reduced motion: estático*

→ **`cinematic-section-transition`** — Transición cinematográfica  
   Máscara, escala y desenfoque compuestos en una sola entrada de autor.  
   *GSAP · ScrollTrigger · CSS · alto cost · mobile: simplificado · reduced motion: estático*

### REFERENCE: "Scroll: GSAP ScrollTrigger for section reveals"

→ **`text-reveal`** — Aparición del titular  
   El titular entra subiendo, por líneas, por palabras, por letras o entero.  
   *GSAP · ScrollTrigger · bajo cost · mobile: simplificado · reduced motion: estático*

→ **`fade-up`** — Entrada desde abajo  
   La entrada de siempre: opacidad más una subida corta.  
   *GSAP · ScrollTrigger · nulo cost · mobile: simplificado · reduced motion: estático*

→ **`fade-scale`** — Entrada con escala  
   Entra asentándose del 94% al 100% mientras aparece.  
   *GSAP · ScrollTrigger · nulo cost · mobile: igual · reduced motion: estático*

→ **`stagger-reveal`** — Entrada escalonada  
   Los hijos entran en secuencia desde un solo disparador.  
   *GSAP · ScrollTrigger · bajo cost · mobile: simplificado · reduced motion: estático*

→ **`clip-reveal`** — Barrido con máscara  
   El contenido se descubre con un barrido, no con una opacidad.  
   *GSAP · ScrollTrigger · CSS · bajo cost · mobile: igual · reduced motion: estático*

→ **`scroll-reveal-engine`** — Motor de entradas por scroll  
   La única pieza por la que pasan todas las entradas: limpieza, estado inicial, movimiento reducido y marcas de depuración, resueltos una sola vez.  
   *GSAP · ScrollTrigger · React · bajo cost · mobile: igual · reduced motion: desactivado*

### REFERENCE: "Each card: rounded 16px, glass surface, hover lift 6px"

→ **`card-hover-lift`** — Tarjeta que se eleva  
   La tarjeta sube hacia quien mira al pasar el cursor.  
   *Framer Motion · nulo cost · mobile: desactivado · reduced motion: desactivado*

→ **`image-zoom`** — Zoom de imagen  
   La imagen crece dentro de un marco fijo, y el marco no se mueve.  
   *Framer Motion · CSS · nulo cost · mobile: desactivado · reduced motion: desactivado*

→ **`glass-card`** — Tarjeta de cristal  
   Superficie translúcida y desenfocada, con borde de un píxel y un brillo en el canto superior.  
   *CSS · medio cost · mobile: simplificado · reduced motion: igual*

→ **`ambient-blur`** — Desenfoque de fondo  
   Un plano esmerilado sobre lo que haya detrás.  
   *CSS · alto cost · mobile: simplificado · reduced motion: igual*

→ **`gradient-border`** — Borde degradado  
   Un filo degradado alrededor de la superficie, enmascarado para que el cristal de debajo sobreviva.  
   *CSS · nulo cost · mobile: igual · reduced motion: igual*

### REFERENCE: "Sticky-pinned scroll variant on desktop"

→ **`sticky-story`** — Relato anclado  
   La sección se ancla y va pasando capítulos, moviendo texto e imagen desde un mismo valor de avance.  
   *GSAP · ScrollTrigger · React · medio cost · mobile: simplificado · reduced motion: simplificado*

→ **`horizontal-scroll`** — Scroll horizontal  
   El scroll vertical mueve una tira lateral mientras la sección está anclada.  
   *GSAP · ScrollTrigger · medio cost · mobile: simplificado · reduced motion: simplificado*

→ **`scroll-scrub-media`** — Vídeo recorrido por scroll  
   Vídeo o secuencia de imágenes cuyo fotograma lo elige la posición del scroll.  
   *GSAP · ScrollTrigger · Canvas · alto cost · mobile: simplificado · reduced motion: estático*

→ **`product-scroll`** — Producto por scroll  
   Escenario de producto anclado, con capítulos y anotaciones sincronizados, sobre vídeo, secuencia de imágenes o dibujo por canvas.  
   *GSAP · ScrollTrigger · Canvas · hls.js · React · alto cost · mobile: simplificado · reduced motion: simplificado*

### REFERENCE: "Hover: card lift, button slight scale (1.02)"

→ **`magnetic-button`** — Botón magnético  
   El botón se inclina hacia el cursor dentro de un radio y vuelve al salir.  
   *GSAP · Framer Motion · bajo cost · mobile: desactivado · reduced motion: desactivado*

→ **`magnetic-link`** — Enlace magnético  
   La misma atracción, más floja y sin crecer, para enlaces dentro del texto.  
   *GSAP · nulo cost · mobile: desactivado · reduced motion: desactivado*

→ **`image-tilt`** — Inclinación 3D  
   La superficie se inclina hacia el cursor, con tope en unos 7 grados.  
   *GSAP · bajo cost · mobile: desactivado · reduced motion: desactivado*

### REFERENCE: "Loading screen (3s monogram shimmer, ease-out fade)"

→ **`cinematic-loader`** — Loader cinematográfico  
   Velo a pantalla completa con el logotipo brillando y una salida suavizada.  
   *GSAP · React · CSS · bajo cost · mobile: simplificado · reduced motion: desactivado*

→ **`light-sweep`** — Barrido de luz  
   Una banda de brillo que cruza la superficie, al pasar el cursor o en bucle.  
   *CSS · bajo cost · mobile: simplificado · reduced motion: desactivado*

### REFERENCE: "50% black overlay"

→ **`media-overlay`** — Velo sobre el vídeo  
   Capa configurable sobre el vídeo — plana, direccional o radial — que hace legible el texto de encima.  
   *CSS · nulo cost · mobile: igual · reduced motion: igual*

→ **`vignette`** — Viñeta  
   Oscurece los bordes para que el ojo se pose en el centro.  
   *CSS · nulo cost · mobile: igual · reduced motion: igual*

### REFERENCE: "Subtle dust particle layer on top"

→ **`ambient-particles`** — Partículas de polvo  
   Motas de polvo en canvas que suben flotando, cada una respirando a su ritmo.  
   *Canvas · React · medio cost · mobile: simplificado · reduced motion: desactivado*

→ **`grain`** — Grano de película  
   Textura de película sobre la interfaz, a saltos y no suave.  
   *CSS · bajo cost · mobile: simplificado · reduced motion: estático*

### REFERENCE: "Headline mixing sans + italic serif"

→ **`text-reveal`** — Aparición del titular  
   El titular entra subiendo, por líneas, por palabras, por letras o entero.  
   *GSAP · ScrollTrigger · bajo cost · mobile: simplificado · reduced motion: estático*

→ **`split-text-reveal`** — Partidor de texto  
   El motor que hay debajo del titular: parte el texto en trozos sin perder la etiqueta accesible.  
   *GSAP · bajo cost · mobile: simplificado · reduced motion: desactivado*

### REFERENCE: "button slight scale (1.02)"

→ **`card-scale`** — Tarjeta que crece  
   Un crecimiento mínimo al pasar el cursor, combinable con la elevación.  
   *Framer Motion · nulo cost · mobile: desactivado · reduced motion: desactivado*

→ **`button-scale`** — Botón que responde  
   Respuesta al cursor y a la pulsación: 102% y 98%.  
   *Framer Motion · nulo cost · mobile: simplificado · reduced motion: desactivado*

### REFERENCE: "Background: subtle radial lime glow at bottom-center"

→ **`hover-glow`** — Resplandor que sigue al cursor  
   Un halo de luz que persigue al cursor por la superficie.  
   *CSS · React · bajo cost · mobile: simplificado · reduced motion: simplificado*

→ **`radial-glow`** — Resplandor de fondo  
   Un foco de luz de color, anclado donde haga falta dentro de una sección.  
   *CSS · nulo cost · mobile: igual · reduced motion: estático*

### REFERENCE: "Hero section (full-bleed HLS video bg, centered headline)"

→ **`cinematic-hero`** — Hero cinematográfico  
   Hero a pantalla completa que compone vídeo de fondo, velo, resplandor, partículas, viñeta y grano en un orden de capas fijo.  
   *React · CSS · Canvas · hls.js · medio cost · mobile: simplificado · reduced motion: estático*

### REFERENCE: "Hero takes 100svh"

→ **`cinematic-hero`** — Hero cinematográfico  
   Hero a pantalla completa que compone vídeo de fondo, velo, resplandor, partículas, viñeta y grano en un orden de capas fijo.  
   *React · CSS · Canvas · hls.js · medio cost · mobile: simplificado · reduced motion: estático*

### REFERENCE: "Background: hls.js video with 50% black overlay"

→ **`background-video`** — Vídeo de fondo (HLS)  
   Vídeo de fondo mudo que arranca solo, con camino HLS, fuentes progresivas de respaldo y tres alternativas distintas a imagen fija.  
   *hls.js · React · alto cost · mobile: estático · reduced motion: estático*

### REFERENCE: "Mobile: disable parallax, simplify hover states"

→ **`parallax`** — Parallax  
   Mueve un elemento a distinta velocidad que la página, en proporción a su propio tamaño.  
   *GSAP · ScrollTrigger · bajo cost · mobile: desactivado · reduced motion: desactivado*

### REFERENCE: "scroll-controlled"

→ **`product-scroll`** — Producto por scroll  
   Escenario de producto anclado, con capítulos y anotaciones sincronizados, sobre vídeo, secuencia de imágenes o dibujo por canvas.  
   *GSAP · ScrollTrigger · Canvas · hls.js · React · alto cost · mobile: simplificado · reduced motion: simplificado*

### REFERENCE: "8 cards in an asymmetric grid"

→ **`bento-grid-motion`** — Entrada de rejilla bento  
   Entrada escalonada para una rejilla asimétrica, en orden de lectura.  
   *GSAP · ScrollTrigger · bajo cost · mobile: simplificado · reduced motion: estático*

### REFERENCE: "Marquee: CSS infinite scroll, pauses on hover"

→ **`infinite-marquee`** — Tira infinita  
   Tira que gira sin costura, en CSS puro, y se para al pasar el cursor.  
   *CSS · React · nulo cost · mobile: igual · reduced motion: estático*

### REFERENCE: "BUILT WITH AI"

→ **`infinite-marquee`** — Tira infinita  
   Tira que gira sin costura, en CSS puro, y se para al pasar el cursor.  
   *CSS · React · nulo cost · mobile: igual · reduced motion: estático*

### REFERENCE: "NOT BY AI ·"

→ **`infinite-marquee`** — Tira infinita  
   Tira que gira sin costura, en CSS puro, y se para al pasar el cursor.  
   *CSS · React · nulo cost · mobile: igual · reduced motion: estático*

### REFERENCE: "FAQ accordion"

→ **`animated-accordion`** — Acordeón animado  
   Los paneles abren y cierran con altura y opacidad, con teclado y accesibilidad completos.  
   *Framer Motion · React · bajo cost · mobile: igual · reduced motion: simplificado*

### REFERENCE: "Smooth height + opacity transition (300ms ease-out)"

→ **`animated-accordion`** — Acordeón animado  
   Los paneles abren y cierran con altura y opacidad, con teclado y accesibilidad completos.  
   *Framer Motion · React · bajo cost · mobile: igual · reduced motion: simplificado*

---

## Extracted but not stated

Some skills exist because the reference implies them rather than names
them. They are listed against the nearest fragment above and marked here
so the distinction is not lost:

- `split-text-reveal` — implied by "Headline mixing sans + italic serif"
- `card-scale` — implied by "button slight scale (1.02)"
- `image-zoom` — implied by "Each card: rounded 16px, glass surface, hover lift 6px"
- `magnetic-button` — implied by "Hover: card lift, button slight scale (1.02)"
- `magnetic-link` — implied by "Hover: card lift, button slight scale (1.02)"
- `hover-glow` — implied by "Background: subtle radial lime glow at bottom-center"
- `image-tilt` — implied by "Hover: card lift, button slight scale (1.02)"
- `vignette` — implied by "50% black overlay"
- `light-sweep` — implied by "Loading screen (3s monogram shimmer, ease-out fade)"
- `ambient-blur` — implied by "Each card: rounded 16px, glass surface, hover lift 6px"
- `gradient-border` — implied by "Each card: rounded 16px, glass surface, hover lift 6px"
