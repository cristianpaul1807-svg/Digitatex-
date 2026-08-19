# Scroll horizontal

`horizontal-scroll` · Movimiento por scroll · avanzado

El scroll vertical mueve una tira lateral mientras la sección está anclada.

## Source reference

> Sticky-pinned scroll variant on desktop

## Implementation

- **Export:** `HorizontalScrollSection`
- **Technology:** GSAP · ScrollTrigger
- **Performance cost:** medio

## Usage

```tsx
<HorizontalScrollSection>{cards}</HorizontalScrollSection>
```

## Behaviour by context

| Context | Behaviour |
| --- | --- |
| Desktop | La distancia se calcula del ancho real de la tira y se recalcula al recargar medidas. |
| Tablet | Igual, con una tira más corta. |
| Mobile | **simplificado** — Tira deslizable nativa con imán y contención, para que pasarse del final no dispare el gesto de volver atrás. |
| Reduced motion | **simplificado** — Tira deslizable normal. |

## When to use it

- Galerías de porfolio
- Líneas de tiempo
- Gamas de producto
