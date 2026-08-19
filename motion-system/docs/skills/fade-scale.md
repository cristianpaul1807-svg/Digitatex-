# Fade + Scale

`fade-scale` · Text Motion · basic

Entrance that settles from 0.94 to 1 while fading in.

## Source reference

> Scroll: GSAP ScrollTrigger for section reveals

## Implementation

- **Export:** `FadeScale`
- **Technology:** GSAP · ScrollTrigger
- **Performance cost:** none

## Usage

```tsx
<FadeScale>{children}</FadeScale>
```

## Behaviour by context

| Context | Behaviour |
| --- | --- |
| Desktop | Scale 0.94 to 1 with opacity. |
| Tablet | Identical. |
| Mobile | **identical** — Transform and opacity only. |
| Reduced motion | **static** — Placed at final scale. |

## When to use it

- Media blocks
- Cards
- Logos
