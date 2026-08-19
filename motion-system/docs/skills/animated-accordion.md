# Animated Accordion

`animated-accordion` · UI Motion · intermediate

Height and opacity panel transition with full keyboard and ARIA support.

## Source reference

> FAQ accordion · Smooth height + opacity transition (300ms ease-out)

## Implementation

- **Export:** `Accordion`
- **Technology:** Framer Motion · React
- **Performance cost:** low

## Usage

```tsx
<Accordion items={faq} mode="single" />
```

## Behaviour by context

| Context | Behaviour |
| --- | --- |
| Desktop | 300ms height-from-auto, single or multiple open modes. |
| Tablet | Identical. |
| Mobile | **identical** — Same behaviour, larger tap targets. |
| Reduced motion | **simplified** — Instant open and close; the state change is still visible. |

## When to use it

- FAQ
- Specifications
- Progressive disclosure
