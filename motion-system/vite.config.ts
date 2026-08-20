import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [react()],
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
