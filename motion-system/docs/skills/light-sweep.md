# Light Sweep

`light-sweep` · Atmosphere · basic

Specular band travelling across a surface, on hover or on a loop.

## Source reference

> Loading screen (3s monogram shimmer, ease-out fade)

## Implementation

- **Export:** `LightSweep`
- **Technology:** CSS
- **Performance cost:** low

## Usage

```tsx
<LightSweep onHover speed={3.2} />
```

## Behaviour by context

| Context | Behaviour |
| --- | --- |
| Desktop | Transform on a gradient: composite only, no repaint. |
| Tablet | Identical. |
| Mobile | **simplified** — Hover mode never fires; use loop mode or omit it. |
| Reduced motion | **disabled** — Renders nothing. |

## When to use it

- Buttons
- Cards
- Logo marks
