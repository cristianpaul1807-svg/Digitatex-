/* ============================================================================
   AUTOLAVAGGIO CALZETTI · comportamiento compartido
   Sin librerías. Lo que hay aquí está escrito a mano porque cada trozo arrastra
   un fallo que ya mordió en otro sitio, y el comentario de al lado existe para
   que no vuelva a morder.
   ========================================================================== */

var QUIETO = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------------------------------------------------------------------------
   LA BANDA DE PROTOTIPO, MEDIDA Y NO SUPUESTA
   Va fija abajo y todo lo que se pega al fondo —el botón de WhatsApp, el riel
   del recorrido, el pie— tiene que apartarse de ella. Su altura cambia con el
   ancho, con el idioma y con el tamaño de letra del sistema: declararla a ojo
   en el CSS significa que un día tres cosas distintas se meten debajo a la vez.
   --------------------------------------------------------------------------- */
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

/* ---------------------------------------------------------------------------
   LA BARRA
   Dos estados EXCLUYENTES. Sueltos se daban a la vez a mitad de la portada:
   fondo claro con la letra blanca encima, o sea el nombre invisible. Se decide
   una sola cosa: ¿seguimos sobre el vídeo o no?
   --------------------------------------------------------------------------- */
function barra(){
  var b = document.getElementById('barra');
  var hero = document.getElementById('hero');
  if(!b) return;
  var tic = false;
  function upd(){
    var lim = hero ? hero.offsetHeight - window.innerHeight * 0.75 : 0;
    var sobre = window.scrollY < lim;
    b.classList.toggle('sopra', sobre);
    b.classList.toggle('giu', !sobre && window.scrollY > 10);
    tic = false;
  }
  document.addEventListener('scroll', function(){ if(!tic){ requestAnimationFrame(upd); tic = true; } }, {passive:true});
  window.addEventListener('resize', upd);
  upd();
}

function menuMobile(){
  var abrir = document.getElementById('apri-menu');
  var cerrar = document.getElementById('chiudi-menu');
  var menu = document.getElementById('menu-mobile');
  if(!abrir || !menu) return;
  function estado(v){
    menu.classList.toggle('aperto', v);
    abrir.setAttribute('aria-expanded', v ? 'true' : 'false');
    document.body.style.overflow = v ? 'hidden' : '';
  }
  abrir.addEventListener('click', function(){ estado(true); });
  if(cerrar) cerrar.addEventListener('click', function(){ estado(false); });
  menu.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', function(){ estado(false); }); });
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape') estado(false); });
}

/* ---------------------------------------------------------------------------
   LAS ENTRADAS
   `threshold: 0` NO es descuido. Un elemento recortado del todo con clip-path
   mide cero de alto visible, así que su proporción de intersección es SIEMPRE
   cero y un umbral mayor no salta nunca: las secciones se quedaban invisibles
   para siempre. Comprobado en navegador: {normal: 1, recortado: 0}.
   --------------------------------------------------------------------------- */
function rivelare(){
  var items = document.querySelectorAll('.rivela, .svela');
  if(!items.length) return;
  if(QUIETO || !('IntersectionObserver' in window)){
    items.forEach(function(el){ el.classList.add('dentro'); });
    return;
  }
  var ob = new IntersectionObserver(function(filas){
    filas.forEach(function(f){
      if(!f.isIntersecting) return;
      var el = f.target;
      // Las tarjetas de una misma fila entran escalonadas: todas a la vez se
      // lee como un parpadeo, no como una entrada.
      var hermanos = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
      el.style.transitionDelay = Math.min(hermanos, 5) * 70 + 'ms';
      el.classList.add('dentro');
      ob.unobserve(el);
    });
  }, {rootMargin:'0px 0px -10% 0px', threshold:0});
  items.forEach(function(el){ ob.observe(el); });
}

/* El botón de WhatsApp entra un poco después de cargar: si aparece a la vez que
   la portada, compite con ella justo en el segundo en que la portada trabaja. */
function whatsapp(){
  var w = document.getElementById('wa');
  if(!w) return;
  setTimeout(function(){ w.classList.add('dentro'); }, 1100);
}

/* ---------------------------------------------------------------------------
   EL RECORRIDO DEL VÍDEO
   El vídeo no se reproduce: su `currentTime` va atado a la posición del scroll.

   TRES COSAS DE AQUÍ NO SON ADORNO:

   1. EN iOS NO SE PAUSA, NUNCA. Safari dibuja su botón de play encima de
      cualquier vídeo pausado, da igual cómo llegara a estarlo, y ese botón
      aparece en medio del coche. La única forma de tenerlo quieto es seguir
      «reproduciendo» a velocidad cero.

   2. LA VELOCIDAD SE PONE A CERO ANTES DE play(), no solo después en la
      promesa: durante el rato que esta tarda en resolverse el vídeo corre
      normal, y con siete segundos de plano eso basta para plantarse al final.
      Y si ha llegado al final hay que RETROCEDERLO antes de cebarlo otra vez:
      llamar a play() sobre un vídeo terminado lo rebobina al primer fotograma,
      así que se veía el coche enjabonado y acto seguido limpio otra vez.

   3. EL TIEMPO SE PERSIGUE, NO SE CLAVA. Escribir `currentTime` con el valor
      exacto en cada muesca de la rueda da un salto duro por muesca. Aquí se
      recorre una fracción del camino en cada cuadro, que es lo que hace que se
      vea como movimiento y no como una tira de fotos.

   Y el bucle solo corre mientras la sección se ve: es un vídeo descodificándose
   cuadro a cuadro y no tiene por qué seguir haciéndolo mientras alguien lee el
   pie de página.
   --------------------------------------------------------------------------- */
function recorrerVideo(op){
  var sec = op.seccion, v = op.video, riel = op.riel;
  if(!sec || !v) return;

  if(QUIETO){
    v.removeAttribute('autoplay');
    var alFinal = function(){
      if(v.duration && isFinite(v.duration)){ try{ v.currentTime = v.duration - .08; }catch(e){} }
    };
    if(v.readyState >= 1) alFinal(); else v.addEventListener('loadedmetadata', alFinal);
    return;
  }

  sec.style.height = (op.pantallas || 400) + 'svh';

  function quieto(){ if(v.playbackRate !== 0){ try{ v.playbackRate = 0; }catch(e){} } }
  function cebar(){
    if(v.ended){ try{ v.currentTime = Math.max(0, (v.duration || 0) - .1); }catch(e){} }
    quieto();
    var p = v.play();
    if(p && p.then) p.then(quieto, function(){});
  }
  v.addEventListener('ratechange', quieto);
  v.addEventListener('playing', quieto);
  v.addEventListener('pause', cebar);
  v.addEventListener('loadedmetadata', cebar);
  cebar();

  var destino = 0, ahora = 0, corriendo = false, visible = false, tic = false;

  function pinta(){
    if(!corriendo) return;
    ahora += (destino - ahora) * .18;
    quieto();
    var d = v.duration;
    if(d && isFinite(d)){
      // Nunca el último fotograma exacto: al tocarlo salta `ended`, y de ahí
      // sale el rebobinado que se explica arriba.
      var t = Math.max(0, Math.min(d - .06, ahora * d));
      if(Math.abs(v.currentTime - t) > .012 && v.readyState >= 1 && !v.seeking){
        try{ v.currentTime = t; }catch(e){}
      }
    }
    if(Math.abs(destino - ahora) < .0005 && !visible){ corriendo = false; return; }
    requestAnimationFrame(pinta);
  }

  function alScroll(){
    var total = sec.offsetHeight - window.innerHeight;
    if(total <= 0) return;
    var r = sec.getBoundingClientRect();
    visible = r.bottom > 0 && r.top < window.innerHeight;
    destino = Math.max(0, Math.min(1, -r.top / total));
    if(riel) riel.style.width = (destino * 100).toFixed(2) + '%';
    if(visible && !corriendo){ corriendo = true; requestAnimationFrame(pinta); }
    tic = false;
  }

  document.addEventListener('scroll', function(){ if(!tic){ requestAnimationFrame(alScroll); tic = true; } }, {passive:true});
  window.addEventListener('resize', alScroll);
  alScroll();
}
