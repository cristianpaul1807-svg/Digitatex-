# Entrada de rejilla bento

`bento-grid-motion` · Tarjetas y bento · intermedio

Entrada escalonada para una rejilla asimétrica, en orden de lectura.

## Source reference

> 8 cards in an asymmetric grid

## Implementation

- **Export:** `BentoGrid`
- **Technology:** GSAP · ScrollTrigger
- **Performance cost:** bajo

## Usage

```tsx
<BentoGrid stagger={0.07}>{cards}</BentoGrid>
```

## Behaviour by context

| Context | Behaviour |
| --- | --- |
| Desktop | Las tarjetas suben en orden de lectura, con 0,07 s entre cada una. |
| Tablet | Igual que en escritorio. |
| Mobile | **simplificado** — La rejilla pasa a una columna, donde el orden de lectura y el visual ya coinciden. |
| Reduced motion | **estático** — Todas las tarjetas visibles. |

## When to use it

- Rejillas de características
- Resúmenes de servicios
- Paneles de control
