# Scale Section Transition

`scale-section-transition` · Section Transitions · basic

Section settles from 1.06 to 1.

## Source reference

> then ease-out fade

## Implementation

- **Export:** `SectionTransition`
- **Technology:** GSAP · ScrollTrigger
- **Performance cost:** none

## Usage

```tsx
<SectionTransition kind="scale" />
```

## Behaviour by context

| Context | Behaviour |
| --- | --- |
| Desktop | Scale with opacity. |
| Tablet | Identical. |
| Mobile | **identical** — Transform only. |
| Reduced motion | **static** — Placed at final scale. |

## When to use it

- Media-led sections
- Full-bleed panels
