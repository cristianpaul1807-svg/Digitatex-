# Hover Glow

`hover-glow` · Microinteractions · intermediate

Radial highlight that tracks the cursor across a surface.

## Source reference

> Background: subtle radial lime glow at bottom-center

## Implementation

- **Export:** `useHoverGlow`
- **Technology:** CSS · React
- **Performance cost:** low

## Usage

```tsx
const ref = useHoverGlow({ size: 320 })
```

## Behaviour by context

| Context | Behaviour |
| --- | --- |
| Desktop | Two CSS custom properties feed one static gradient, so no gradient is reparsed per pointer event. |
| Tablet | Static centred glow. |
| Mobile | **simplified** — Static centred glow at half intensity, so the surface still reads as lit. |
| Reduced motion | **simplified** — Static centred glow. |

## When to use it

- Cards
- Panels
- CTA surfaces
