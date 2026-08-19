# Stagger Reveal

`stagger-reveal` · Text Motion · basic

Children animate in sequence from one trigger.

## Source reference

> Scroll: GSAP ScrollTrigger for section reveals

## Implementation

- **Export:** `StaggerReveal`
- **Technology:** GSAP · ScrollTrigger
- **Performance cost:** low

## Usage

```tsx
<StaggerReveal stagger={0.08}>{items}</StaggerReveal>
```

## Behaviour by context

| Context | Behaviour |
| --- | --- |
| Desktop | 0.08s between children, in DOM order. |
| Tablet | Identical. |
| Mobile | **simplified** — Tighter step: on a single column a 12-item stagger at 0.08s takes a full second to finish. |
| Reduced motion | **static** — All children visible at once. |

## When to use it

- Lists
- Feature grids
- Navigation
