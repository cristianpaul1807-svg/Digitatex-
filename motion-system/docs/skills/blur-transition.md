# Blur Transition

`blur-transition` · Section Transitions · intermediate

Section resolves from blurred to sharp.

## Source reference

> then ease-out fade

## Implementation

- **Export:** `SectionTransition`
- **Technology:** GSAP · ScrollTrigger · CSS
- **Performance cost:** high

## Usage

```tsx
<SectionTransition kind="blur" />
```

## Behaviour by context

| Context | Behaviour |
| --- | --- |
| Desktop | 14px to 0 blur. |
| Tablet | Reduced radius. |
| Mobile | **simplified** — Prefer fade. filter: blur repaints the whole subtree every frame, which is fine as a short entrance and costly when scrubbed. |
| Reduced motion | **static** — Sharp immediately. |

## When to use it

- A single hero handoff
- Sparingly
