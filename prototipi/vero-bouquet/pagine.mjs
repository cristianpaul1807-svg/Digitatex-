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
 * ni años de experiencia, ni número de eventos, ni horarios, porque nadie nos
 * los ha dado y una web que promete lo que la clienta no ha dicho le crea un
 * problema a ella, no a nosotros. Lo que sí hay es descripción del servicio,
 * que sale de lo que ella misma publica.
 *
 * Las respuestas de las preguntas frecuentes que fijan una política —plazos,
 * anticipos, condiciones— van escritas como propuesta y marcadas como tales en
 * la propia página. Son las que ella tiene que corregir.
 */

const IMG = (r, f, alt, w, h) =>
  `<img src="${r}media/${f}" alt="${alt}" width="${w}" height="${h}" loading="lazy">`;

/* Bloque de dos fotos. `data-par` y `svela` los recoge el guion compartido: la
   foto se destapa al entrar y se mueve un poco dentro de su marco. */
const DUO = (r, a, b) => `
  <section class="banda-foto">
    <div class="wrap duo">
      <figure class="svela" data-par>${IMG(r, a.f, a.alt, a.w, a.h)}</figure>
      <figure class="svela" data-par>${IMG(r, b.f, b.alt, b.w, b.h)}</figure>
    </div>
  </section>`;

/* Lista numerada de lo que incluye el servicio. Es la parte que más se lee de
   una página de servicio: contesta «¿qué me dan exactamente por ese dinero?». */
const INCLUYE = (titulo, items) => `
  <section class="lista-blocco">
    <div class="wrap">
      <h2 class="rivela">${titulo}</h2>
      <div class="elenco">
        ${items.map((i, n) => `<div class="voce rivela"><b>${String(n + 1).padStart(2, '0')}</b><div><h3>${i.t}</h3><p>${i.d}</p></div></div>`).join('\n        ')}
      </div>
    </div>
  </section>`;

/* Texto largo a dos columnas. */
const PROSA = (parrafos) => `
  <section class="prosa">
    <div class="wrap">
      ${parrafos.map((t) => `<p class="rivela">${t}</p>`).join('\n      ')}
    </div>
  </section>`;

/* Preguntas al pie de una página de servicio. Van también al JSON-LD de esa
   página, que es lo que hace que Google pueda enseñarlas desplegadas. */
const PREGUNTAS = (qa) => `
  <section class="faq">
    <div class="wrap">
      <h2 class="rivela">Domande frequenti</h2>
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
  provider: { '@id': 'https://digitatex.com/prototipi/vero-bouquet/#negozio' },
  areaServed: [
    { '@type': 'City', name: "Sant'Ilario d'Enza" },
    { '@type': 'City', name: 'Reggio Emilia' },
    { '@type': 'City', name: 'Parma' },
  ],
  description: desc,
});

/* --------------------------------------------------------------------------- */

const faqCompleanno = [
  { q: 'Quanto costa un arco di palloncini per un compleanno?',
    a: 'Dipende dalla misura, dal numero di palloncini e dal tipo: opachi, cromati o trasparenti costano diversamente. Il preventivo è gratuito e arriva entro 24 ore: basta dirci dove si fa la festa, quanti invitati e che colori avete in mente.' },
  { q: 'Montate voi o devo montare io?',
    a: 'Montiamo noi, sul posto, e torniamo a smontare. Il montaggio e lo smontaggio sono compresi nel prezzo dell’allestimento.' },
  { q: 'Si può fare anche in casa e non in una sala?',
    a: 'Sì. Una buona parte degli allestimenti si monta in case private: serve solo sapere quanto spazio c’è e se c’è una parete libera da usare come sfondo.' },
  { q: 'Quanto durano i palloncini a elio?',
    a: 'I palloncini in lattice trattati tengono comodamente la giornata della festa. Quelli in mylar, cioè i cromati e le forme, durano molto di più. Per una festa che dura tutto il giorno si monta la mattina stessa.' },
];

const faqDiciottesimo = [
  { q: 'Cosa serve davvero per un diciottesimo?',
    a: 'Le tre cose che finiscono in tutte le foto: una parete o un fondale, il numero 18 luminoso e un arco di palloncini che li leghi. Il resto è in più.' },
  { q: 'Fate anche l’insegna al neon con una frase nostra?',
    a: 'Sì, le insegne al neon si fanno su misura con la frase o il nome che scegliete. Vanno chieste con più anticipo degli altri elementi, perché si producono apposta.' },
  { q: 'I numeri luminosi si comprano o si noleggiano?',
    a: 'Si noleggiano per la giornata. Sono alti circa un metro, a lampadine, e li portiamo e ritiriamo noi.' },
];

const faqMatrimonio = [
  { q: 'Vi occupate sia dei fiori sia dei palloncini?',
    a: 'Sì, ed è il motivo per cui ha senso affidarli alla stessa persona: la parte floreale e quella dei palloncini vengono pensate insieme, con la stessa palette, invece di essere sommate all’ultimo.' },
  { q: 'Fate anche il bouquet della sposa?',
    a: 'Sì, il bouquet della sposa e le composizioni per i tavoli, coordinati con l’allestimento della cerimonia.' },
  { q: 'Si può fare all’aperto?',
    a: 'Sì. Per gli allestimenti esterni si valuta insieme la posizione: il sole diretto e il vento cambiano il modo di ancorare le strutture, e va deciso prima, non la mattina stessa.' },
];

const faqBattesimo = [
  { q: 'Fate anche il baby shower e il primo compleanno?',
    a: 'Sì. Battesimo, nascita, baby shower e primo compleanno si allestiscono con lo stesso criterio: toni delicati e composizioni basse, che non coprono i tavoli e non stancano nelle foto.' },
  { q: 'Si può avere il nome del bambino nell’allestimento?',
    a: 'Sì, il nome si ritaglia su misura nel carattere che scegliete e si applica sul fondale. Dopo la festa resta come ricordo.' },
  { q: 'Quanto tempo prima conviene chiedere?',
    a: 'Prima si chiede, più è probabile che la data sia libera e che si faccia in tempo a produrre gli elementi su misura, come il nome ritagliato. Per sapere se una data è ancora disponibile basta un messaggio.' },
];

export const PAGINE = [

  /* ---------------------------------------------------------------- CHI SIAMO */
  {
    ruta: 'chi-siamo',
    miga: 'Chi siamo',
    title: "Chi siamo — Vero Bouquet, allestimenti con palloncini a Sant'Ilario d'Enza",
    desc: "Vero Bouquet è il laboratorio di Veronika Kurylo a Sant'Ilario d'Enza: allestimenti con palloncini e fiori disegnati, preparati e montati dalla stessa persona. Reggio Emilia e Parma.",
    occhiello: 'Chi siamo',
    h1: 'Una sola persona, dalla prima idea al montaggio.',
    intro: "Vero Bouquet è il laboratorio di Veronika Kurylo a Sant'Ilario d'Enza. Non c'è un'agenzia dietro: chi disegna l'allestimento è la stessa che lo prepara e viene a montarlo.",
    og: 'vero.webp',
    cuerpo: (r) => `
  <section class="ritratto-blocco">
    <div class="wrap dossier">
      <figure class="ritratto svela" data-par>${IMG(r, 'vero.webp', 'Mani che legano palloncini rosa, avorio e cromati su una striscia da ghirlanda, sul tavolo da lavoro', 900, 1125)}</figure>
      <div>
        <h2 class="rivela">Perché questo cambia il risultato</h2>
        <p class="guida rivela">Quando la persona che disegna è la stessa che monta, non c'è niente che si perda nel passaggio. Il disegno si fa già sapendo quanto spazio c'è, dove sono le prese, a che ora si può entrare e quanto tempo serve per montare.</p>
        <p class="guida rivela">È anche il motivo per cui possiamo dire di sì tanto a una festa in casa da trenta persone quanto a un diciottesimo in sala da duecento: è la stessa persona che valuta se una cosa si può fare in quel posto e in quel tempo.</p>
      </div>
    </div>
  </section>
${PROSA([
  "La parte floreale e quella dei palloncini nascono insieme. Sono due mestieri diversi che quasi sempre finiscono in mani diverse, e si vede: i fiori vanno per conto loro e i palloncini per il loro. Qui si scelgono nella stessa palette, nello stesso momento.",
  "Il primo passo è sempre lo stesso: capire dove si fa la festa. Uno spazio al chiuso e uno all'aperto non si allestiscono nello stesso modo, e una parete libera cambia tutto, perché è lo sfondo di ogni fotografia della serata.",
])}
${DUO(r,
  { f: 'g9.webp', alt: 'Lettere luminose accanto a un arco di palloncini crema e oro', w: 900, h: 1117 },
  { f: 'g8.webp', alt: 'Dettaglio ravvicinato di palloncini cromati e opachi', w: 900, h: 1117 })}
  <section class="zone-blocco">
    <div class="wrap">
      <h2 class="rivela">Dove lavoriamo</h2>
      <p class="guida rivela">Sant'Ilario d'Enza, Reggio Emilia, Parma e i comuni intorno. Il montaggio e lo smontaggio sono compresi: arriviamo, montiamo, e alla fine della festa torniamo a portare via tutto.</p>
      <p class="rivela"><a class="link-testo" href="${r}zone/">Vedi tutte le zone servite</a></p>
    </div>
  </section>`,
  },

  /* ------------------------------------------------------- DOMANDE FREQUENTI */
  (() => {
    const qa = [
      { q: 'Quanto costa un allestimento?',
        a: 'Non c’è un prezzo unico, perché cambia tutto con la misura: un arco sul tavolo della torta e una parete intera non sono la stessa cosa. Il preventivo è gratuito e arriva entro 24 ore. Per farlo servono tre informazioni: dove si fa la festa, quanti invitati e che colori avete in mente.' },
      { q: 'Il montaggio è compreso nel prezzo?',
        a: 'Sì. Montaggio e smontaggio sono compresi. Arriviamo prima della festa, montiamo sul posto, e alla fine torniamo a portare via tutto.' },
      { q: 'In che zone lavorate?',
        a: 'Sant’Ilario d’Enza, Reggio Emilia, Parma e i comuni intorno. Per un posto fuori da questa zona basta chiedere: dipende dalla data e dalla distanza.' },
      { q: 'Lavorate anche in case private?',
        a: 'Sì, e capita spesso. Serve solo sapere quanto spazio c’è e se c’è una parete libera: quella parete è lo sfondo di tutte le foto della serata, quindi si sceglie per prima.' },
      { q: 'Quanto tempo prima devo prenotare?',
        a: 'Prima si chiede, più è probabile che la data sia libera. Gli elementi su misura — un nome ritagliato, un’insegna al neon con una frase vostra — vanno chiesti con più anticipo degli altri, perché si producono apposta. Per sapere se una data è ancora disponibile basta un messaggio.' },
      { q: 'Quanto durano i palloncini?',
        a: 'I palloncini in lattice trattati tengono la giornata della festa. Quelli in mylar, cioè i cromati e le forme, durano molto di più. Per una festa che dura tutto il giorno si monta la mattina stessa.' },
      { q: 'Posso scegliere i colori?',
        a: 'Sì, ed è la parte da cui conviene partire. Se avete già in mente una palette, o anche solo una foto salvata da Instagram o Pinterest, mandatecela: si capisce in un secondo quello che con le parole richiede dieci messaggi.' },
      { q: 'Fate anche i fiori, o solo palloncini?',
        a: 'Tutti e due, ed è il motivo per cui conviene affidarli alla stessa persona: fiori freschi o stabilizzati, bouquet e centrotavola, scelti nella stessa palette dell’allestimento invece che sommati alla fine.' },
      { q: 'Si può fare all’aperto?',
        a: 'Sì. Per gli esterni si decide insieme la posizione prima, non la mattina stessa: il sole diretto e il vento cambiano il modo di ancorare le strutture.' },
      { q: 'Fate anche allestimenti per negozi e aziende?',
        a: 'Sì: inaugurazioni, anniversari, vetrine e stand, nei colori del marchio. Si montano fuori dall’orario di apertura, per non fermare il lavoro.' },
      { q: 'Come si prenota?',
        a: 'Con un messaggio su WhatsApp o compilando il modulo dei contatti. Rispondiamo entro 24 ore con una proposta e un prezzo, e vi diciamo subito se la data è ancora libera.' },
    ];
    return {
      ruta: 'domande-frequenti',
      miga: 'Domande frequenti',
      title: 'Domande frequenti su allestimenti con palloncini e fiori — Vero Bouquet',
      desc: 'Prezzi, tempi di prenotazione, montaggio compreso, zone servite, durata dei palloncini e allestimenti all’aperto. Le risposte alle domande che ci fanno più spesso.',
      occhiello: 'Domande frequenti',
      h1: 'Le domande che ci fanno più spesso.',
      intro: 'Le risposte qui sotto coprono quasi tutto quello che serve sapere prima di chiedere un preventivo. Se manca qualcosa, un messaggio su WhatsApp è la strada più veloce.',
      og: 'g7.webp',
      datos: [faqDatos(qa)],
      cuerpo: (r) => `
  <section class="faq faq-lunga">
    <div class="wrap">
      <div class="faq-elenco">
        ${qa.map((x, i) => `<details class="rivela"${i === 0 ? ' open' : ''}><summary>${x.q}</summary><p>${x.a}</p></details>`).join('\n        ')}
      </div>
      <p class="nota-vuoto rivela"><b>Nota per la titolare:</b> le risposte su tempi, zone e modalità di prenotazione sono una proposta scritta da Digitatex a partire da quello che il sito già racconta. Vanno lette e corrette dove non corrispondono al modo in cui lavorate davvero — soprattutto quelle sui tempi di preavviso.</p>
    </div>
  </section>`,
    };
  })(),

  /* ------------------------------------------------------------- COMPLEANNI */
  {
    ruta: 'allestimenti-compleanno',
    miga: 'Compleanni',
    title: 'Allestimenti compleanno con palloncini a Reggio Emilia e Parma — Vero Bouquet',
    desc: 'Archi di palloncini, pareti scintillanti e numeri luminosi per compleanni a Sant’Ilario d’Enza, Reggio Emilia e Parma. Montaggio compreso, preventivo in 24 ore.',
    occhiello: 'Compleanni',
    h1: 'Compleanni che si ricordano per come erano.',
    intro: 'Dall’arco sul tavolo della torta all’allestimento che prende tutta la parete. Con il numero luminoso, se il numero conta.',
    og: 'o1.webp',
    datos: [servicioDatos('Allestimenti per compleanni con palloncini', 'Archi e colonne di palloncini, pareti e fondali, numeri luminosi e centrotavola per feste di compleanno.'), faqDatos(faqCompleanno)],
    cuerpo: (r) => `
  <section class="banda-foto">
    <div class="wrap">
      <figure class="svela larga" data-par>${IMG(r, 'o1.webp', 'Arco di palloncini blu e argento cromato davanti a una parete a paillettes per una festa di compleanno', 900, 1117)}</figure>
    </div>
  </section>
${INCLUYE('Cosa comprende', [
  { t: 'Il fondale', d: 'Parete a paillettes, pannello ad arco tinta unita o fondale su misura. È lo sfondo di tutte le foto della serata, quindi si sceglie per primo.' },
  { t: 'L’arco di palloncini', d: 'Organico o a colonna, dal metro all’allestimento che gira intorno a una porta. Palloncini opachi, cromati e trasparenti nello stesso disegno.' },
  { t: 'Il numero luminoso', d: 'Alto circa un metro, a lampadine. A noleggio per la giornata: lo portiamo e lo ritiriamo noi.' },
  { t: 'I palloncini a elio', d: 'Sciolti, in mazzi o con il peso al tavolo. Anche solo questi, se la festa è in casa e serve poco.' },
  { t: 'Il tavolo', d: 'Centrotavola e composizioni basse, coordinati con i colori dell’allestimento.' },
  { t: 'Montaggio e smontaggio', d: 'Compresi. Montiamo prima della festa e alla fine torniamo a portare via tutto.' },
])}
${PROSA([
  'La domanda da cui si parte non è «quanti palloncini», è «dove». Uno spazio in casa e una sala non si allestiscono allo stesso modo, e la prima cosa da guardare è se c’è una parete libera: senza fondale, un arco bellissimo si perde su uno sfondo qualsiasi.',
  'Poi vengono i colori. Se avete già una foto salvata su Instagram o Pinterest, mandatecela: si capisce in un secondo quello che a parole richiede dieci messaggi.',
])}
${DUO(r,
  { f: 'i1.webp', alt: 'Palloncini cromati e rosa in primo piano', w: 620, h: 620 },
  { f: 'i6.webp', alt: 'Dettaglio di un arco organico di palloncini opachi e cromati', w: 620, h: 620 })}
${PREGUNTAS(faqCompleanno)}`,
  },

  /* ------------------------------------------------------------- DICIOTTESIMO */
  {
    ruta: 'allestimenti-diciottesimo',
    miga: '18 anni',
    title: 'Allestimenti 18 anni con palloncini e neon a Reggio Emilia — Vero Bouquet',
    desc: 'Pareti scintillanti, insegne al neon e numeri luminosi alti un metro per feste di diciottesimo a Sant’Ilario d’Enza, Reggio Emilia e Parma. Montaggio compreso.',
    occhiello: '18 anni',
    h1: 'La festa più fotografata di tutte.',
    intro: 'Un diciottesimo si giudica dalle foto che restano. Parete scintillante, insegna al neon, numero luminoso alto un metro: fatta per stare dentro un ritratto.',
    og: 'o2.webp',
    datos: [servicioDatos('Allestimenti per feste di diciottesimo', 'Pareti a paillettes, insegne al neon personalizzate, numeri luminosi e archi di palloncini per feste di 18 anni.'), faqDatos(faqDiciottesimo)],
    cuerpo: (r) => `
  <section class="banda-foto">
    <div class="wrap">
      <figure class="svela larga" data-par>${IMG(r, 'o2.webp', 'Allestimento per un diciottesimo con palloncini cipria, arco e insegna al neon accesa', 900, 1117)}</figure>
    </div>
  </section>
${INCLUYE('I tre pezzi che contano', [
  { t: 'La parete', d: 'A paillettes o tinta unita. È lo sfondo davanti a cui si mettono tutti, tutta la sera: se funziona quella, funzionano le foto.' },
  { t: 'Il 18 luminoso', d: 'Alto circa un metro, a lampadine, a noleggio per la giornata. È l’elemento che dice di che festa si tratta senza bisogno di scrivere niente.' },
  { t: 'L’insegna al neon', d: 'Con il nome o la frase che scegliete. Accesa fa anche da luce d’ambiente quando cala il sole. Va chiesta con più anticipo: si produce apposta.' },
  { t: 'L’arco di palloncini', d: 'Lega parete e numero in un’unica immagine. Opachi, cromati e trasparenti nello stesso disegno.' },
  { t: 'Il nome su misura', d: 'Ritagliato nel carattere che scegliete e applicato sul fondale. Dopo la festa resta come ricordo.' },
])}
${PROSA([
  'Il diciottesimo è la festa in cui l’allestimento lavora di più, perché è quella che viene fotografata di più. Non serve riempire lo spazio: serve che ci sia un punto, uno solo, dove tutti si mettono in posa e viene bene.',
  'Per questo l’ordine è sempre lo stesso: prima il fondale, poi la luce, poi i palloncini. Al contrario si finisce con tanti palloncini e nessun posto dove fare la foto.',
])}
${DUO(r,
  { f: 'i2.webp', alt: 'Insegna al neon accesa su un fondale chiaro', w: 620, h: 620 },
  { f: 'i5.webp', alt: 'Parete a paillettes dorate accanto a un arco di palloncini', w: 620, h: 620 })}
${PREGUNTAS(faqDiciottesimo)}`,
  },

  /* -------------------------------------------------------------- MATRIMONI */
  {
    ruta: 'allestimenti-matrimonio',
    miga: 'Matrimoni',
    title: 'Allestimenti matrimonio: fiori, bouquet e palloncini a Reggio Emilia — Vero Bouquet',
    desc: 'Bouquet della sposa, centrotavola, arco della cerimonia e tableau. Parte floreale e palloncini pensati insieme, a Sant’Ilario d’Enza, Reggio Emilia e Parma.',
    occhiello: 'Matrimoni',
    h1: 'I fiori e i palloncini, pensati insieme.',
    intro: 'Bouquet, centrotavola, arco della cerimonia e tableau. La parte floreale e quella dei palloncini nascono nella stessa palette, non sommate alla fine.',
    og: 'o4.webp',
    datos: [servicioDatos('Allestimenti floreali e con palloncini per matrimoni', 'Bouquet della sposa, composizioni per i tavoli, arco della cerimonia e tableau de mariage.'), faqDatos(faqMatrimonio)],
    cuerpo: (r) => `
  <section class="banda-foto">
    <div class="wrap">
      <figure class="svela larga" data-par>${IMG(r, 'o4.webp', 'Arco di palloncini bianchi e fiori per una cerimonia di matrimonio in giardino', 900, 1117)}</figure>
    </div>
  </section>
${INCLUYE('Cosa comprende', [
  { t: 'Il bouquet della sposa', d: 'Fiori freschi o stabilizzati, scelti insieme al resto dell’allestimento e non a parte.' },
  { t: 'L’arco della cerimonia', d: 'Floreale, di palloncini o misto. È il punto verso cui guardano tutti durante il rito e la cornice di ogni fotografia.' },
  { t: 'I centrotavola', d: 'Composizioni basse, che non tolgono la vista da un lato all’altro del tavolo e non costringono a spostarle per parlare.' },
  { t: 'Il tableau', d: 'Su misura, nel carattere e nei materiali coordinati con il resto.' },
  { t: 'Montaggio sul posto', d: 'Compreso, con orari concordati con la location. Alla fine torniamo a smontare.' },
])}
${PROSA([
  'Il motivo per cui ha senso affidare fiori e palloncini alla stessa persona è pratico, non estetico: sono due mestieri che di solito finiscono in mani diverse, e si vede. I fiori vanno per conto loro, i palloncini per il loro, e i colori non si parlano.',
  'Per gli allestimenti all’aperto la posizione si decide insieme, prima. Il sole diretto e il vento cambiano il modo di ancorare le strutture, e non è una cosa da risolvere la mattina stessa.',
])}
${DUO(r,
  { f: 'g10.webp', alt: 'Centrotavola con fiori, candele e palloncini sullo sfondo', w: 900, h: 1117 },
  { f: 'i4.webp', alt: 'Centrotavola di rose chiare con candele accese', w: 620, h: 620 })}
${PREGUNTAS(faqMatrimonio)}`,
  },

  /* ------------------------------------------------------ BATTESIMI E NASCITE */
  {
    ruta: 'allestimenti-battesimo',
    miga: 'Battesimi e nascite',
    title: 'Allestimenti battesimo, nascita e baby shower a Reggio Emilia — Vero Bouquet',
    desc: 'Toni delicati, nome del bambino su misura e composizioni basse per battesimi, nascite, baby shower e primo compleanno. Sant’Ilario d’Enza, Reggio Emilia e Parma.',
    occhiello: 'Battesimi e nascite',
    h1: 'Toni delicati, e il nome che resta.',
    intro: 'Battesimo, nascita, baby shower e primo compleanno. Composizioni basse che non coprono i tavoli, e il nome del bambino ritagliato su misura.',
    og: 'o3.webp',
    datos: [servicioDatos('Allestimenti per battesimi, nascite e baby shower', 'Allestimenti in toni delicati con palloncini, fiori e nome su misura per battesimi, nascite, baby shower e primo compleanno.'), faqDatos(faqBattesimo)],
    cuerpo: (r) => `
  <section class="banda-foto">
    <div class="wrap">
      <figure class="svela larga" data-par>${IMG(r, 'o3.webp', 'Allestimento delicato per battesimo in toni crema e beige con palloncini e fiori', 900, 1117)}</figure>
    </div>
  </section>
${INCLUYE('Cosa comprende', [
  { t: 'Il fondale in toni delicati', d: 'Crema, beige, bianco e i pastelli. Colori che non stancano nelle foto e che invecchiano bene nell’album.' },
  { t: 'Il nome su misura', d: 'Ritagliato nel carattere che scegliete e applicato sul fondale. Dopo la festa resta come ricordo, ed è la parte che più spesso viene conservata.' },
  { t: 'Composizioni basse', d: 'Pensate per non coprire i tavoli: si vede chi si ha davanti e non c’è niente da spostare per parlare.' },
  { t: 'Palloncini a elio', d: 'Sciolti, in mazzi o con il peso al tavolo. Anche solo questi, se la festa è in casa e serve poco.' },
  { t: 'Montaggio e smontaggio', d: 'Compresi, con orari concordati.' },
])}
${PROSA([
  'Battesimo, nascita, baby shower e primo compleanno si allestiscono con lo stesso criterio: meno saturazione, meno altezza, più materia. Sono feste che si guardano da vicino e che finiscono in fotografie che si riguardano per anni.',
  'Gli elementi su misura — il nome ritagliato in particolare — vanno chiesti con più anticipo degli altri, perché si producono apposta. Per il resto, basta sapere dove si fa e quanti siete.',
])}
${DUO(r,
  { f: 'i3.webp', alt: 'Lettere luminose a lampadine accanto a una ghirlanda di palloncini', w: 620, h: 620 },
  { f: 'g8.webp', alt: 'Dettaglio ravvicinato di palloncini cromati e opachi', w: 900, h: 1117 })}
${PREGUNTAS(faqBattesimo)}`,
  },

  /* ------------------------------------------------------------------- ZONE */
  {
    ruta: 'zone',
    miga: 'Dove lavoriamo',
    title: 'Allestimenti con palloncini a Reggio Emilia, Parma e Sant’Ilario d’Enza — Vero Bouquet',
    desc: 'Le zone servite da Vero Bouquet: Sant’Ilario d’Enza, Reggio Emilia, Parma e i comuni intorno. Montaggio e smontaggio compresi.',
    occhiello: 'Dove lavoriamo',
    h1: 'Sant’Ilario d’Enza, Reggio Emilia, Parma.',
    intro: 'Il laboratorio è a Sant’Ilario d’Enza, esattamente in mezzo tra Reggio Emilia e Parma. Montaggio e smontaggio sono compresi in tutta la zona.',
    og: 'g7.webp',
    cuerpo: (r) => `
${INCLUYE('Le zone servite', [
  { t: 'Sant’Ilario d’Enza', d: 'Il laboratorio è qui, in Via Matteotti. Per le feste in paese il montaggio si organizza con il minimo preavviso.' },
  { t: 'Reggio Emilia e provincia', d: 'Città e comuni intorno: Cavriago, Montecchio Emilia, Bibbiano, Campegine, Gattatico, Sant’Ilario, Calerno e la zona verso la via Emilia.' },
  { t: 'Parma e provincia', d: 'Città e comuni della prima fascia: Sorbolo, Lentigione, Brescello, Poviglio e la zona lungo l’Enza.' },
  { t: 'Fuori zona', d: 'Si può fare: dipende dalla data e dalla distanza. Basta chiedere prima di dare per scontato che sia troppo lontano.' },
])}
${PROSA([
  'Stare in mezzo tra Reggio Emilia e Parma non è un dettaglio dell’indirizzo: vuol dire che il montaggio in entrambe le città si fa nella stessa mattina, senza dover programmare la trasferta come un viaggio.',
  'Il montaggio e lo smontaggio sono compresi nel prezzo dell’allestimento in tutta la zona. Arriviamo prima della festa, montiamo sul posto, e alla fine torniamo a portare via tutto: non resta niente da smontare a voi.',
])}
${DUO(r,
  { f: 'g7.webp', alt: 'Sala eventi con una grande installazione di palloncini sospesa', w: 1600, h: 893 },
  { f: 'g9.webp', alt: 'Lettere luminose accanto a un arco di palloncini crema e oro', w: 900, h: 1117 })}`,
  },

  /* --------------------------------------------------------------- CONTATTI */
  {
    ruta: 'contatti',
    miga: 'Contatti',
    title: 'Contatti e preventivo gratuito — Vero Bouquet, Sant’Ilario d’Enza (RE)',
    desc: 'Telefono, WhatsApp, indirizzo e modulo per il preventivo. Rispondiamo entro 24 ore con una proposta e un prezzo. Sant’Ilario d’Enza, Reggio Emilia e Parma.',
    occhiello: 'Contatti',
    h1: 'Raccontaci la festa.',
    intro: 'Rispondiamo entro 24 ore con una proposta e un prezzo. Se la data è ancora libera, ve lo diciamo subito.',
    og: 'g7.webp',
    ctaTitulo: 'Preferisci scrivere su WhatsApp?',
    ctaTexto: 'Per una domanda veloce — se una data è libera, se una cosa si può fare — un messaggio è la strada più corta.',
    cuerpo: (r) => `
  <section class="contatti-blocco">
    <div class="wrap contatti-griglia">
      <div>
        <h2 class="rivela">Come raggiungerci</h2>
        <div class="contatti chiaro rivela">
          <div class="contatto">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z"/></svg>
            <div><b>Telefono e WhatsApp</b><a href="tel:+393287911076">328 791 1076</a></div>
          </div>
          <div class="contatto">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z"/><circle cx="12" cy="10" r="2.6"/></svg>
            <div><b>Dove siamo</b><span>Via Giacomo Matteotti 10/C<br>42049 Sant'Ilario d'Enza (RE)</span></div>
          </div>
          <div class="contatto">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="3.6"/><circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none"/></svg>
            <div><b>Instagram</b><a href="${'https://www.instagram.com/vero_bouquet/'}" target="_blank" rel="noopener">@vero_bouquet</a></div>
          </div>
        </div>
        <p class="nota-vuoto rivela"><b>Da confermare:</b> orari di apertura del laboratorio, indirizzo e-mail e partita IVA. Appena arrivano, entrano qui e nei dati strutturati che legge Google.</p>
      </div>

      <div class="modulo-fuori rivela">
        ${MODULO}
      </div>
    </div>
  </section>`,
  },

];
