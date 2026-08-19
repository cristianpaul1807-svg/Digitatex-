# Product Scroll

`product-scroll` · Product Experience · advanced

Pinned product stage with synchronised chapters and hotspots, over a video, an image sequence or a canvas renderer.

## Source reference

> Sticky-pinned scroll variant on desktop · scroll-controlled

## Implementation

- **Export:** `ProductScroll`
- **Technology:** GSAP · ScrollTrigger · Canvas · hls.js · React
- **Performance cost:** high

## Usage

```tsx
<ProductScroll source={{ type: "canvas", render }} chapters={...} hotspots={...} />
```

## Behaviour by context

| Context | Behaviour |
| --- | --- |
| Desktop | Three interchangeable sources behind one API; chapters, hotspots and the progress rail all read the same value. |
| Tablet | Pinned with a shorter scroll length. |
| Mobile | **simplified** — Takes a stacked fallback layout. A product shot at 375px wide with a caption over it is unreadable. |
| Reduced motion | **simplified** — Stacked fallback; first frame only. |

## When to use it

- Product storytelling
- Hardware and industrial sites
- 3D render showcases
