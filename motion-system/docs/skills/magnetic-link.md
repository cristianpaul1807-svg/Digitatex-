# Magnetic Link

`magnetic-link` · Microinteractions · basic

Weaker magnetic pull for inline links, with no scale.

## Source reference

> Hover: card lift, button slight scale (1.02)

## Implementation

- **Export:** `MagneticLink`
- **Technology:** GSAP
- **Performance cost:** none

## Usage

```tsx
<MagneticLink href="/work">Selected work</MagneticLink>
```

## Behaviour by context

| Context | Behaviour |
| --- | --- |
| Desktop | 0.22 strength, 34px radius, no scale: a link that grows competes with its own paragraph. |
| Tablet | Disabled on coarse pointers. |
| Mobile | **disabled** — Plain link. |
| Reduced motion | **disabled** — Plain link. |

## When to use it

- Footer navigation
- Inline emphasis
- Menu items
