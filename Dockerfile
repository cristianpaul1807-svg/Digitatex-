# El sitio es HTML autocontenido: no hay nada que compilar, solo servirlo.
# Nginx en lugar de un servidor de Node porque los videos se recorren por
# scroll y eso exige peticiones Range, que nginx resuelve de fabrica.
FROM nginx:1.27-alpine

RUN rm -f /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/digitatex.conf

COPY index.html 404.html robots.txt sitemap.xml /usr/share/nginx/html/
COPY assets/ /usr/share/nginx/html/assets/
# El hub de enlaces de Instagram. Va en su propia carpeta para que la direccion
# sea /links: nginx sirve el index.html de dentro. Si esta linea falta, la
# pagina existe en el repositorio y da 404 en produccion.
COPY links/ /usr/share/nginx/html/links/
# Prototipos que se ensenan a clientes antes de contratar. Van sin indexar y
# fuera del sitemap: son webs de otras empresas, no contenido de Digitatex.
COPY prototipi/ /usr/share/nginx/html/prototipi/

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1
