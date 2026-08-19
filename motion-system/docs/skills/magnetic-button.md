# Magnetic Button

`magnetic-button` · Microinteractions · intermediate

Button leans toward the cursor inside a radius and springs back on leave.

## Source reference

> Hover: card lift, button slight scale (1.02)

## Implementation

- **Export:** `MagneticButton`
- **Technology:** GSAP · Framer Motion
- **Performance cost:** low

## Usage

```tsx
<MagneticButton strength={0.35} radius={60}>Talk to us</MagneticButton>
```

## Behaviour by context

| Context | Behaviour |
| --- | --- |
| Desktop | Element-scoped pointer listener and gsap.quickTo, so a moving cursor retargets one live tween instead of spawning one per event. |
| Tablet | Disabled unless a fine pointer is present. |
| Mobile | **disabled** — No listener is attached at all. There is no cursor to be attracted to. |
| Reduced motion | **disabled** — Plain button. |

## When to use it

- Primary CTAs
- Hero actions
