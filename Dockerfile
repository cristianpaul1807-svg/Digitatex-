# El sitio es HTML autocontenido: no hay nada que compilar, solo servirlo.
# Nginx en lugar de un servidor de Node porque los videos se recorren por
# scroll y eso exige peticiones Range, que nginx resuelve de fabrica.
FROM nginx:1.27-alpine

RUN rm -f /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/digitatex.conf

COPY index.html 404.html robots.txt sitemap.xml /usr/share/nginx/html/
COPY assets/ /usr/share/nginx/html/assets/

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1
