# Cinematic Hero

`cinematic-hero` · Hero & Cinematic · intermediate

Full-viewport hero composing background media, overlay, glow, particles, vignette and grain in a fixed layer order.

## Source reference

> Hero section (full-bleed HLS video bg, centered headline) · Hero takes 100svh

## Implementation

- **Export:** `CinematicHero`
- **Technology:** React · CSS · Canvas · hls.js
- **Performance cost:** medium

## Usage

```tsx
<CinematicHero media={{ sources }} particles grain glow>{...}</CinematicHero>
```

## Behaviour by context

| Context | Behaviour |
| --- | --- |
| Desktop | All layers active over a playing video. |
| Tablet | All layers, reduced particle count. |
| Mobile | **simplified** — Poster instead of video, a third of the particles. Sized in svh so the CTA is not hidden under the address bar on arrival. |
| Reduced motion | **static** — Poster frame, no particles, no glow pulse. The composition survives. |

## When to use it

- Agency landing pages
- Product launches
- Brand campaign sites
