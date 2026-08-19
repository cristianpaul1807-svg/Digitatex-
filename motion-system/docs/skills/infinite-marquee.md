# Infinite Marquee

`infinite-marquee` · Marquee · basic

Seamless looping strip in CSS, pausing on hover.

## Source reference

> Marquee: CSS infinite scroll, pauses on hover · BUILT WITH AI · NOT BY AI ·

## Implementation

- **Export:** `Marquee`
- **Technology:** CSS · React
- **Performance cost:** none

## Usage

```tsx
<Marquee speed={26} reverse pauseOnHover>{items}</Marquee>
```

## Behaviour by context

| Context | Behaviour |
| --- | --- |
| Desktop | Track duplicated exactly once and translated -50%; the duplicate is aria-hidden so the strip is read once. |
| Tablet | Identical. |
| Mobile | **identical** — Composited off the main thread, so it is one of the few effects that costs nothing on a phone. |
| Reduced motion | **static** — Becomes a normal scrollable strip. The words were the point; the movement was decoration. |

## When to use it

- Client logos
- Statement strips
- Service lists
