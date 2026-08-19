# Bento Grid Motion

`bento-grid-motion` · Cards & Bento · intermediate

Staggered entrance for an asymmetric grid, ordered by DOM position.

## Source reference

> 8 cards in an asymmetric grid

## Implementation

- **Export:** `BentoGrid`
- **Technology:** GSAP · ScrollTrigger
- **Performance cost:** low

## Usage

```tsx
<BentoGrid stagger={0.07}>{cards}</BentoGrid>
```

## Behaviour by context

| Context | Behaviour |
| --- | --- |
| Desktop | Cards rise in reading order, 0.07s apart. |
| Tablet | Identical. |
| Mobile | **simplified** — The grid collapses to one column, where DOM and visual order already agree. |
| Reduced motion | **static** — All cards visible. |

## When to use it

- Feature grids
- Service overviews
- Dashboards
