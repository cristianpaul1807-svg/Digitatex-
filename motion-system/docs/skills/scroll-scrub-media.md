# Scroll-Scrub Media

`scroll-scrub-media` · Scroll Motion · advanced

Video or image sequence whose frame is chosen by scroll position.

## Source reference

> Sticky-pinned scroll variant on desktop

## Implementation

- **Export:** `useScrollScrubVideo`
- **Technology:** GSAP · ScrollTrigger · Canvas
- **Performance cost:** high

## Usage

```tsx
const { containerRef, videoRef } = useScrollScrubVideo()
```

## Behaviour by context

| Context | Behaviour |
| --- | --- |
| Desktop | Seeks inside requestAnimationFrame, never faster than the decoder can deliver. |
| Tablet | Identical. |
| Mobile | **simplified** — Shorter clips or fewer frames. Needs a server answering HTTP Range, or it will not seek at all. |
| Reduced motion | **static** — First frame held. |

## When to use it

- Product reveals
- Before and after transformations
- Assembly and process films
