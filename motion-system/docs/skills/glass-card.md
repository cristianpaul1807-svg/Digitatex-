# Glass Card

`glass-card` · Cards & Bento · basic

Translucent blurred surface with a hairline border and an upper-lip highlight.

## Source reference

> Each card: rounded 16px, glass surface, hover lift 6px

## Implementation

- **Export:** `GlassCard`
- **Technology:** CSS
- **Performance cost:** medium

## Usage

```tsx
<GlassCard radius={16}>{content}</GlassCard>
```

## Behaviour by context

| Context | Behaviour |
| --- | --- |
| Desktop | backdrop-filter blur with saturation, plus the top-edge highlight that makes it read as glass. |
| Tablet | Identical. |
| Mobile | **simplified** — Reduce the blur radius. backdrop-filter is the single most expensive property in this library on mobile GPUs. |
| Reduced motion | **identical** — Static surface. |

## When to use it

- Cards over imagery
- Floating panels
- Navigation bars
