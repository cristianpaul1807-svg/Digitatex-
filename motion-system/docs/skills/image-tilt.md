# Inclinación 3D

`image-tilt` · Microinteracciones · intermedio

La superficie se inclina hacia el cursor, con tope en unos 7 grados.

## Source reference

> Hover: card lift, button slight scale (1.02)

## Implementation

- **Export:** `useTilt`
- **Technology:** GSAP
- **Performance cost:** bajo

## Usage

```tsx
const ref = useTilt({ max: 7 })
```

## Behaviour by context

| Context | Behaviour |
| --- | --- |
| Desktop | El eje vertical sigue al horizontal y el horizontal se invierte: eso es lo que hace que parezca empujada y no dirigida. |
| Tablet | Apagado con puntero grueso. |
| Mobile | **desactivado** — No se instala el detector. |
| Reduced motion | **desactivado** — Superficie plana. |

## When to use it

- Tarjetas de característica
- Product thumbnails
- Retratos de equipo
