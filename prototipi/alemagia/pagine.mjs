import { readFileSync } from 'node:fs';

/* El formulario se LEE de la portada en vez de estar copiado aquí. Es el mismo
   formulario: si mañana se le añade un campo, se añade en un sitio y las dos
   páginas lo tienen. Copiarlo habría garantizado que dentro de dos cambios
   dejaran de coincidir. */
const MODULO = (() => {
  const casa = readFileSync(new URL('index.html', import.meta.url), 'utf8');
  const m = /<form class="modulo" id="modulo"[\s\S]*?<\/form>/.exec(casa);
  if (!m) throw new Error('no encuentro el formulario en index.html');
  return m[0];
})();

/**
 * El contenido de las páginas interiores. El armazón está en costruisci.mjs.
 *
 * REGLA DE ESTE ARCHIVO: aquí no se inventan datos del negocio. No hay precios,
 * ni costos de domicilio, ni tiempos de entrega exactos, ni años de
 * experiencia, ni número de pedidos. Nadie nos los ha dado, y una web que
 * promete lo que la dueña no ha dicho le crea el problema a ella.
 *
 * Lo que sí hay es descripción del servicio, sacada de lo que ella misma
 * publica en @alemagia_: anchetas, cajitas, globos, flores, domicilios en
 * Medellín y atención de 9 de la mañana a 10 de la noche.
 *
 * Las respuestas de preguntas frecuentes que fijan una política —anticipos,
 * cuánto tiempo antes pedir, cambios— van escritas como propuesta y marcadas
 * como tales en la propia página. Son las que ella tiene que corregir.
 */

const IMG = (r, f, alt, w, h) =>
  `<img src="${r}media/${f}" alt="${alt}" width="${w}" height="${h}" loading="lazy">`;

const DUO = (r, a, b) => `
  <section class="banda-foto">
    <div class="wrap duo">
      <figure class="svela" data-par>${IMG(r, a.f, a.alt, a.w, a.h)}</figure>
      <figure class="svela" data-par>${IMG(r, b.f, b.alt, b.w, b.h)}</figure>
    </div>
  </section>`;

/* La foto de cabecera va en una banda apaisada y las fotos de ella son
   verticales: recortándolas para llenarla se quedaba en pantalla una franja de
   globos sin ni la base ni el globo del mensaje —el objeto entero desaparecía
   justo en la imagen más grande de la página—.

   Así que la foto entra ENTERA y lo que llena la banda por detrás es ella
   misma, ampliada y desenfocada. Sale gratis —no hay un segundo archivo que
   recortar y mantener por cada foto—, funciona igual con las verticales y con
   las apaisadas, y el fondo siempre pega porque son los mismos colores.

   La dirección del archivo se pasa en una propiedad del elemento porque la
   hoja de estilos no puede saber cuál es cada foto. */
const UNA = (r, a, ratio) => `
  <section class="banda-foto">
    <div class="wrap">
      <figure class="svela ${ratio || 'larga'}" style="--foto:url('${r}media/${a.f}')" data-par>${IMG(r, a.f, a.alt, a.w, a.h)}</figure>
    </div>
  </section>`;

/* Lista numerada de lo que lleva el detalle. Es la parte que más se lee de una
   página de servicio: contesta «¿qué me dan exactamente?». */
const INCLUYE = (titulo, items) => `
  <section class="lista-blocco">
    <div class="wrap">
      <h2 class="rivela">${titulo}</h2>
      <div class="elenco">
        ${items.map((i, n) => `<div class="voce rivela"><b>${String(n + 1).padStart(2, '0')}</b><div><h3>${i.t}</h3><p>${i.d}</p></div></div>`).join('\n        ')}
      </div>
    </div>
  </section>`;

const PROSA = (parrafos) => `
  <section class="prosa">
    <div class="wrap">
      ${parrafos.map((t) => `<p class="rivela">${t}</p>`).join('\n      ')}
    </div>
  </section>`;

/* Las preguntas van también al JSON-LD de la página, que es lo que permite que
   Google las enseñe desplegadas en el resultado de búsqueda. */
const PREGUNTAS = (qa) => `
  <section class="faq">
    <div class="wrap">
      <h2 class="rivela">Preguntas frecuentes</h2>
      <div class="faq-elenco">
        ${qa.map((x) => `<details class="rivela"><summary>${x.q}</summary><p>${x.a}</p></details>`).join('\n        ')}
      </div>
    </div>
  </section>`;

const faqDatos = (qa) => ({
  '@type': 'FAQPage',
  mainEntity: qa.map((x) => ({
    '@type': 'Question',
    name: x.q,
    acceptedAnswer: { '@type': 'Answer', text: x.a.replace(/<[^>]+>/g, '') },
  })),
});

const servicioDatos = (nombre, desc) => ({
  '@type': 'Service',
  serviceType: nombre,
  provider: { '@id': 'https://digitatex.com/prototipi/alemagia/#negocio' },
  areaServed: [
    { '@type': 'City', name: 'Medellín' },
    { '@type': 'City', name: 'Envigado' },
    { '@type': 'City', name: 'Itagüí' },
    { '@type': 'City', name: 'Sabaneta' },
  ],
  description: desc,
});

/* --------------------------------------------------------------------------- */

const faqAnchetas = [
  { q: '¿Qué trae una ancheta?',
    a: 'Se arma según para quién es. La base suele ser mecato y chocolates escogidos, y encima se le suma lo que le dé sentido: un globo de burbuja con su mensaje, flores, una botella, un peluche o un detalle que tú nos mandes. Si nos dices qué le gusta a la persona, la armamos alrededor de eso.' },
  { q: '¿Puedo escoger yo lo que lleva?',
    a: 'Sí. Puedes mandarnos la lista de lo que quieres adentro, o decirnos un presupuesto y dejarnos escoger. Las dos formas funcionan; la segunda suele salir mejor armada porque sabemos qué se ve bien junto.' },
  { q: '¿Se puede poner una foto o una dedicatoria?',
    a: 'Sí. El mensaje va impreso en el globo o en una tarjeta, y también podemos montar fotos en la base. Mándanos el texto tal cual quieres que quede, con los nombres bien escritos.' },
  { q: '¿La entregan a domicilio?',
    a: 'Sí, trabajamos a domicilio en Medellín y alrededores. Danos la dirección, el día y una franja de hora, y coordinamos la entrega.' },
];

const faqDesayunos = [
  { q: '¿A qué hora entregan los desayunos?',
    a: 'En la mañana, a la hora que nos digas dentro de nuestro horario de atención, que es de 9 de la mañana a 10 de la noche. Para una sorpresa temprano conviene dejarlo cuadrado el día anterior.' },
  { q: '¿Qué trae el desayuno?',
    a: 'Se arma a pedido. Lo habitual es una bebida, algo de panadería, fruta y un dulce, más el detalle que lo acompaña: globo con mensaje, flores o una cajita. Si la persona tiene alguna restricción, dínoslo y lo cambiamos.' },
  { q: '¿Sirve para pedir de otra ciudad?',
    a: 'Sí, y es de lo que más nos piden. Tú escribes desde donde estés, nos das la dirección en Medellín y nosotros entregamos. Te mandamos foto de cómo quedó.' },
];

const faqGlobos = [
  { q: '¿Qué es un globo de burbuja personalizado?',
    a: 'Es el globo transparente con el mensaje impreso encima, relleno de confeti o con globos pequeños adentro. Es el que más se ve en las fotos, porque se lee el nombre y la ocasión sin explicar nada.' },
  { q: '¿Cuánto dura inflado?',
    a: 'El globo de burbuja aguanta bastante más que uno de látex común. Para que llegue perfecto lo inflamos el mismo día de la entrega.' },
  { q: '¿Puedo pedir solo el globo, sin ancheta?',
    a: 'Sí. Hay pedidos que son solo el globo con el mensaje, y funcionan igual de bien. También se puede sumar a un ramo o a una cajita.' },
];

const faqCumple = [
  { q: '¿Hacen detalles para niños y para adultos?',
    a: 'Para los dos, y no se arman igual. El de un niño va por el personaje y los colores; el de un adulto va por lo que esa persona toma, come o colecciona. Dinos la edad y algo que le guste y con eso basta.' },
  { q: '¿Con cuánto tiempo hay que pedir?',
    a: 'Entre más días, mejor, sobre todo si el detalle lleva algo impreso o mandado a hacer. Para saber si una fecha está libre basta un mensaje.' },
  { q: '¿Pueden entregarlo a medianoche o en la oficina?',
    a: 'Las entregas se cuadran dentro del horario de atención, de 9 de la mañana a 10 de la noche. Si necesitas una hora puntual —la salida del trabajo, antes de una reunión— dínoslo al pedir y lo organizamos.' },
];

const faqGrado = [
  { q: '¿Qué se acostumbra regalar en un grado?',
    a: 'Lo que más piden es el arreglo con globos en negro y dorado, el globo con el nombre y «felicitaciones», y una ancheta con algo que la persona vaya a usar ahora que empieza otra cosa. Se puede sumar el diploma simbólico o una foto.' },
  { q: '¿Se puede poner el nombre y la carrera?',
    a: 'Sí, va impreso. Mándanos el nombre y el texto exactamente como quieres que quede, que en los grados es donde más se cuidan las tildes y los apellidos.' },
  { q: '¿Entregan en la universidad o en el sitio de la ceremonia?',
    a: 'Sí, si nos das la dirección y una hora. En un grado conviene cuadrar la entrega con alguien que esté allá, porque los horarios de ceremonia se corren.' },
];

/* --------------------------------------------------------------------------- */

export const PAGINE = [

  /* ------------------------------------------------------------------ ANCHETAS */
  {
    ruta: 'anchetas',
    miga: 'Anchetas',
    title: 'Anchetas personalizadas a domicilio en Medellín — ALEmagia',
    desc: 'Anchetas armadas a pedido con mecato, chocolates, globos con mensaje y flores. Domicilio en Medellín y alrededores. Escríbenos y te armamos la tuya.',
    occhiello: 'Anchetas',
    h1: 'Anchetas armadas para una persona, no para un catálogo.',
    intro: 'Mecato, chocolates, un globo con su nombre y lo que le dé sentido al detalle. Se arma según para quién es y se entrega a domicilio en Medellín.',
    og: 'o1.webp',
    datos: [servicioDatos('Anchetas personalizadas a domicilio', 'Anchetas y canastas de regalo armadas a pedido con mecato, chocolates, globos personalizados y flores, con entrega a domicilio en Medellín.'), faqDatos(faqAnchetas)],
    cuerpo: (r) => `
${UNA(r, { f: 'o1.webp', alt: 'Ancheta de cumpleaños con mecato, bebidas y fotos impresas sobre base de madera, con globos azules y plateados', w: 900, h: 1200 })}
${INCLUYE('Cómo se arma', [
  { t: 'La base', d: 'Mecato y chocolates escogidos, montados sobre base de madera o dentro de canasta. Es lo que le da cuerpo al detalle y lo que primero se ve.' },
  { t: 'El globo con el mensaje', d: 'Globo de burbuja transparente con el nombre y la ocasión impresos. Es lo que hace que la foto se entienda sola.' },
  { t: 'Las flores', d: 'Si el detalle las pide. Frescas, escogidas en los colores del resto para que no parezcan dos regalos pegados.' },
  { t: 'Lo que tú sumes', d: 'Un peluche, una botella, un perfume, algo que nos mandes tú. Lo montamos dentro para que llegue todo junto.' },
  { t: 'La dedicatoria', d: 'Impresa en el globo o en tarjeta. Mándanosla tal cual quieres que quede.' },
  { t: 'La entrega', d: 'A domicilio en Medellín y alrededores, en el día y la franja de hora que nos digas.' },
])}
${PROSA([
  'La pregunta con la que empezamos no es cuánto quieres gastar: es para quién es. Una ancheta para una mamá, una para un novio y una para un compañero de trabajo no llevan lo mismo ni se ven igual, aunque cuesten parecido.',
  'Si nos dices qué le gusta a la persona —lo que toma, lo que come, el equipo del que es— armamos el detalle alrededor de eso. Sale mejor que una lista, y se nota al abrirlo.',
])}
${DUO(r,
  { f: 'o5.webp', alt: 'Arco de globos infantil con globo de burbuja transparente encima y desayuno en bandeja de madera', w: 804, h: 688 },
  { f: 'o4.webp', alt: 'Caja de rosas rojas con bombones y mariposa dorada, con globo de burbuja de San Valentín', w: 900, h: 1200 })}
${PREGUNTAS(faqAnchetas)}`,
  },

  /* -------------------------------------------------------- DESAYUNOS SORPRESA */
  {
    ruta: 'desayunos-sorpresa',
    miga: 'Desayunos sorpresa',
    title: 'Desayunos sorpresa a domicilio en Medellín — ALEmagia',
    desc: 'Desayunos sorpresa con globo, flores y dedicatoria, entregados a domicilio en Medellín. Pide desde donde estés y nosotros llevamos.',
    occhiello: 'Desayunos sorpresa',
    h1: 'La sorpresa llega antes de que empiece el día.',
    intro: 'Desayuno armado a pedido, con globo, flores y la dedicatoria que nos mandes. Entregamos a domicilio en Medellín, también si tú estás en otra ciudad.',
    og: 'o5.webp',
    datos: [servicioDatos('Desayunos sorpresa a domicilio', 'Desayunos sorpresa armados a pedido con bebida, panadería, fruta, globo personalizado y flores, entregados a domicilio en Medellín.'), faqDatos(faqDesayunos)],
    cuerpo: (r) => `
${UNA(r, { f: 'o5.webp', alt: 'Arco de globos infantil con globo de burbuja transparente encima y desayuno en bandeja de madera', w: 804, h: 688 })}
${INCLUYE('Qué lleva', [
  { t: 'El desayuno', d: 'Bebida, panadería, fruta y un dulce. Si la persona tiene alguna restricción, dínoslo y lo cambiamos sin problema.' },
  { t: 'El globo con el mensaje', d: 'Con el nombre y lo que le quieras decir. Es lo que convierte un desayuno en un detalle.' },
  { t: 'Las flores', d: 'Frescas, en los colores del resto del arreglo.' },
  { t: 'La tarjeta', d: 'Escrita con tu dedicatoria. Mándanos el texto y los nombres bien escritos.' },
  { t: 'La foto de la entrega', d: 'Te mandamos foto de cómo quedó y de que llegó. Si pides desde otra ciudad, es la parte que más tranquiliza.' },
])}
${PROSA([
  'La mitad de los desayunos que entregamos los pide alguien que no está en Medellín. Escriben desde otra ciudad o desde otro país, nos dan la dirección, y la sorpresa la recibe la persona aquí. Por eso mandamos foto: es la única forma de que quien lo pidió vea lo que pasó.',
  'Para una entrega temprano conviene dejarlo cuadrado el día anterior. Nuestro horario de atención es de 9 de la mañana a 10 de la noche, y dentro de esa franja armamos la hora que necesites.',
])}
${DUO(r,
  { f: 'o2.webp', alt: 'Arco de globos infantil con personajes y globo de burbuja', w: 804, h: 688 },
  { f: 'o2.webp', alt: 'Arco de globos infantil con personajes y globo de burbuja', w: 804, h: 688 })}
${PREGUNTAS(faqDesayunos)}`,
  },

  /* ---------------------------------------------------------------- GLOBOS */
  {
    ruta: 'globos-personalizados',
    miga: 'Globos personalizados',
    title: 'Globos de burbuja personalizados con nombre en Medellín — ALEmagia',
    desc: 'Globos de burbuja transparentes con nombre, mensaje y confeti, solos o dentro de un detalle. Personalizados e inflados el mismo día. Medellín a domicilio.',
    occhiello: 'Globos personalizados',
    h1: 'El globo que dice el nombre.',
    intro: 'Globos de burbuja transparentes con el mensaje impreso y confeti adentro. Solos, sobre una ancheta o junto a un ramo. Es lo que hace que la foto se entienda sin explicar.',
    og: 'o5.webp',
    datos: [servicioDatos('Globos de burbuja personalizados', 'Globos de burbuja transparentes personalizados con nombre y mensaje, con confeti o globos interiores, solos o integrados en detalles.'), faqDatos(faqGlobos)],
    cuerpo: (r) => `
${UNA(r, { f: 'o5.webp', alt: 'Arco de globos infantil con globo de burbuja transparente encima y desayuno en bandeja de madera', w: 804, h: 688 })}
${INCLUYE('Lo que se puede pedir', [
  { t: 'Globo con nombre y ocasión', d: 'El mensaje va impreso encima del globo transparente. Cumpleaños, grado, aniversario, lo que sea: se lee de una.' },
  { t: 'Relleno de confeti', d: 'En los colores del detalle. Es lo que le da el brillo que se ve en las fotos.' },
  { t: 'Globos adentro', d: 'Globos pequeños dentro del de burbuja, en vez de confeti. Se usa mucho en corazones para amor y amistad.' },
  { t: 'Arreglos con varios globos', d: 'Columnas, mazos y arreglos con peso para mesa, en los colores que nos digas.' },
  { t: 'Sumado a otro detalle', d: 'Sobre una ancheta, junto a un ramo o encima de una cajita. Es la pieza que amarra todo el arreglo.' },
])}
${PROSA([
  'El globo es la parte del detalle que hace el trabajo en la foto. Un arreglo precioso sin nada escrito obliga a explicar qué se está celebrando; con el nombre y la ocasión impresos, la foto se entiende sola y es la que la persona publica.',
  'Por eso pedimos el texto exactamente como quieres que quede, con los nombres y las tildes. Un nombre mal escrito en un globo no se arregla el día de la entrega.',
])}
${DUO(r,
  { f: 'o3.webp', alt: 'Arreglo de grado con arco de globos negros y dorados, birrete y globo de burbuja personalizado', w: 900, h: 1200 },
  { f: 'o2.webp', alt: 'Arco de globos infantil con personajes', w: 804, h: 688 })}
${PREGUNTAS(faqGlobos)}`,
  },

  /* ------------------------------------------------------------- CUMPLEAÑOS */
  {
    ruta: 'detalles-cumpleanos',
    miga: 'Detalles de cumpleaños',
    title: 'Detalles y anchetas de cumpleaños a domicilio en Medellín — ALEmagia',
    desc: 'Detalles de cumpleaños para niños y adultos: anchetas, globos con el nombre, flores y dedicatoria. Entrega a domicilio en Medellín y alrededores.',
    occhiello: 'Cumpleaños',
    h1: 'Un detalle que se nota que era para esa persona.',
    intro: 'Anchetas, globos con el nombre y arreglos armados según de quién sea el cumpleaños. Para niños va por el personaje; para adultos, por lo que esa persona de verdad usa.',
    og: 'o1.webp',
    datos: [servicioDatos('Detalles de cumpleaños a domicilio', 'Anchetas, globos personalizados y arreglos de cumpleaños para niños y adultos, con entrega a domicilio en Medellín.'), faqDatos(faqCumple)],
    cuerpo: (r) => `
${UNA(r, { f: 'o1.webp', alt: 'Ancheta de cumpleaños con mecato, bebidas y fotos impresas sobre base de madera, con globos azules y plateados', w: 900, h: 1200 })}
${INCLUYE('Cómo lo armamos', [
  { t: 'Para niños', d: 'Va por el personaje y los colores. El globo con el nombre, mecato que se puedan comer ellos, y el arreglo montado para que se vea grande en la foto.' },
  { t: 'Para adultos', d: 'Va por lo que la persona toma, come o colecciona. Dinos algo que le guste y el detalle se arma alrededor de eso.' },
  { t: 'El número', d: 'Los años en globo, si el número cuenta. En los redondos es lo primero que se busca en la foto.' },
  { t: 'La dedicatoria', d: 'Impresa en el globo o en tarjeta, con el texto tal cual nos lo mandes.' },
  { t: 'La entrega', d: 'A domicilio en Medellín, en la franja de hora que necesites dentro de nuestro horario.' },
])}
${PROSA([
  'La diferencia entre un detalle que gusta y uno que se recuerda casi nunca está en el tamaño. Está en que la persona abra y reconozca algo suyo: la marca que toma, el color que usa, el equipo del que es.',
  'Por eso preguntamos poco pero preguntamos eso. Con la edad y dos cosas que le gusten ya se puede armar un detalle que no parezca comprado en la esquina.',
])}
${DUO(r,
  { f: 'o5.webp', alt: 'Arco de globos infantil con globo de burbuja transparente encima y desayuno en bandeja de madera', w: 804, h: 688 },
  { f: 'o6.webp', alt: 'Arco de globos cromados en rosado y dorado con letrero de cumpleaños y bandeja con detalles', w: 804, h: 688 })}
${PREGUNTAS(faqCumple)}`,
  },

  /* ------------------------------------------------------------------ GRADO */
  {
    ruta: 'regalos-grado',
    miga: 'Regalos de grado',
    title: 'Regalos y arreglos de grado a domicilio en Medellín — ALEmagia',
    desc: 'Arreglos de grado con globos negros y dorados, globo con el nombre y la carrera, anchetas y flores. Entrega a domicilio en Medellín.',
    occhiello: 'Grados',
    h1: 'El día que se trabajó durante años.',
    intro: 'Arreglos de grado con globos en negro y dorado, el nombre y la carrera impresos, y la ancheta que lo acompaña. Se entrega donde nos digas.',
    og: 'o3.webp',
    datos: [servicioDatos('Regalos y arreglos de grado', 'Arreglos de grado con globos personalizados, anchetas y flores, con entrega a domicilio en Medellín.'), faqDatos(faqGrado)],
    cuerpo: (r) => `
${UNA(r, { f: 'o3.webp', alt: 'Arreglo de grado con arco de globos negros y dorados, birrete y globo de burbuja personalizado', w: 900, h: 1200 })}
${INCLUYE('Qué se suele pedir', [
  { t: 'El arreglo en negro y dorado', d: 'Es el que más piden y el que mejor se ve en las fotos de ese día. Globos cromados, opacos y transparentes en el mismo diseño.' },
  { t: 'El globo con el nombre', d: 'Nombre, «felicitaciones» y la carrera si quieres. Mándanos el texto exacto: en los grados es donde más se cuidan las tildes y los apellidos.' },
  { t: 'La ancheta', d: 'Con algo que la persona vaya a usar ahora que empieza otra etapa, no solo dulces.' },
  { t: 'Las flores', d: 'Un ramo que se pueda cargar sin estorbar en las fotos de la ceremonia.' },
  { t: 'La entrega', d: 'En la casa, en la universidad o donde sea la ceremonia. Conviene cuadrarla con alguien que esté allá.' },
])}
${PROSA([
  'Un grado tiene una particularidad que otros detalles no tienen: la foto no la toma quien regala, la toman veinte personas a la vez y termina en todas partes. El arreglo tiene que verse bien de lejos y leerse de cerca.',
  'Y tiene otra: los horarios de ceremonia se corren. Si nos dices con quién coordinamos la entrega allá, evitamos que el detalle llegue a un auditorio vacío.',
])}
${DUO(r,
  { f: 'o6.webp', alt: 'Arco de globos cromados en rosado y dorado con letrero de cumpleaños y bandeja con detalles', w: 804, h: 688 },
  { f: 'o4.webp', alt: 'Caja de rosas rojas con bombones y mariposa dorada, con globo de burbuja de San Valentín', w: 900, h: 1200 })}
${PREGUNTAS(faqGrado)}`,
  },

  /* --------------------------------------------------------------- ZONAS */
  {
    ruta: 'zonas-domicilio',
    miga: 'Dónde entregamos',
    title: 'Domicilios de detalles y anchetas en Medellín y el Área Metropolitana — ALEmagia',
    desc: 'Entregamos detalles, anchetas y desayunos sorpresa a domicilio en Medellín, Envigado, Itagüí, Sabaneta, Bello y La Estrella. Horario de 9 a. m. a 10 p. m.',
    occhiello: 'Dónde entregamos',
    h1: 'Medellín y el Área Metropolitana.',
    intro: 'Trabajamos a domicilio. Tú nos das la dirección, el día y la franja de hora, y nosotros llevamos el detalle hasta allá.',
    og: 'o2.webp',
    cuerpo: (r) => `
${INCLUYE('Las zonas', [
  { t: 'Medellín', d: 'Toda la ciudad. Es donde más entregamos y donde la hora se puede cuadrar con más precisión.' },
  { t: 'Envigado y Sabaneta', d: 'Entrega normal, coordinada el mismo día o el anterior según la hora que necesites.' },
  { t: 'Itagüí y La Estrella', d: 'Sí entregamos. Conviene avisar con algo de tiempo para cuadrar la franja.' },
  { t: 'Bello y Copacabana', d: 'También, avisando con tiempo.' },
  { t: 'Fuera del Área', d: 'Escríbenos antes de darlo por descartado: depende del día y de la distancia.' },
])}
${PROSA([
  'No tenemos local con vitrina: trabajamos a domicilio, y eso es a propósito. Significa que el detalle se arma para tu pedido y sale directo hacia la dirección que nos diste, sin pasar días en una estantería.',
  'Para que la entrega salga bien necesitamos tres cosas: la dirección completa con barrio y puntos de referencia, un teléfono de quien recibe, y una franja de hora. Nuestro horario de atención es de 9 de la mañana a 10 de la noche.',
])}
${DUO(r,
  { f: 'o2.webp', alt: 'Arco de globos infantil con personajes y globo de burbuja', w: 804, h: 688 },
  { f: 'o6.webp', alt: 'Arco de globos cromados en rosado y dorado con letrero de cumpleaños y bandeja con detalles', w: 804, h: 688 })}`,
  },

  /* --------------------------------------------------------- QUIÉNES SOMOS */
  {
    ruta: 'quienes-somos',
    miga: 'Quiénes somos',
    title: 'Quiénes somos — ALEmagia, detalles personalizados en Medellín',
    desc: 'ALEmagia es un taller de detalles personalizados en Medellín. Cada ancheta se arma a pedido, se fotografía y se entrega a domicilio.',
    occhiello: 'Quiénes somos',
    h1: 'Detalles, amor y magia.',
    intro: 'ALEmagia es un taller de detalles personalizados en Medellín. No hay catálogo cerrado: cada detalle se arma para el pedido que llega y para la persona que lo va a recibir.',
    og: 'taller.webp',
    cuerpo: (r) => `
  <section class="ritratto-blocco">
    <div class="wrap dossier">
      <figure class="ritratto svela" data-par>${IMG(r, 'taller.webp', 'Caja de rosas rojas con bombones y mariposa dorada, sostenida en la mano, con un globo de burbuja rosado encima', 900, 1125)}</figure>
      <div>
        <h2 class="rivela">Se arma a pedido, no se saca de una estantería</h2>
        <p class="guida rivela">Cada detalle se monta cuando entra el pedido. Por eso se puede cambiar lo que lleva adentro, sumar algo que tú nos mandes o ajustar los colores a lo que estás celebrando.</p>
        <p class="guida rivela">Y por eso preguntamos para quién es antes de preguntar cuánto quieres gastar. Es lo que hace que la persona que lo recibe reconozca algo suyo al abrirlo.</p>
      </div>
    </div>
  </section>
${PROSA([
  'Trabajamos a domicilio en Medellín y el Área Metropolitana. Tú nos escribes por WhatsApp con la fecha, la dirección y para quién es; nosotros armamos, te mandamos foto de cómo quedó y lo llevamos.',
  'Buena parte de los pedidos los hace alguien que no está en la ciudad. Escriben desde otra parte del país o desde fuera, y la sorpresa la recibe alguien aquí. La foto de la entrega es la forma de cerrar eso.',
])}
${DUO(r,
  { f: 'o6.webp', alt: 'Arco de globos cromados en rosado y dorado con letrero de cumpleaños y bandeja con detalles', w: 804, h: 688 },
  { f: 'o5.webp', alt: 'Arco de globos infantil con globo de burbuja transparente encima y desayuno en bandeja de madera', w: 804, h: 688 })}
  <section class="zone-blocco">
    <div class="wrap">
      <h2 class="rivela">Dónde entregamos</h2>
      <p class="guida rivela">Medellín, Envigado, Itagüí, Sabaneta, Bello y La Estrella. Horario de atención de 9 de la mañana a 10 de la noche, todos los días.</p>
      <p class="rivela"><a class="link-testo" href="${r}zonas-domicilio/">Ver todas las zonas</a></p>
    </div>
  </section>`,
  },

  /* ---------------------------------------------------- PREGUNTAS FRECUENTES */
  (() => {
    const qa = [
      { q: '¿Cuánto cuesta un detalle?',
        a: 'No hay un precio único: cambia con el tamaño, con lo que lleve adentro y con si es solo un globo o una ancheta completa. Escríbenos por WhatsApp con la ocasión y un presupuesto aproximado, y te mandamos opciones dentro de eso.' },
      { q: '¿Entregan a domicilio y en qué zonas?',
        a: 'Sí, trabajamos a domicilio. Medellín, Envigado, Itagüí, Sabaneta, Bello y La Estrella. Fuera del Área Metropolitana escríbenos antes de descartarlo: depende del día y de la distancia.' },
      { q: '¿Cuál es el horario de atención?',
        a: 'De 9 de la mañana a 10 de la noche, todos los días. Las entregas se cuadran dentro de esa franja.' },
      { q: '¿Puedo pedir desde otra ciudad o desde el exterior?',
        a: 'Sí, y es algo que hacemos seguido. Tú escribes desde donde estés, nos das la dirección en Medellín y nosotros entregamos. Te mandamos foto de cómo quedó y de que llegó.' },
      { q: '¿Con cuánto tiempo debo pedir?',
        a: 'Entre más días, mejor, sobre todo si el detalle lleva algo impreso —un globo con nombre— o algo mandado a hacer. Para saber si una fecha está libre basta un mensaje.' },
      { q: '¿Puedo escoger lo que lleva adentro?',
        a: 'Sí. Puedes mandarnos la lista, o decirnos un presupuesto y dejarnos armar. La segunda forma suele quedar mejor montada, porque sabemos qué se ve bien junto.' },
      { q: '¿Se le puede poner una dedicatoria o una foto?',
        a: 'Sí. El mensaje va impreso en el globo o escrito en tarjeta, y también podemos montar fotos en la base del arreglo. Mándanos el texto tal cual quieres que quede, con los nombres bien escritos.' },
      { q: '¿Qué pasa si la persona no está cuando llegan?',
        a: 'Por eso pedimos un teléfono de quien recibe y una franja de hora en vez de una hora exacta. Si no hay nadie, llamamos y cuadramos de nuevo contigo.' },
      { q: '¿Hacen detalles para empresas?',
        a: 'Sí: fechas especiales, reconocimientos y detalles para clientes o para el equipo. Se arman iguales entre sí y se entregan juntos.' },
      { q: '¿Cómo se pide?',
        a: 'Por WhatsApp, que es lo más rápido, o llenando el formulario de la página de contacto. Necesitamos la ocasión, la fecha, la zona de entrega y para quién es.' },
    ];
    return {
      ruta: 'preguntas-frecuentes',
      miga: 'Preguntas frecuentes',
      title: 'Preguntas frecuentes sobre detalles a domicilio en Medellín — ALEmagia',
      desc: 'Precios, zonas de domicilio, horarios, pedidos desde otra ciudad, dedicatorias y tiempos. Las respuestas a lo que más nos preguntan.',
      occhiello: 'Preguntas frecuentes',
      h1: 'Lo que más nos preguntan.',
      intro: 'Casi todo lo que hace falta saber antes de pedir está aquí abajo. Si falta algo, un mensaje por WhatsApp es el camino más corto.',
      og: 'o1.webp',
      datos: [faqDatos(qa)],
      cuerpo: (r) => `
  <section class="faq faq-lunga">
    <div class="wrap">
      <div class="faq-elenco">
        ${qa.map((x, i) => `<details class="rivela"${i === 0 ? ' open' : ''}><summary>${x.q}</summary><p>${x.a}</p></details>`).join('\n        ')}
      </div>
      <p class="nota-vuoto rivela"><b>Nota para la dueña:</b> las respuestas sobre tiempos de pedido, zonas y qué pasa si nadie recibe son una propuesta escrita por Digitatex a partir de lo que el perfil ya cuenta. Hay que leerlas y corregir lo que no corresponda a cómo trabajas de verdad — sobre todo lo de los plazos y lo del reintento de entrega.</p>
    </div>
  </section>`,
    };
  })(),

  /* --------------------------------------------------------------- CONTACTO */
  {
    ruta: 'contacto',
    miga: 'Contacto',
    title: 'Contacto y pedidos — ALEmagia, detalles a domicilio en Medellín',
    desc: 'Escríbenos por WhatsApp o llena el formulario. Horario de 9 a. m. a 10 p. m. Domicilios en Medellín y el Área Metropolitana.',
    occhiello: 'Contacto',
    h1: 'Cuéntanos el detalle.',
    intro: 'Con la ocasión, la fecha, la zona de entrega y para quién es, ya podemos armarte opciones y darte un precio.',
    og: 'o4.webp',
    ctaTitulo: '¿Prefieres escribir directo?',
    ctaTexto: 'Para una pregunta rápida —si una fecha está libre, si algo se puede hacer— WhatsApp es el camino más corto.',
    cuerpo: (r) => `
  <section class="contatti-blocco">
    <div class="wrap contatti-griglia">
      <div>
        <h2 class="rivela">Cómo contactarnos</h2>
        <div class="contatti chiaro rivela">
          <div class="contatto">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z"/></svg>
            <div><b>WhatsApp</b><a href="https://walink.co/urh5jv" target="_blank" rel="noopener">Escribir ahora</a></div>
          </div>
          <div class="contatto">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.2 2"/></svg>
            <div><b>Horario de atención</b><span>9:00 a. m. a 10:00 p. m.<br>Todos los días</span></div>
          </div>
          <div class="contatto">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z"/><circle cx="12" cy="10" r="2.6"/></svg>
            <div><b>Dónde entregamos</b><span>Medellín y Área Metropolitana<br>Solo a domicilio</span></div>
          </div>
          <div class="contatto">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="3.6"/><circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none"/></svg>
            <div><b>Instagram</b><a href="https://www.instagram.com/alemagia_/" target="_blank" rel="noopener">@alemagia_</a></div>
          </div>
        </div>
        <p class="nota-vuoto rivela"><b>Por confirmar:</b> el número de WhatsApp escrito (hoy el contacto va por el enlace del perfil), un correo electrónico y el NIT o los datos de facturación si se van a mostrar. En cuanto lleguen, entran aquí y en los datos que lee Google.</p>
      </div>

      <div class="modulo-fuori rivela">
        ${MODULO}
      </div>
    </div>
  </section>`,
  },

];
