import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import { createReadStream, statSync } from 'node:fs';

/**
 * En producción, /motion/ y /prototipi/ cuelgan de la misma raíz de nginx, así
 * que la página de Fidenza puede tirar del vídeo que ya está publicado en
 * /prototipi/fidenza/ sin duplicarlo. En local, en cambio, Vite solo sirve lo
 * que hay dentro de esta carpeta, y esa ruta daría 404.
 *
 * Este plugin sirve /prototipi/ desde el repositorio durante `dev` y `preview`,
 * para que lo que se revisa en local sea lo mismo que se publica. Solo lectura,
 * solo esa carpeta, y con soporte de Range: sin 206 no hay scroll-scrub que
 * valga, porque el navegador no puede saltar por el vídeo.
 */
function servirPrototipos(): Plugin {
  const raiz = fileURLToPath(new URL('../prototipi', import.meta.url));
  const middleware = (req: any, res: any, next: () => void) => {
    const url = (req.url ?? '').split('?')[0];
    if (!url.startsWith('/prototipi/')) return next();
    // Nada de subir de directorio: la ruta se normaliza y se comprueba que
    // sigue cayendo dentro de la carpeta.
    const rel = decodeURIComponent(url.slice('/prototipi/'.length));
    const destino = fileURLToPath(new URL(`../prototipi/${rel}`, import.meta.url));
    if (!destino.startsWith(raiz)) { res.statusCode = 403; return res.end(); }

    let tam: number;
    try { tam = statSync(destino).size; } catch { return next(); }

    res.setHeader('Accept-Ranges', 'bytes');
    if (destino.endsWith('.mp4')) res.setHeader('Content-Type', 'video/mp4');

    const rango = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range ?? '');
    if (rango) {
      const inicio = rango[1] ? +rango[1] : 0;
      const fin = rango[2] ? +rango[2] : tam - 1;
      res.statusCode = 206;
      res.setHeader('Content-Range', `bytes ${inicio}-${fin}/${tam}`);
      res.setHeader('Content-Length', fin - inicio + 1);
      return createReadStream(destino, { start: inicio, end: fin }).pipe(res);
    }
    res.setHeader('Content-Length', tam);
    return createReadStream(destino).pipe(res);
  };
  return {
    name: 'servir-prototipos',
    configureServer: (s) => { s.middlewares.use(middleware); },
    configurePreviewServer: (s) => { s.middlewares.use(middleware); },
  };
}

export default defineConfig({
  plugins: [react(), servirPrototipos()],
  // The showcase is served from a sub-path in production (digitatex.com/motion/),
  // so asset URLs have to be relative rather than root-absolute.
  base: './',
  define: { __SINGLE_FILE__: 'false' },
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  build: {
    target: 'es2020',
    // Dos paginas: el catalogo y la demo del objeto en viaje. La segunda no
    // usa React ni Framer — solo GSAP y un canvas — asi que separarlas hace que
    // no cargue 115 KB que no toca.
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        viaje: fileURLToPath(new URL('./viaje.html', import.meta.url)),
      },
      output: {
        manualChunks: { gsap: ['gsap', '@gsap/react'], framer: ['framer-motion'], hls: ['hls.js'] },
      },
    },
  },
});
