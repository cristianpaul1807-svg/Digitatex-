# Digitatex — Traspaso

Todo lo que hace falta para entender y operar el sitio. Escrito para alguien
que llega nuevo y no ha visto una sola línea del proyecto.

**Web:** https://digitatex.com · **Repositorio:** `cristianpaul1807-svg/Digitatex-`, rama `main`

---

## 1. Qué es esto en una frase

Una web de una sola página para un estudio de diseño web y software, en cuatro
idiomas, con un panel privado para que el dueño publique trabajos y testimonios
sin tocar código, y un formulario que calcula un presupuesto y le llega al correo.

---

## 2. Cómo saber qué versión estás viendo

Baja al pie de la web. Hay una etiqueta pequeña: `v24`, `v25`…

**Si no coincide con la última desplegada, estás viendo una copia guardada por tu
navegador, no la web.** Esto ahorra discusiones enteras: antes de investigar
cualquier fallo, mira el sello.

Se sube a mano en cada despliegue, en el pie del `index.html`.

---

## 3. Arquitectura

Tres piezas independientes. **El servidor no habla con la base de datos en ningún
momento.**

```
Navegador del visitante ──> Servidor (Hostinger/Easypanel) ──> entrega index.html y ya
                       └──> Supabase        (base de datos y vídeos, directo)
                       └──> Formspree       (envío del correo, directo)
```

Consecuencia práctica: **no hay variables de entorno que configurar.** No existe
ningún programa nuestro corriendo en el servidor que pudiera leerlas. Nginx
entrega archivos y se desentiende.

### El repositorio

| Archivo | Qué es |
|---|---|
| `index.html` | **Toda la web.** 251 KB: estructura, estilos, lógica y las cuatro traducciones |
| `Dockerfile` | Imagen nginx que sirve los archivos |
| `nginx.conf` | Caché, peticiones Range para los vídeos, 404 reales, redirección de www |
| `404.html` | Página de error con la identidad del sitio |
| `robots.txt` / `sitemap.xml` | SEO |
| `supabase-setup.sql` | El esquema completo de la base, ejecutable de cero |
| `assets/` | 636 KB: logo, fondo de espacio, tarjeta para compartir, vídeo de respaldo |

Un solo archivo para toda la web es deliberado: no hay build, no hay
dependencias que actualizar, y desplegar es copiar un archivo.

### Despliegue

Easypanel en Hostinger, construyendo desde el Dockerfile. **Puerto 80.
Environment vacío.** Se despliega solo empujando a `main` y pulsando redesplegar.

---

## 4. Precios

Están escritos en el objeto `PRICING` dentro de `index.html`. El formulario
calcula un rango en vivo: **base según el tipo de proyecto + los extras que se
marquen, sumados sin techo.**

### Base

| Tipo de proyecto | Precio | Mantenimiento |
|---|---|---|
| Crear web desde cero | 700 – 1.600 € | 40 – 150 €/mes |
| Arreglar o mejorar una web existente | 700 – 900 € | 40 – 60 €/mes |
| Integrar una funcionalidad a una web existente | 700 – 900 € | 40 – 60 €/mes |

### Extras (se suman)

| Extra | Precio | Mantenimiento |
|---|---|---|
| Base de datos / panel de administración | 500 – 800 € | +30 – 50 €/mes |
| Formulario avanzado (multi-paso, archivos) | 150 – 300 € | — |
| Pagos o reservas | 250 – 500 € | — |
| WhatsApp | 250 – 500 € | — |
| Multi-idioma | 150 – 300 € | — |
| Vídeo/3D del producto con scroll | 600 – 2.500 € | — |

### Premium

**3.000 – 6.000 €**, mantenimiento 200 – 400 €/mes.

No es una opción que se elija: cuando la suma de extras supera los 3.000 €, el
formulario muestra un aviso invitando a hablarlo directamente. La idea es que a
partir de cierto tamaño el proyecto se cotiza hablando, no con una calculadora.

**Para cambiar precios:** editar el objeto `PRICING` en `index.html`. Es la única
fuente; la web y el correo salen de ahí.

---

## 5. Servicios que se anuncian

1. **Diseño web cinematográfico** — sitios guiados por scroll
2. **Software de negocio** — reservas, pagos, gestión de clientes
3. **Marca e identidad digital**

Y una sección de **seis estilos de web** que un cliente puede pedir (boutique,
corporativa/SaaS, editorial, inmersiva, bloque de color, cinematográfica).
Son maquetas dibujadas enteramente con CSS, no capturas: cada pieza se anima por
separado cuando entra en pantalla.

---

## 6. El panel de gestión

### Cómo entrar

Tres formas, de más rápida a más lenta:

1. **Mantener pulsado el logotipo** "DIGITATEX" del menú durante un segundo largo.
   El logotipo se atenúa mientras aprietas — es la única pista, y solo la ve quien
   ya está apretando. Un toque normal lleva al inicio como siempre.
2. **`digitatex.com/#admin`** — abre el panel directamente. Sirve para guardar en favoritos.
3. El enlace **"Gestión"** en el pie de la web.

Después, correo y contraseña. **Solo existe una cuenta y no se pueden crear más:
el registro está bloqueado en la base de datos por un disparador.** Si hiciera
falta otra persona, hay que añadirla desde el panel de Supabase e incluirla en la
tabla `site_admins`.

### Qué se puede hacer desde ahí

| Sección | Para qué |
|---|---|
| **Casos de clientes** | Subir hasta 3 trabajos entregados. Nombre, web y vídeo |
| **Sistemas propios y colaboraciones** | Hasta 3 productos del estudio (aquí vive Trimm) |
| **Testimonios** | Publicar reels de Instagram por enlace |
| **Solicitudes recibidas** | La base de clientes: quién pidió presupuesto, con sus fotos |

Todo se puede editar y borrar. El nombre y la web se corrigen sin volver a subir
el vídeo.

### Reglas que conviene conocer

- **Los casos de cliente llevan marco de monitor. Los sistemas propios no.** Ese
  marco significa "web que entregamos a alguien", y Trimm no lo es.
- **La descripción es una plantilla traducida a los cuatro idiomas.** Subir un
  caso es subir un vídeo y escribir un nombre. No hay que redactar nada.
- **Si no hay testimonios publicados, esa sección no existe en la web.** Vuelve
  sola en cuanto se publique el primero. Una sección que promete pruebas y no
  enseña ninguna resta credibilidad.

---

## 7. Los vídeos: lo que hay que saber antes de grabar

Esta es la parte que más problemas dio. Resumen de lo aprendido:

**Grábalos cortos: 15–20 segundos.** El vídeo se recorre con el scroll del
visitante, así que la duración se reparte en la distancia que ocupa la fila. Uno
de dos minutos hace que cada empujón del dedo salte varios segundos y se vea como
un pase de diapositivas al azar.

**Horizontal, 16:9.** Y desde el ordenador mejor que desde el teléfono: el correo
puede recomprimir el archivo por el camino.

**El límite del panel son 25 MB, pero el número que importa es 8.** Supabase
acepta hasta 50 MB por archivo en el plan gratuito; el freno real es el tráfico:
**5 GB al mes**. Cada visitante nuevo que llegue a esa sección se descarga todos
los vídeos que haya.

| Peso por vídeo | Con 4 vídeos | Visitas nuevas al mes |
|---|---|---|
| 5 MB | 20 MB/visita | ~260 |
| 8 MB | 32 MB/visita | ~160 |
| 20 MB | 80 MB/visita | ~65 |

Por eso el panel avisa a partir de 8 MB aunque deje subir. Si algún día la web
tira fuerte, el plan Pro de Supabase (25 $/mes) sube a 250 GB de tráfico.

**Receta para buena calidad con poco peso:**

```bash
ffmpeg -i tuvideo.mp4 -vf "scale=1600:-2" -c:v libx264 -crf 25 \
       -preset slow -g 12 -an -movflags +faststart salida.mp4
```

Las dos claves: `-an` quita el audio (los vídeos van mudos, sobra) y `-g 12` mete
fotogramas clave frecuentes, que es lo que hace que el recorrido por scroll vaya
suave en vez de a tirones.

**El panel se encarga solo de dos cosas al subir:** convierte los `.mov` de
iPhone/Mac a MP4 —el navegador no abre QuickTime— y captura un fotograma de
portada. Esa portada es lo que se ve mientras el vídeo carga, o si no llega a
cargar nunca.

**Un detalle que conviene no "arreglar":** la portada se pinta como una imagen
aparte, colocada debajo del vídeo, y *no* con el atributo `poster` del `<video>`.
Parece un rodeo innecesario y no lo es: el navegador descarta el `poster` en
cuanto el vídeo arranca o salta, y el recorrido por scroll hace justo eso. Con
el atributo, el marco se quedaba negro en el móvil. Con la imagen separada, el
vídeo puede reproducirse y saltar mientras debajo sigue estando la web real del
cliente. Si alguien lo simplifica a `poster="..."`, vuelven los marcos negros.

---

## 8. Base de datos (Supabase)

Proyecto `dnwnciubalqyptlmycer`, región eu-west-1, **plan gratuito**.

| Tabla | Contenido |
|---|---|
| `leads` | Solicitudes de presupuesto, con enlaces a las fotos del cliente |
| `cases` | Casos de clientes que salen en la web |
| `systems` | Productos propios y colaboraciones |
| `testimonials` | Reels de Instagram publicados |
| `site_admins` | Lista blanca de quién puede administrar |

Un bucket de almacenamiento, `site-media`, para los vídeos y portadas, y
`product-photos` para lo que suben los clientes en el formulario.

### Seguridad

**La clave pública (`anon`) está en el código y eso es correcto.** Está diseñada
para ser pública; lo que protege la base son las reglas RLS, no esconder la clave.
Con esa clave, desde fuera, solo se puede:

- Insertar una solicitud de presupuesto
- Subir una foto al formulario
- Leer los testimonios, casos y sistemas **publicados**

No se puede leer la lista de clientes, ni crear, ni editar, ni borrar nada. Todo
eso exige sesión iniciada **y** estar en `site_admins`. Comprobado con peticiones
reales: un anónimo recibe 401 al intentar crear, y sus intentos de editar afectan
cero filas.

`supabase-setup.sql` reconstruye el esquema entero desde cero si hiciera falta.

---

## 9. Correo

Formspree, endpoint `xyegywvk`. Cada solicitud llega con todos los campos y
**los enlaces públicos a las fotos que subió el cliente**.

Si el cliente adjuntó fotos y no se pudieron subir, el correo lo dice
explícitamente para poder pedírselas.

---

## 10. SEO

- Cuatro idiomas con hreflang cruzado, **cada dirección declarándose canónica de
  sí misma** (sin esto Google trata las cuatro como una sola página y descarta el
  grupo entero)
- Título y descripción traducidos: son las dos cosas que Google enseña
- Datos estructurados de organización y servicio, con el Instagram asociado
- `robots.txt` y `sitemap.xml` reales
- Direcciones inexistentes devuelven **404 de verdad**, no la portada con código
  de éxito
- Tarjeta 1200×630 para cuando se comparte el enlace

**Pendiente:** verificar el dominio en Google Search Console y enviar el sitemap.
El método recomendado es un registro TXT en las DNS de Hostinger, que verifica
`digitatex.com`, `www`, `http` y `https` de una vez. **Verificar primero, enviar
el sitemap después.**

---

## 11. Detalles del sitio que parecen caprichos y no lo son

- **El fondo de espacio es una foto**, no un degradado, y se mueve más despacio
  que todo lo demás. Un degradado se nota; una foto no.
- **La D del inicio se construye en 3D con código**, no es un vídeo. Gira
  exactamente lo que gira la rueda del ratón y se para cuando el visitante para.
  En pantallas cortas pasa a ser fondo atenuado en vez de encajarse a la fuerza.
- **Los textos empiezan legibles.** El efecto de "encenderse" con el scroll parte
  de un gris que ya se lee. Todo el texto de la web pasa el mínimo de contraste
  de accesibilidad; lo más bajo está en 5,37 sobre el 4,5 exigido.
- **Todo lo que se anima respeta "reducir movimiento".** Con esa opción activada
  del sistema, todo aparece montado y quieto.

---

## 12. Lo que yo revisaría primero al llegar

1. **Cambiar la contraseña del panel.** Se escribió en un chat varias veces
   durante el desarrollo. Se cambia en Supabase → Authentication → Users.
2. **Terminar Search Console.** Sin eso Google tarda semanas en encontrar la web.
3. **Subir testimonios reales.** El sistema está montado y la sección aparece
   sola con el primero.
4. **Decidir sobre la sección de estilos.** Ocupa tres pantallas en el móvil, es
   la parte más larga de la web con diferencia. Puede convertirse en dos columnas
   y bajar a la mitad.
5. **Vigilar el tráfico de Supabase** si empieza a entrar gente. 5 GB al mes es el
   techo del plan gratuito.

---

## 13. Cómo desplegar

```bash
git add -A
git commit -m "qué has cambiado"
git push origin main
```

Y en Easypanel, redesplegar. **Subir el sello de versión del pie antes de
empujar**, o nadie sabrá qué está mirando.
