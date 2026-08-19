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
    // GSAP and Framer Motion are both large. Splitting them keeps the entry
    // chunk small enough that the loader paints before the animation code lands.
    rollupOptions: {
      output: {
        manualChunks: { gsap: ['gsap', '@gsap/react'], framer: ['framer-motion'], hls: ['hls.js'] },
      },
    },
  },
});
