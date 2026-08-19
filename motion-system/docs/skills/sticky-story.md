# Relato anclado

`sticky-story` · Movimiento por scroll · avanzado

La sección se ancla y va pasando capítulos, moviendo texto e imagen desde un mismo valor de avance.

## Source reference

> Sticky-pinned scroll variant on desktop

## Implementation

- **Export:** `StickyStory`
- **Technology:** GSAP · ScrollTrigger · React
- **Performance cost:** medio

## Usage

```tsx
<StickyStory chapters={chapters} heightPerStep={1} />
```

## Behaviour by context

| Context | Behaviour |
| --- | --- |
| Desktop | La sección se ancla y los capítulos se funden en el sitio, con una barra de avance. |
| Tablet | Anclada, con menos recorrido por capítulo. |
| Mobile | **simplificado** — Una maqueta distinta, no una más pequeña: los capítulos se apilan y se recorren normal, porque anclar pelea con la barra del navegador en el móvil. |
| Reduced motion | **simplificado** — Pasa a la maqueta apilada. |

## When to use it

- Secciones de proceso o método
- Casos de estudio
- Recorridos por funcionalidades
