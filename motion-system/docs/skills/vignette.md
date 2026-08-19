# Vignette

`vignette` · Atmosphere · basic

Edge darkening that settles the eye on the centre.

## Source reference

> 50% black overlay

## Implementation

- **Export:** `Vignette`
- **Technology:** CSS
- **Performance cost:** none

## Usage

```tsx
<Vignette intensity={0.55} spread={0.55} />
```

## Behaviour by context

| Context | Behaviour |
| --- | --- |
| Desktop | Elliptical gradient with configurable intensity and spread. |
| Tablet | Identical. |
| Mobile | **identical** — Free. |
| Reduced motion | **identical** — Static. |

## When to use it

- Over video
- Full-bleed imagery
- Cinematic framing
