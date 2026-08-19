# Horizontal Scroll

`horizontal-scroll` · Scroll Motion · advanced

Vertical scrolling drives a horizontal track across a pinned section.

## Source reference

> Sticky-pinned scroll variant on desktop

## Implementation

- **Export:** `HorizontalScrollSection`
- **Technology:** GSAP · ScrollTrigger
- **Performance cost:** medium

## Usage

```tsx
<HorizontalScrollSection>{cards}</HorizontalScrollSection>
```

## Behaviour by context

| Context | Behaviour |
| --- | --- |
| Desktop | Pin distance computed from the real track width and recomputed on refresh. |
| Tablet | Same, shorter track. |
| Mobile | **simplified** — Native swipe strip with scroll-snap and overscroll containment, so swiping past the end does not trigger the back gesture. |
| Reduced motion | **simplified** — Native strip. |

## When to use it

- Portfolio galleries
- Timelines
- Product ranges
