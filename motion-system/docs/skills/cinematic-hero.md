# Hero cinematográfico

`cinematic-hero` · Hero y cine · intermedio

Hero a pantalla completa que compone vídeo de fondo, velo, resplandor, partículas, viñeta y grano en un orden de capas fijo.

## Source reference

> Hero section (full-bleed HLS video bg, centered headline) · Hero takes 100svh

## Implementation

- **Export:** `CinematicHero`
- **Technology:** React · CSS · Canvas · hls.js
- **Performance cost:** medio

## Usage

```tsx
<CinematicHero media={{ sources }} particles grain glow>{...}</CinematicHero>
```

## Behaviour by context

| Context | Behaviour |
| --- | --- |
| Desktop | Todas las capas activas sobre un vídeo en marcha. |
| Tablet | Todas las capas, con menos partículas. |
| Mobile | **simplificado** — Imagen fija en vez de vídeo y un tercio de las partículas. Medido en svh para que el botón no quede bajo la barra de direcciones al llegar. |
| Reduced motion | **estático** — Fotograma fijo, sin partículas y sin latido del resplandor. La composición se mantiene. |

## When to use it

- Landings de agencia
- Lanzamientos de producto
- Webs de campaña de marca
