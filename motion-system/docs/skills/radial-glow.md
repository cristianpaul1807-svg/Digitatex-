# Radial Glow

`radial-glow` · Atmosphere · basic

Coloured light bloom anchored anywhere in a section.

## Source reference

> Background: subtle radial lime glow at bottom-center

## Implementation

- **Export:** `RadialGlow`
- **Technology:** CSS
- **Performance cost:** none

## Usage

```tsx
<RadialGlow x="50%" y="100%" color="rgba(200,242,74,0.3)" animated />
```

## Behaviour by context

| Context | Behaviour |
| --- | --- |
| Desktop | Position, size, colour and intensity configurable, with an optional 9s breathing pulse. |
| Tablet | Identical. |
| Mobile | **identical** — A gradient costs nothing. |
| Reduced motion | **static** — Pulse removed; the glow stays. |

## When to use it

- Hero backgrounds
- CTA sections
- Accent anchoring
