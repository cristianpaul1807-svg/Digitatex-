# Gradient Border

`gradient-border` · Atmosphere · intermediate

Gradient hairline around a surface, masked so glass behind it survives.

## Source reference

> Each card: rounded 16px, glass surface, hover lift 6px

## Implementation

- **Export:** `GradientBorder`
- **Technology:** CSS
- **Performance cost:** none

## Usage

```tsx
<GradientBorder radius={16}>{content}</GradientBorder>
```

## Behaviour by context

| Context | Behaviour |
| --- | --- |
| Desktop | mask-composite: exclude paints only the ring, leaving any backdrop-filter underneath intact. |
| Tablet | Identical. |
| Mobile | **identical** — Free. |
| Reduced motion | **identical** — Static. |

## When to use it

- Featured cards
- Pricing highlights
- Active states
