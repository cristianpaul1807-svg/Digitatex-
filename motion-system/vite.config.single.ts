import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

/**
 * Build for the self-contained single HTML file.
 *
 * Two differences from the normal build:
 *  - `inlineDynamicImports` collapses everything into one bundle, because a
 *    single file cannot fetch a second chunk.
 *  - hls.js is aliased to a stub, so the 523KB streaming library is not carried
 *    into a document that has no network to stream from.
 */
export default defineConfig({
  plugins: [react()],
  base: './',
  define: { __SINGLE_FILE__: 'true' },
  resolve: {
    alias: {
      'hls.js': fileURLToPath(new URL('./src/single-file/hls-stub.ts', import.meta.url)),
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    target: 'es2020',
    outDir: 'dist-single',
    cssCodeSplit: false,
    rollupOptions: { output: { inlineDynamicImports: true } },
  },
});
