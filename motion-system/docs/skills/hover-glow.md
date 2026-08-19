# Resplandor que sigue al cursor

`hover-glow` · Microinteracciones · intermedio

Un halo de luz que persigue al cursor por la superficie.

## Source reference

> Background: subtle radial lime glow at bottom-center

## Implementation

- **Export:** `useHoverGlow`
- **Technology:** CSS · React
- **Performance cost:** bajo

## Usage

```tsx
const ref = useHoverGlow({ size: 320 })
```

## Behaviour by context

| Context | Behaviour |
| --- | --- |
| Desktop | Dos variables de CSS alimentan un único degradado fijo, así que no se reconstruye el degradado en cada movimiento. |
| Tablet | Resplandor fijo y centrado. |
| Mobile | **simplificado** — Resplandor fijo y centrado a media intensidad, para que la superficie siga leyéndose iluminada. |
| Reduced motion | **simplificado** — Resplandor fijo y centrado. |

## When to use it

- Tarjetas
- Paneles
- Zonas de llamada a la acción
