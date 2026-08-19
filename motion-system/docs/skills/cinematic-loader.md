# Cinematic Loader

`cinematic-loader` · Load & Transitions · intermediate

Full-screen entrance overlay with a shimmering mark and an eased exit.

## Source reference

> Loading screen (3s monogram shimmer, ease-out fade)

## Implementation

- **Export:** `CinematicLoader`
- **Technology:** GSAP · React · CSS
- **Performance cost:** low

## Usage

```tsx
<CinematicLoader duration={3} logo="MS" skipOnRepeatVisit />
```

## Behaviour by context

| Context | Behaviour |
| --- | --- |
| Desktop | Full 3s hold, shimmering monogram, 0.9s eased exit that lifts the mark as the veil drops. |
| Tablet | Identical. |
| Mobile | **simplified** — Same timing, but the hold is the first thing to cut if LCP is tight. |
| Reduced motion | **disabled** — Removed entirely, hold included. Asking for less motion is not asking to wait longer for it. |

## When to use it

- Agency and portfolio sites
- Campaign microsites
- Anywhere the first frame sets a tone
