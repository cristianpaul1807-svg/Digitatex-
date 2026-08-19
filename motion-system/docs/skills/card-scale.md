# Card Scale

`card-scale` · Cards & Bento · basic

Subtle scale on hover, composable with lift.

## Source reference

> button slight scale (1.02)

## Implementation

- **Export:** `HoverCard`
- **Technology:** Framer Motion
- **Performance cost:** none

## Usage

```tsx
<HoverCard scale={1.02} lift={0} />
```

## Behaviour by context

| Context | Behaviour |
| --- | --- |
| Desktop | 1.01 to 1.03. Beyond that it reads as a different card rather than the same one responding. |
| Tablet | Identical. |
| Mobile | **disabled** — No hover state exists. |
| Reduced motion | **disabled** — Off. |

## When to use it

- Feature cards
- Media tiles
