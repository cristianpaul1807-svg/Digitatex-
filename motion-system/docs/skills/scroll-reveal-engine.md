# Scroll Reveal Engine

`scroll-reveal-engine` · Scroll Motion · advanced

The single ScrollTrigger abstraction every reveal goes through: cleanup, initial state, reduced motion and dev markers handled once.

## Source reference

> Scroll: GSAP ScrollTrigger for section reveals

## Implementation

- **Export:** `useScrollReveal`
- **Technology:** GSAP · ScrollTrigger · React
- **Performance cost:** low

## Usage

```tsx
const ref = useScrollReveal({ kind: "fade-up", children: ":scope > *" })
```

## Behaviour by context

| Context | Behaviour |
| --- | --- |
| Desktop | Triggers scoped to a container and reverted on unmount by useGSAP. |
| Tablet | Identical. |
| Mobile | **identical** — ignoreMobileResize is set globally so URL-bar collapse does not refresh every trigger. |
| Reduced motion | **disabled** — No trigger created; targets are made visible. |

## When to use it

- The foundation of every other scroll skill
