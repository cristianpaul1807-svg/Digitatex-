# Image Tilt

`image-tilt` · Microinteractions · intermediate

3D lean toward the cursor, capped at about 7 degrees.

## Source reference

> Hover: card lift, button slight scale (1.02)

## Implementation

- **Export:** `useTilt`
- **Technology:** GSAP
- **Performance cost:** low

## Usage

```tsx
const ref = useTilt({ max: 7 })
```

## Behaviour by context

| Context | Behaviour |
| --- | --- |
| Desktop | Y follows horizontal position and X inverts vertical, which is what makes the surface feel pushed rather than steered. |
| Tablet | Disabled on coarse pointers. |
| Mobile | **disabled** — No listener attached. |
| Reduced motion | **disabled** — Flat surface. |

## When to use it

- Feature cards
- Product thumbnails
- Team portraits
