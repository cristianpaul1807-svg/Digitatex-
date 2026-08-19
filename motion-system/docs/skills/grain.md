# Grain / Noise

`grain` · Atmosphere · basic

Film-like texture over the interface, stepped rather than smooth.

## Source reference

> Subtle dust particle layer on top

## Implementation

- **Export:** `Grain`
- **Technology:** CSS
- **Performance cost:** low

## Usage

```tsx
<Grain opacity={0.045} animated />
```

## Behaviour by context

| Context | Behaviour |
| --- | --- |
| Desktop | Inline SVG feTurbulence tile, rasterised once and repeated. |
| Tablet | Identical. |
| Mobile | **simplified** — Drop the animation, keep the texture. |
| Reduced motion | **static** — Texture without the shimmer. |

## When to use it

- Dark interfaces
- Cinematic heroes
- Photography-led sites
