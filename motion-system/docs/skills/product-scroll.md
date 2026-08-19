# Producto por scroll

`product-scroll` · Experiencia de producto · avanzado

Escenario de producto anclado, con capítulos y anotaciones sincronizados, sobre vídeo, secuencia de imágenes o dibujo por canvas.

## Source reference

> Sticky-pinned scroll variant on desktop · scroll-controlled

## Implementation

- **Export:** `ProductScroll`
- **Technology:** GSAP · ScrollTrigger · Canvas · hls.js · React
- **Performance cost:** alto

## Usage

```tsx
<ProductScroll source={{ type: "canvas", render }} chapters={...} hotspots={...} />
```

## Behaviour by context

| Context | Behaviour |
| --- | --- |
| Desktop | Tres fuentes intercambiables tras una misma interfaz; capítulos, anotaciones y barra de avance leen el mismo valor. |
| Tablet | Anclado, con menos recorrido. |
| Mobile | **simplificado** — Pasa a una maqueta apilada. Un producto a 375 px de ancho con un texto encima no hay quien lo lea. |
| Reduced motion | **simplificado** — Maqueta apilada; solo el primer fotograma. |

## When to use it

- Contar un producto
- Webs de industria y maquinaria
- Escaparates de render 3D
