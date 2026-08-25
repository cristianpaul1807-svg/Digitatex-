/**
 * La caja montándose, recorrida por scroll.
 *
 * ── Por qué imágenes y no el vídeo ─────────────────────────────────────────
 *
 * El vídeo trae su fondo de estudio pegado, y aquí la caja tiene que flotar
 * SOBRE la web con las secciones pasando por detrás. Eso pide alfa. El vídeo
 * con canal alfa existe (VP9 en WebM) pero Safari no lo reproduce, así que en
 * medio navegador la caja saldría dentro de un rectángulo negro.
 *
 * Una secuencia de WebP con alfa la pinta cualquier navegador desde 2020, se
 * salta a cualquier fotograma sin decodificar los anteriores —que es justo lo
 * que un recorrido por scroll necesita— y no arrastra ninguno de los problemas
 * del <video> recorrido: ni el botón de play que Safari dibuja sobre cualquier
 * vídeo pausado, ni la espera a que el decodificador entregue el salto.
 *
 * Cuesta 972 KB en 42 fotogramas. Se cargan una vez y se quedan.
 *
 * ── Por qué canvas y no 42 <img> apiladas ──────────────────────────────────
 *
 * Con <img> superpuestas, el navegador mantiene 42 capas compuestas y cambiar
 * de fotograma es tocar `opacity` de dos de ellas: funciona, pero reserva
 * memoria de vídeo para las 42 a tamaño completo. Un solo canvas pinta la que
 * toca y ya.
 */

export interface Secuencia {
  /** El lienzo, para montarlo donde toque. */
  canvas: HTMLCanvasElement;
  /** Pinta el fotograma correspondiente a un progreso de 0 a 1. */
  dibujar(progreso: number): void;
  /** Se resuelve cuando están el primero y el último, que son los que se ven fijos. */
  lista: Promise<void>;
}

export function cargarSecuencia(base: string, total: number): Secuencia {
  const imagenes: HTMLImageElement[] = [];
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  let ancho = 0;
  let alto = 0;
  let ultimo = -1;

  const cargar = (i: number) =>
    new Promise<void>((resolve) => {
      const img = new Image();
      // decoding async: si no, la primera pintada bloquea el hilo principal
      // mientras descomprime, y se nota como un tirón justo al llegar.
      img.decoding = 'async';
      img.src = `${base}/f${String(i).padStart(3, '0')}.webp`;
      img.onload = () => {
        if (!ancho) { ancho = img.naturalWidth; alto = img.naturalHeight; }
        imagenes[i] = img;
        resolve();
      };
      // Un fotograma que no carga no puede bloquear la secuencia entera: se
      // resuelve igual y `dibujar` busca el más cercano que sí esté.
      img.onerror = () => resolve();
    });

  /* El primero y el último van antes que nada: son los dos que se ven fijos
     —el primero antes de empezar a bajar, el último durante todo el
     aterrizaje— y son los únicos cuya ausencia se notaría como un hueco. */
  const lista = Promise.all([cargar(0), cargar(total - 1)]).then(async () => {
    for (let i = 1; i < total - 1; i++) await cargar(i);
  });

  function dibujar(progreso: number) {
    if (!ctx) return;
    const objetivo = Math.max(0, Math.min(total - 1, Math.round(progreso * (total - 1))));

    // Si el fotograma exacto todavía no ha llegado, se busca el más cercano ya
    // cargado. Durante la carga la secuencia va a saltos en vez de parpadear.
    let i = objetivo;
    if (!imagenes[i]) {
      let d = 1;
      while (d < total) {
        if (imagenes[objetivo - d]) { i = objetivo - d; break; }
        if (imagenes[objetivo + d]) { i = objetivo + d; break; }
        d++;
      }
    }
    const img = imagenes[i];
    if (!img || i === ultimo) return;
    ultimo = i;

    if (canvas.width !== ancho) { canvas.width = ancho; canvas.height = alto; }
    ctx.clearRect(0, 0, ancho, alto);
    ctx.drawImage(img, 0, 0, ancho, alto);
  }

  return { canvas, dibujar, lista };
}
