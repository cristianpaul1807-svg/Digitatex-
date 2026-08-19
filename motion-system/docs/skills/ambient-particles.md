# Ambient Particles (Dust)

`ambient-particles` · Hero & Cinematic · intermediate

Canvas dust motes drifting upward, each breathing at its own rate.

## Source reference

> Subtle dust particle layer on top

## Implementation

- **Export:** `DustParticles`
- **Technology:** Canvas · React
- **Performance cost:** medium

## Usage

```tsx
<DustParticles count={46} disableOnMobile />
```

## Behaviour by context

| Context | Behaviour |
| --- | --- |
| Desktop | ~46 motes on one canvas layer. The loop stops the moment the layer leaves the viewport. |
| Tablet | Same, fewer motes. |
| Mobile | **simplified** — A third of the count, or removed outright with disableOnMobile. |
| Reduced motion | **disabled** — Nothing rendered; the canvas is not even mounted. |

## When to use it

- Cinematic heroes
- Dark atmospheric sections
