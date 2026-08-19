# Button Scale

`button-scale` · Microinteractions · basic

Hover and press feedback at 1.02 and 0.98.

## Source reference

> button slight scale (1.02)

## Implementation

- **Export:** `MagneticButton`
- **Technology:** Framer Motion
- **Performance cost:** none

## Usage

```tsx
<MagneticButton variant="solid">Start</MagneticButton>
```

## Behaviour by context

| Context | Behaviour |
| --- | --- |
| Desktop | 1.02 on hover, 0.98 on press, 200ms. |
| Tablet | Press state only. |
| Mobile | **simplified** — Press feedback survives; hover does not exist. |
| Reduced motion | **disabled** — Colour transition only. |

## When to use it

- Every button in the system
