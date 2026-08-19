# Cinematic Section Transition

`cinematic-section-transition` · Section Transitions · advanced

Clip, scale and blur composed into one signature entrance.

## Source reference

> then ease-out fade

## Implementation

- **Export:** `SectionTransition`
- **Technology:** GSAP · ScrollTrigger · CSS
- **Performance cost:** high

## Usage

```tsx
<SectionTransition kind="cinematic" />
```

## Behaviour by context

| Context | Behaviour |
| --- | --- |
| Desktop | 1.6s, expo.out, three properties at once. |
| Tablet | Identical. |
| Mobile | **simplified** — Drops the blur channel. |
| Reduced motion | **static** — Content placed. |

## When to use it

- One moment per page: the point where the story turns
