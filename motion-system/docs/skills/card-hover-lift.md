# Card Hover Lift

`card-hover-lift` · Cards & Bento · basic

Card rises toward the viewer on hover.

## Source reference

> Each card: rounded 16px, glass surface, hover lift 6px

## Implementation

- **Export:** `HoverCard`
- **Technology:** Framer Motion
- **Performance cost:** none

## Usage

```tsx
<HoverCard lift={6}>{content}</HoverCard>
```

## Behaviour by context

| Context | Behaviour |
| --- | --- |
| Desktop | 6px rise over 300ms. |
| Tablet | Identical where a pointer exists. |
| Mobile | **disabled** — No listener attached. A hover that fires on tap makes the card look broken in the moment before navigation. |
| Reduced motion | **disabled** — Colour feedback only. |

## When to use it

- Bento grids
- Case study cards
- Pricing tables
