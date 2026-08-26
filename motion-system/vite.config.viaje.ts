import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';

/**
 * Compilación de la página de Fidenza para el archivo único.
 *
 * Es un build aparte y no una variante del normal por una razón concreta: el
 * normal reparte GSAP a un trozo compartido con el catálogo, y un HTML suelto
 * no puede ir a buscar un segundo fichero. `inlineDynamicImports` mete todo en
 * un bundle.
 *
 * El primer intento fue pegar los trozos a mano en el empaquetador. No
 * funciona: los nombres minificados de dos módulos distintos chocan en cuanto
 * comparten ámbito —salía "Identifier 'Wi' has already been declared"— y
 * quitar el `import` deja las referencias sin enlazar. Esto lo tiene que
 * resolver el empaquetador de módulos, que es el que sabe renombrar.
 *
 * Sin React: esta página no lo usa.
 */
export default defineConfig({
  base: './',
  define: { __SINGLE_FILE__: 'true' },
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  build: {
    target: 'es2020',
    outDir: 'dist-viaje',
    cssCodeSplit: false,
    rollupOptions: {
      input: fileURLToPath(new URL('./viaje.html', import.meta.url)),
      output: { inlineDynamicImports: true },
    },
  },
});
