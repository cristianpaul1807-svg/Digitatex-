# Fade Up

`fade-up` · Text Motion · basic

The workhorse entrance: opacity plus a short directional rise.

## Source reference

> Scroll: GSAP ScrollTrigger for section reveals

## Implementation

- **Export:** `FadeUp`
- **Technology:** GSAP · ScrollTrigger
- **Performance cost:** none

## Usage

```tsx
<FadeUp distance={36}>{children}</FadeUp>
```

## Behaviour by context

| Context | Behaviour |
| --- | --- |
| Desktop | 36px rise, 0.8s, power3.out. |
| Tablet | Identical. |
| Mobile | **simplified** — Distance drops to ~16px: a long travel on a short viewport arrives late. |
| Reduced motion | **static** — Visible immediately; no trigger created. |

## When to use it

- Almost anything
- The default when unsure
