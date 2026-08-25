/**
 * TODO lo que el cliente podrá editar desde el panel vive en este fichero, y
 * en ningún otro sitio.
 *
 * La página no escribe ni una medida ni una descripción a mano: las cotas, los
 * globos numerados y la tabla de la leyenda se dibujan a partir de este objeto.
 * Cambiar aquí un número cambia el plano.
 *
 * ── Cómo entra el panel ────────────────────────────────────────────────────
 *
 * Cuando exista el panel, el servidor solo tiene que dejar el JSON en la
 * página antes del script:
 *
 *     <script>window.__SCHEDA__ = { ...lo que haya en la base de datos... }</script>
 *
 * `leerScheda()` lo mezcla por encima de estos valores. Lo que el panel no
 * mande se queda con el de aquí, así que un campo vacío en la base de datos
 * nunca deja un hueco en el plano — deja el valor de fábrica.
 *
 * Lo que llega por `window` es contenido del cliente, no código: se usa para
 * rellenar texto (`textContent`, atributos), nunca `innerHTML`. Un cliente que
 * pegue `<script>` en la descripción de una pieza tiene que ver ese texto
 * escrito en la tabla, no ejecutado.
 *
 * ── Forma de la tabla, para cuando toque crearla ───────────────────────────
 *
 *     scheda            id, aggiornato_il
 *     scheda_misura     scheda_id, chiave, valore, unita, ordine
 *     scheda_materiale  scheda_id, sigla, nome, dettaglio, ordine
 *     scheda_voce       scheda_id, numero, codice, qta, descrizione, ordine
 *
 * Tres tablas hijas y no un JSON suelto porque el panel va a editar fila a
 * fila, y ordenar y validar filas es trivial en SQL y engorroso dentro de un
 * blob.
 */

export interface Misura {
  /** Clave estable: es la que ata el valor a su línea de cota en el dibujo. */
  chiave: 'altezza' | 'larghezza' | 'profondita' | 'peso';
  etichetta: string;
  valore: string;
  unita: string;
}

export interface Materiale {
  sigla: string;
  nome: string;
  dettaglio: string;
}

export interface Voce {
  numero: number;
  codice: string;
  qta: number;
  descrizione: string;
  /** Dónde apunta el globo, en % de la caja del producto. Ver cotas.ts. */
  x: number;
  y: number;
  /**
   * A qué margen sale el globo. Se elige a mano y no por la posición porque
   * dos piezas cercanas mandan sus globos al mismo sitio y se solapan; en un
   * plano eso se resuelve repartiéndolos, no calculándolos.
   */
  lato: 'sx' | 'dx';
}

export interface Scheda {
  riferimento: string;
  disegno: string;
  misure: Misura[];
  materiali: Materiale[];
  legenda: Voce[];
}

/* Valores de partida. Son de ejemplo: el cliente todavía no ha pasado los
   suyos, y el pie de página lo dice. */
export const SCHEDA_BASE: Scheda = {
  riferimento: 'CS-1208-EXP',
  disegno: '732-A0295',
  misure: [
    { chiave: 'larghezza',  etichetta: 'Larghezza',   valore: '1200', unita: 'mm' },
    { chiave: 'profondita', etichetta: 'Profondità',  valore: '800',  unita: 'mm' },
    { chiave: 'altezza',    etichetta: 'Altezza',     valore: '900',  unita: 'mm' },
    { chiave: 'peso',       etichetta: 'Portata',     valore: '1200', unita: 'kg' },
  ],
  materiali: [
    { sigla: 'A', nome: 'Pannello OSB-3', dettaglio: '15 mm, uso strutturale in ambiente umido' },
    { sigla: 'B', nome: 'Telaio in pino', dettaglio: 'Trattato a caldo secondo ISPM-15' },
    { sigla: 'C', nome: 'Pallet EPAL',    dettaglio: 'Quattro vie, marchiato e certificato' },
  ],
  legenda: [
    { numero: 1, codice: '091-00006', qta: 1, descrizione: 'Pallet base quattro vie',       x: 62, y: 95, lato: 'dx' },
    { numero: 2, codice: '134-00048', qta: 4, descrizione: 'Montante angolare 80×80',       x: 14, y: 46, lato: 'sx' },
    { numero: 3, codice: '215-01118', qta: 2, descrizione: 'Pannello laterale OSB-3 15 mm', x: 80, y: 56, lato: 'dx' },
    { numero: 4, codice: '311-00114', qta: 1, descrizione: 'Coperchio con traversa',        x: 66, y: 10, lato: 'dx' },
    { numero: 5, codice: '404-00071', qta: 8, descrizione: 'Angolare metallico rinforzo',   x: 10, y: 86, lato: 'sx' },
  ],
};

/** Mezcla superficial: lo que mande el panel gana, lo que no, se queda. */
export function leerScheda(): Scheda {
  const dado = (globalThis as Record<string, unknown>).__SCHEDA__;
  if (!dado || typeof dado !== 'object') return SCHEDA_BASE;
  const p = dado as Partial<Scheda>;
  return {
    riferimento: p.riferimento ?? SCHEDA_BASE.riferimento,
    disegno: p.disegno ?? SCHEDA_BASE.disegno,
    // Una lista vacía es un error del panel, no una decisión: un plano sin
    // cotas no es un plano. Se cae al valor de fábrica.
    misure: p.misure?.length ? p.misure : SCHEDA_BASE.misure,
    materiali: p.materiali?.length ? p.materiali : SCHEDA_BASE.materiali,
    legenda: p.legenda?.length ? p.legenda : SCHEDA_BASE.legenda,
  };
}
