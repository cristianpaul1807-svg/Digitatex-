# Sección que aparece

`fade-section-transition` · Transiciones de sección · básico

La sección aparece al entrar en pantalla.

## Source reference

> then ease-out fade

## Implementation

- **Export:** `SectionTransition`
- **Technology:** GSAP · ScrollTrigger
- **Performance cost:** nulo

## Usage

```tsx
<SectionTransition kind="fade">{section}</SectionTransition>
```

## Behaviour by context

| Context | Behaviour |
| --- | --- |
| Desktop | 1,2 s de opacidad. |
| Tablet | Igual que en escritorio. |
| Mobile | **igual** — Solo opacidad. |
| Reduced motion | **estático** — Visible desde el principio. |

## When to use it

- La entrada de sección por defecto
