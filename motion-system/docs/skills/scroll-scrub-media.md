# Vídeo recorrido por scroll

`scroll-scrub-media` · Movimiento por scroll · avanzado

Vídeo o secuencia de imágenes cuyo fotograma lo elige la posición del scroll.

## Source reference

> Sticky-pinned scroll variant on desktop

## Implementation

- **Export:** `useScrollScrubVideo`
- **Technology:** GSAP · ScrollTrigger · Canvas
- **Performance cost:** alto

## Usage

```tsx
const { containerRef, videoRef } = useScrollScrubVideo()
```

## Behaviour by context

| Context | Behaviour |
| --- | --- |
| Desktop | Busca el fotograma dentro del ciclo de dibujado, nunca más rápido de lo que el decodificador entrega. |
| Tablet | Igual que en escritorio. |
| Mobile | **simplificado** — Clips más cortos o menos fotogramas. Necesita un servidor que responda peticiones Range o no se puede recorrer. |
| Reduced motion | **estático** — Se queda en el primer fotograma. |

## When to use it

- Presentaciones de producto
- Antes y después
- Vídeos de montaje o de proceso
