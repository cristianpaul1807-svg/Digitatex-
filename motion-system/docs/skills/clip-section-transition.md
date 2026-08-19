# Clip Section Transition

`clip-section-transition` · Section Transitions · intermediate

Section unmasks from a rounded inset to full bleed.

## Source reference

> then ease-out fade

## Implementation

- **Export:** `SectionTransition`
- **Technology:** GSAP · ScrollTrigger · CSS
- **Performance cost:** low

## Usage

```tsx
<SectionTransition kind="clip" />
```

## Behaviour by context

| Context | Behaviour |
| --- | --- |
| Desktop | clip-path inset with an animated corner radius. |
| Tablet | Identical. |
| Mobile | **identical** — Composited. |
| Reduced motion | **static** — Clip removed. |

## When to use it

- Hero-to-content handoffs
- Chapter breaks
