import type { AccordionItem } from '@/components/motion/Accordion';
import type { ProductChapter, ProductHotspot } from '@/components/sections/ProductScroll';

export const productChapters: ProductChapter[] = [
  {
    at: 0,
    eyebrow: '01 — Fuente',
    title: 'Un escenario.\nTres fuentes.',
    body: 'Vídeo, secuencia de imágenes o dibujo por canvas. Todo lo demás lee el mismo valor de avance, así que cambiar de fuente es cambiar un dato y nada más.',
  },
  {
    at: 0.34,
    eyebrow: '02 — Ritmo',
    title: 'El scroll es\nla línea de tiempo.',
    body: 'El ritmo lo marca quien mira. Nada se reproduce solo, nada hay que esperar, y el mismo gesto que lee la página mueve el objeto.',
  },
  {
    at: 0.66,
    eyebrow: '03 — Anotación',
    title: 'El detalle llega\ncuando toca.',
    body: 'Las anotaciones aparecen dentro de un tramo del recorrido y se van, para que cada dato llegue justo cuando el objeto enseña lo que ese dato describe.',
  },
];

/**
 * Hotspots live over the object, on the right half of the stage. That is not
 * only where they point — it is the only half that is free. The synchronised
 * copy occupies the left, and a hotspot placed there lands on the headline.
 */
export const productHotspots: ProductHotspot[] = [
  { from: 0.4, to: 0.72, x: 42, y: 22, label: 'Dibujado por canvas', detail: 'Sin ningún archivo. Ocho vértices y un vector de luz.' },
  { from: 0.56, to: 0.9, x: 46, y: 80, label: 'Sombra de contacto', detail: 'Posa el objeto en el suelo en vez de dejarlo flotando.' },
  { from: 0.76, to: 1, x: 79, y: 24, label: 'Luz de borde', detail: 'Llega la última, cuando la forma ya se ha leído.' },
];

export const faqItems: AccordionItem[] = [
  {
    id: 'when',
    question: '¿Cuándo NO debe animarse una sección?',
    answer:
      'Cuando el contenido es el motivo por el que alguien ha entrado. Precios, fichas técnicas, datos de contacto y mensajes de error tienen que estar ahí al llegar. El movimiento es para las partes que premian explorar, no para las que responden una pregunta.',
  },
  {
    id: 'both',
    question: '¿Por qué dos librerías de animación?',
    answer:
      'Hacen trabajos distintos. GSAP se encarga de todo lo atado a la posición del scroll — líneas de tiempo, anclajes, recorrer un vídeo — porque ahí no tiene rival. Framer Motion se encarga del estado de los componentes, donde escribir qué estados existen es mucho menos código que animarlos a mano. La regla es que ninguna propiedad la animan las dos.',
  },
  {
    id: 'reduced',
    question: '¿Qué cambia de verdad con el movimiento reducido?',
    answer:
      'Cada efecto declara su propia alternativa, y ninguna es la misma animación más rápida. El parallax y las partículas dejan de existir. Los titulares dejan de partirse, lo que además deja intacto el árbol de accesibilidad. Las tiras infinitas pasan a deslizarse a mano. Las secciones ancladas se apilan. Y nunca se esconde contenido detrás de una animación que ya no corre.',
  },
  {
    id: 'budget',
    question: '¿Cuánto cuesta todo esto?',
    answer:
      'Casi todo es gratis: mover y desvanecer lo resuelve el compositor. Los caros están señalados uno a uno — el desenfoque de fondo, el desenfoque normal, el vídeo recorrido por scroll y las partículas. Cada efecto lleva su coste escrito, para que sea una decisión al usarlo y no un descubrimiento al final del proyecto.',
  },
];

export const marqueeStatements = [
  'EL MOVIMIENTO ES JERARQUÍA',
  'NO TODO DEBE MOVERSE',
  'LA ACCESIBILIDAD MANDA SOBRE EL EFECTO',
  'EL SCROLL PREMIA EXPLORAR',
  'MEDIR, NO ADIVINAR',
];

export const plates = ['media/plate-a.jpg', 'media/plate-b.jpg', 'media/plate-c.jpg', 'media/plate-d.jpg'];
