# Page Reveal

`page-reveal` · Load & Transitions · basic

The page entrance that follows the loader out: a short rise and fade.

## Source reference

> then ease-out fade

## Implementation

- **Export:** `PageReveal`
- **Technology:** GSAP · React
- **Performance cost:** none

## Usage

```tsx
<PageReveal delay={0.3}>{children}</PageReveal>
```

## Behaviour by context

| Context | Behaviour |
| --- | --- |
| Desktop | 14px rise over 1s, starting as the loader clears. |
| Tablet | Identical. |
| Mobile | **identical** — Opacity and transform only, so it is free everywhere. |
| Reduced motion | **static** — Content is placed, not animated. |

## When to use it

- Every page that uses the loader
- Route transitions
