# Ambient Blur

`ambient-blur` · Atmosphere · basic

Frosted plane over whatever sits behind it.

## Source reference

> Each card: rounded 16px, glass surface, hover lift 6px

## Implementation

- **Export:** `AmbientBlur`
- **Technology:** CSS
- **Performance cost:** high

## Usage

```tsx
<AmbientBlur blur={24} tint="rgba(8,9,10,0.45)" />
```

## Behaviour by context

| Context | Behaviour |
| --- | --- |
| Desktop | backdrop-filter blur and saturation with a tint. |
| Tablet | Reduced radius. |
| Mobile | **simplified** — Halve the radius or replace it with a solid tint. This is the most expensive property in the library. |
| Reduced motion | **identical** — Static. |

## When to use it

- Sticky navigation
- Modal backdrops
- Overlay panels
