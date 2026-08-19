# Parallax

`parallax` · Scroll Motion · intermediate

Moves an element at a different rate from the page, expressed relative to its own size.

## Source reference

> Mobile: disable parallax, simplify hover states

## Implementation

- **Export:** `useParallax`
- **Technology:** GSAP · ScrollTrigger
- **Performance cost:** low

## Usage

```tsx
const ref = useParallax({ speed: 0.18 })
```

## Behaviour by context

| Context | Behaviour |
| --- | --- |
| Desktop | Travel is a fraction of the element size, so one value works at every breakpoint. |
| Tablet | Reduced speed. |
| Mobile | **disabled** — Off by default. Short scrolls and a finger on the glass turn parallax into lag. |
| Reduced motion | **disabled** — No tween created. |

## When to use it

- Hero imagery
- Editorial sections
- Layered backgrounds
