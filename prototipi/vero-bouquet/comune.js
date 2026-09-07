/* ============================================================================
   VERO BOUQUET — comportamiento compartido por todas las páginas
   ----------------------------------------------------------------------------
   Aquí vive lo que TODA página necesita: la paleta, el ambiente de color del
   fondo, la barra, el menú de móvil, las entradas al hacer scroll, el paralaje,
   el botón de WhatsApp, la medida de la banda de prototipo y el formulario.

   Lo que se quedó en la portada es lo único que solo ella tiene: el vídeo
   recorrido por scroll y el motor de ocasiones. No tiene sentido cargarlos en
   una página de preguntas frecuentes.

   Cada página llama a las funciones que le hacen falta desde su propio
   DOMContentLoaded, en vez de tener aquí un arranque que adivine dónde está.
   ========================================================================== */

var QUIETO = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------------------------------------------------------------------------
   LAS PALETAS
   Una por ocasión, con los colores medidos de trabajos suyos. `acc` es el
   acento que se le presta a toda la interfaz; `globi` son los colores del
   campo de globos del fondo, y `cromo` los que se pintan con reflejo metálico.
   --------------------------------------------------------------------------- */
/* `chiaro` es el mismo acento aclarado, para usarlo SOBRE FONDO OSCURO. No es
   un capricho: el acento de marca (#d92d6f) sobre el fondo noche se queda en
   3,4:1 y no llega al mínimo legible. Va escrito a mano y no calculado, porque
   aclarar por fórmula desatura los azules y ensucia los verdes. */
var PALETTE = [
  { acc:'#1b34b0', scuro:'#12246f', tenue:'#e2e6f6', chiaro:'#93a8f2', globi:['#1b34b0','#2f4ad0','#e8eaf0','#8f96b8'], cromo:['#c2c7d1','#9aa3b4'] },
  { acc:'#b5715c', scuro:'#8a5343', tenue:'#f6e7e1', chiaro:'#eab6a2', globi:['#e3b6a3','#f2ded3','#c98f79','#8d5a4a'], cromo:['#c2c7d1','#a8aebd'] },
  { acc:'#a98d6d', scuro:'#836b50', tenue:'#f4ece1', chiaro:'#e2cbaa', globi:['#f2ebe2','#d9c4ad','#a98d6d','#e8dccb'], cromo:['#c9a24b','#dcc07a'] },
  { acc:'#5f8a6e', scuro:'#456552', tenue:'#e6eee9', chiaro:'#a9cfb7', globi:['#ffffff','#f2ebe2','#7fa88b','#d9c4ad'], cromo:['#e8e2d4','#cfc7b6'] },
  { acc:'#e8407f', scuro:'#b32a5e', tenue:'#fde4ee', chiaro:'#ff9ec4', globi:['#e8407f','#ff9ec4','#3fbdcb','#9fd8c0'], cromo:['#9fd8c0','#c2c7d1'] },
  { acc:'#b0246a','scuro':'#84184e', tenue:'#f9e0ec', chiaro:'#f28cb7', globi:['#241c26','#b0246a','#c9a24b','#f2ebe2'], cromo:['#c9a24b','#dcc07a'] }
];

/* Interpolación de color en sRGB. Suficiente aquí: los saltos son entre tonos
   vecinos en luminosidad, que es justo donde sRGB no se ensucia. */
function hexRgb(h){ return [parseInt(h.slice(1,3),16), parseInt(h.slice(3,5),16), parseInt(h.slice(5,7),16)]; }
function mezcla(a,b,t){
  var A=hexRgb(a), B=hexRgb(b);
  return 'rgb('+Math.round(A[0]+(B[0]-A[0])*t)+','+Math.round(A[1]+(B[1]-A[1])*t)+','+Math.round(A[2]+(B[2]-A[2])*t)+')';
}

/* La paleta de la MARCA. Es la que manda en todo lo que no es la sección de
   ocasiones: el hero, los allestimenti, el formulario. Sin ella la página
   arrancaba con el acento azul de la primera ocasión, y un botón azul encima
   de un vídeo de globos cipria no es una decisión, es un descuido. */
var MARCA = { acc:'#d92d6f', scuro:'#a81f54', tenue:'#f7e2ea', chiaro:'#ff9ec4', globi:['#e3b6a3','#f2ded3','#d92d6f','#ff9ec4'], cromo:['#c2c7d1','#dcc07a'] };

var pintaActual = -1;  // índice fraccionario; -1 = paleta de marca
function paletaEn(pos){
  if(pos < 0) return MARCA;
  var i = Math.max(0, Math.min(PALETTE.length-1, Math.floor(pos)));
  var j = Math.min(PALETTE.length-1, i+1);
  var t = pos - i;
  return {
    acc:   mezcla(PALETTE[i].acc,   PALETTE[j].acc,   t),
    scuro: mezcla(PALETTE[i].scuro, PALETTE[j].scuro, t),
    tenue: mezcla(PALETTE[i].tenue, PALETTE[j].tenue, t),
    chiaro:mezcla(PALETTE[i].chiaro,PALETTE[j].chiaro,t)
  };
}
function aplicaPaleta(pos){
  pintaActual = pos;
  var c = paletaEn(pos);
  var r = document.documentElement.style;
  r.setProperty('--acc', c.acc);
  r.setProperty('--acc-scuro', c.scuro);
  r.setProperty('--acc-tenue', c.tenue);
  r.setProperty('--acc-chiaro', c.chiaro);
}

/* ---------------------------------------------------------------------------
   EL AMBIENTE DE COLOR
   Tres manchas enormes y muy difusas que se mueven despacio por detrás de todo,
   teñidas con la paleta que esté activa. Cuando la sección de ocasiones cambia
   de color, el aire de la página cambia con ella.

   AQUÍ HUBO UN ERROR DE CRITERIO QUE CONVIENE NO REPETIR. Antes esto pintaba
   cuarenta GLOBOS: círculos con brillo y borde definido, subiendo por delante
   del fondo. Se veían perfectamente por encima de los titulares y del cuerpo de
   texto, y bajarles la opacidad no arregló nada — un objeto reconocible cruzando
   una línea de texto sigue leyéndose como un objeto por muy pálido que esté, y
   hacía que la página entera pareciera un salvapantallas.

   La diferencia no es de cantidad, es de clase: una mancha sin borde no compite
   con el texto porque no tiene forma que mirar. El ambiente se nota; los globos
   se miraban.

   En canvas y no en CSS porque el color sale de la paleta viva, que cambia con
   el scroll, y son degradados grandes que hay que recomponer en cada cuadro.
   --------------------------------------------------------------------------- */
function ambiente(){
  var c = document.getElementById('campo');
  if(!c || QUIETO) return;
  var ctx = c.getContext('2d');
  // 1 y no 2: son degradados desenfocados, no hay detalle que resolver, y a
  // doble resolución se pintan cuatro veces más píxeles para nada.
  var dpr = 1;
  var W=0, H=0;

  var MANCHAS = [
    { bx:.16, by:.20, r:.60, idx:0, fase:0.0, vel:.000090, ax:.09, ay:.06 },
    { bx:.84, by:.38, r:.52, idx:2, fase:2.1, vel:.000115, ax:.07, ay:.09 },
    { bx:.52, by:.88, r:.66, idx:3, fase:4.2, vel:.000075, ax:.11, ay:.05 }
  ];

  function medir(){
    W = c.clientWidth; H = c.clientHeight;
    c.width = Math.round(W*dpr); c.height = Math.round(H*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }

  function rgba(hex, a){
    var v = hexRgb(hex);
    return 'rgba('+v[0]+','+v[1]+','+v[2]+','+a+')';
  }

  function color(i){
    var p = pintaActual < 0 ? MARCA
          : PALETTE[Math.max(0, Math.min(PALETTE.length-1, Math.round(pintaActual)))];
    return p.globi[i % p.globi.length];
  }

  function pinta(t){
    ctx.clearRect(0,0,W,H);
    var diag = Math.sqrt(W*W + H*H) * 0.5;
    for(var k=0;k<MANCHAS.length;k++){
      var m = MANCHAS[k];
      var x = (m.bx + Math.sin(t*m.vel + m.fase) * m.ax) * W;
      var y = (m.by + Math.cos(t*m.vel*0.78 + m.fase) * m.ay) * H;
      var r = m.r * diag;
      var col = color(m.idx);
      var g = ctx.createRadialGradient(x,y,0,x,y,r);
      /* Tres paradas y la última en alpha 0: con dos, el degradado corta de
         golpe en el radio y se ve el círculo — que es justo lo que se quería
         quitar. La caída tiene que morir suave. */
      g.addColorStop(0,   rgba(col,.26));
      g.addColorStop(.45, rgba(col,.11));
      g.addColorStop(1,   rgba(col,0));
      ctx.fillStyle = g;
      ctx.fillRect(0,0,W,H);
    }
  }

  function paso(t){ pinta(t); requestAnimationFrame(paso); }

  medir();
  window.addEventListener('resize', medir);
  requestAnimationFrame(paso);
}

/* ---------------------------------------------------------------------------
   Barra, menú, entradas y formulario
   --------------------------------------------------------------------------- */
function barra(){
  var b = document.getElementById('barra');
  var hero = document.getElementById('hero');
  if(!b) return;
  var tic = false;
  function upd(){
    var y = window.scrollY;
    /* Los dos estados son EXCLUYENTES. Al principio estaban sueltos —«giu» a
       partir de 10px y «sopra» durante todo el hero— y a mitad del vídeo se
       daban a la vez: fondo crema con la letra blanca encima, o sea el logo
       invisible. Se decide una sola cosa: ¿seguimos sobre el vídeo o no? */
    var lim = hero ? hero.offsetHeight - window.innerHeight*0.75 : 0;
    var sobre = y < lim;
    b.classList.toggle('sopra', sobre);
    b.classList.toggle('giu', !sobre && y > 10);
    tic = false;
  }
  document.addEventListener('scroll', function(){ if(!tic){ requestAnimationFrame(upd); tic=true; } }, {passive:true});
  window.addEventListener('resize', upd);
  upd();
}

function menuMobile(){
  var bt = document.getElementById('apri-menu'), m = document.getElementById('menu');
  if(!bt||!m) return;
  function cierra(){ m.classList.remove('aperto'); bt.setAttribute('aria-expanded','false'); }
  bt.addEventListener('click', function(){
    var ab = m.classList.toggle('aperto');
    bt.setAttribute('aria-expanded', ab?'true':'false');
  });
  m.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', cierra); });
  document.addEventListener('keydown', function(e){ if(e.key==='Escape') cierra(); });
}

function rivelare(){
  // Dos formas de entrar, un solo observador. El texto se funde y sube; las
  // fotografías y los bloques se DESTAPAN con un clip. Una foto que aparece de
  // la nada parece un fallo de carga; una que se descubre parece una decisión.
  var items = document.querySelectorAll('.rivela, .svela, .chiusura');
  if(!items.length) return;
  if(!('IntersectionObserver' in window)){
    items.forEach(function(el){ el.classList.add('dentro'); });
    return;
  }
  var io = new IntersectionObserver(function(ent){
    ent.forEach(function(e){
      if(!e.isIntersecting) return;
      // Escalonado por posición dentro de su grupo, no por índice global: una
      // rejilla entra en cascada y un párrafo suelto entra al momento.
      var hermanos = Array.prototype.filter.call(e.target.parentElement.children, function(n){
        return n.classList.contains('rivela') || n.classList.contains('svela');
      });
      var i = Math.max(0, hermanos.indexOf(e.target));
      e.target.style.transitionDelay = Math.min(i*90,420)+'ms';
      e.target.classList.add('dentro');
      io.unobserve(e.target);
      // Terminado el telón, la foto pasa a transición corta para el hover.
      // Con temporizador y no con transitionend: la transición del clip va en
      // el marco y la del zoom en la imagen, y si el marco entra fuera de
      // pantalla el navegador puede no emitir el evento.
      if(e.target.classList.contains('svela')){
        setTimeout(function(el){ return function(){ el.classList.add('asentado'); }; }(e.target), 1600 + Math.min(i*90,420));
      }
    });
  /* Umbral CERO, no una fracción, y esto no es un detalle: los elementos que
     entran con telón llevan `clip-path` a cero altura, y un elemento recortado
     declara siempre intersectionRatio 0 por mucho que esté centrado en la
     pantalla. Con umbral .12 no se revelaban NUNCA: la galería y el bloque del
     presupuesto se quedaban invisibles. (Comprobado en el navegador: recortado
     da isIntersecting true con ratio 0; sin recortar, ratio 1.)

     De paso arregla el otro caso clásico, el elemento más alto que la ventana,
     que tampoco puede alcanzar una fracción alta. El retraso de entrada lo pone
     el margen de abajo, que es donde debe estar. */
  }, {rootMargin:'0px 0px -10% 0px', threshold:0});
  items.forEach(function(el){ io.observe(el); });
}

/* ---------------------------------------------------------------------------
   PARALAJE
   La foto se mueve DENTRO de su marco, más despacio que la página. Es lo que
   le da profundidad a una rejilla de fotos plana.

   El recorrido es corto —±22px— a propósito: un paralaje grande se nota como
   un efecto y marea; uno corto solo se nota si lo quitas.

   Todo en un único bucle sobre una lista medida una vez. Un ResizeObserver por
   imagen, o leer offsetTop en cada fotograma, obliga al navegador a recalcular
   la maquetación sesenta veces por segundo.
   --------------------------------------------------------------------------- */
function parallasse(){
  if(QUIETO) return;
  var marcos = Array.prototype.slice.call(document.querySelectorAll('[data-par]'));
  if(!marcos.length) return;
  var tic = false;

  // La escala en reposo se lee del CSS una sola vez: por fotograma sería una
  // consulta de estilo calculado, que obliga al navegador a rehacer la
  // maquetación. Si el valor no está, 1.12 es el que hay en la hoja.
  var ZOOM = parseFloat(getComputedStyle(marcos[0]).getPropertyValue('--zoom-reposo')) || 1.12;

  function paso(){
    var vh = window.innerHeight;
    for(var i=0;i<marcos.length;i++){
      var m = marcos[i], img = m.querySelector('img');
      if(!img) continue;
      var r = m.getBoundingClientRect();
      if(r.bottom < -100 || r.top > vh + 100) continue;   // fuera: no se toca
      // -1 arriba del todo, +1 abajo del todo.
      var d = ((r.top + r.height/2) - vh/2) / (vh/2 + r.height/2);

      /* El recorrido se limita a la holgura REAL de este marco: la mitad de lo
         que la foto ampliada sobresale por arriba y por abajo. Sin este tope,
         la panorámica en móvil —marco de 197px— se desplazaría 22px teniendo 12
         de holgura, y asomaría el fondo por el borde del marco.

         La holgura se calcula con offsetHeight y la escala EN REPOSO, no con el
         rectángulo medido: getBoundingClientRect incluye la transformación, y
         durante el segundo y medio que dura el telón la foto todavía está en
         1.26. Medir ahí da una holgura que no existirá cuando la transición
         acabe, y el tope se queda flojo justo mientras se mira la foto. */
      var holgura = Math.max(0, (img.offsetHeight * ZOOM - r.height) / 2);
      var y = Math.max(-holgura, Math.min(holgura, d * 22));

      /* Se escribe en `translate`, NO en `transform`. Son propiedades distintas
         y se componen: de `transform` tira el telón de entrada (scale 1.26 →
         1.12, con transición). Si el paralaje escribiera en `transform` lo
         pisaría en el primer fotograma y el telón no se vería nunca. */
      img.style.translate = '0 ' + y.toFixed(2) + 'px';
    }
    tic = false;
  }
  document.addEventListener('scroll', function(){ if(!tic){ requestAnimationFrame(paso); tic=true; } }, {passive:true});
  window.addEventListener('resize', paso);
  paso();
}

/* El alto de la banda de prototipo se MIDE, no se supone. Depende de cuántas
   líneas ocupe el texto, y eso cambia con el ancho de la pantalla, con el
   tamaño de letra que tenga puesto el usuario y con el idioma. Los valores
   escritos a mano en el CSS son solo el punto de partida: al añadir el botón,
   la banda pasó a medir 120px en móvil donde yo había declarado 92, y el globo
   de WhatsApp, la franja de datos y la foto de ocasiones se metieron todos
   debajo de ella a la vez.

   Un ResizeObserver sobre la propia banda lo resuelve para cualquier caso. */
function medirBanda(){
  var el = document.querySelector('.avviso');
  if(!el) return;
  function poner(){
    document.documentElement.style.setProperty('--banda', Math.ceil(el.getBoundingClientRect().height) + 'px');
  }
  poner();
  if('ResizeObserver' in window) new ResizeObserver(poner).observe(el);
  else window.addEventListener('resize', poner);
}

/* El botón de WhatsApp entra solo, un poco después de la carga: si aparece a la
   vez que el hero, compite con él en el primer segundo, que es justo cuando el
   hero tiene que trabajar. */
function whatsapp(){
  var w = document.getElementById('wa');
  if(!w) return;
  setTimeout(function(){ w.classList.add('dentro'); }, 1100);
}

/* VARIABLE: endpoint de envío. Vacío a propósito en el prototipo — las
   solicitudes tienen que llegar al correo de la clienta, no al nuestro. */
var FORM_ENDPOINT = '';

function modulo(){
  var f = document.getElementById('modulo');
  if(!f) return;
  var st = document.getElementById('stato');
  f.addEventListener('submit', function(e){
    e.preventDefault();
    // Validación propia y no la nativa: el mensaje del navegador sale en el
    // idioma del sistema y señala un campo cada vez.
    var faltan = Array.prototype.filter.call(f.querySelectorAll('[required]'), function(c){ return !c.value.trim(); });
    if(faltan.length){
      st.textContent = 'Compila i campi obbligatori: ' + faltan.map(function(c){
        return f.querySelector('label[for="'+c.id+'"]').textContent.replace(' *','').trim();
      }).join(', ') + '.';
      st.className = 'stato err';
      faltan[0].focus();
      return;
    }
    if(!FORM_ENDPOINT){
      st.textContent = 'Prototipo: il modulo non è ancora collegato a un servizio di invio.';
      st.className = 'stato err';
      return;
    }
    st.textContent = 'Invio in corso…'; st.className = 'stato';
    fetch(FORM_ENDPOINT, {method:'POST', body:new FormData(f), headers:{Accept:'application/json'}})
      .then(function(r){
        if(r.ok){ st.textContent='Grazie! Ti rispondiamo entro poche ore.'; st.className='stato ok'; f.reset(); }
        else{ st.textContent='Invio non riuscito. Riprova o scrivici su WhatsApp.'; st.className='stato err'; }
      })
      .catch(function(){ st.textContent='Invio non riuscito. Riprova o scrivici su WhatsApp.'; st.className='stato err'; });
  });
}
