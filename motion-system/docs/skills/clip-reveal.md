# Clip Reveal

`clip-reveal` · Text Motion · intermediate

Content wiped into view with an animated clip-path.

## Source reference

> Scroll: GSAP ScrollTrigger for section reveals

## Implementation

- **Export:** `ClipReveal`
- **Technology:** GSAP · ScrollTrigger · CSS
- **Performance cost:** low

## Usage

```tsx
<ClipReveal clipFrom="bottom">{children}</ClipReveal>
```

## Behaviour by context

| Context | Behaviour |
| --- | --- |
| Desktop | Vertical, horizontal or centre wipe. |
| Tablet | Identical. |
| Mobile | **identical** — clip-path animates on the compositor; no repaint. |
| Reduced motion | **static** — Clip removed, content shown. |

## When to use it

- Images
- Editorial dividers
- Full-bleed panel reveals
