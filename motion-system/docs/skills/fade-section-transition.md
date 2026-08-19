# Fade Section Transition

`fade-section-transition` · Section Transitions · basic

Section fades in as it enters.

## Source reference

> then ease-out fade

## Implementation

- **Export:** `SectionTransition`
- **Technology:** GSAP · ScrollTrigger
- **Performance cost:** none

## Usage

```tsx
<SectionTransition kind="fade">{section}</SectionTransition>
```

## Behaviour by context

| Context | Behaviour |
| --- | --- |
| Desktop | 1.2s opacity. |
| Tablet | Identical. |
| Mobile | **identical** — Opacity only. |
| Reduced motion | **static** — Visible immediately. |

## When to use it

- The default section entrance
