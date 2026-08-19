# Enlace magnético

`magnetic-link` · Microinteracciones · básico

La misma atracción, más floja y sin crecer, para enlaces dentro del texto.

## Source reference

> Hover: card lift, button slight scale (1.02)

## Implementation

- **Export:** `MagneticLink`
- **Technology:** GSAP
- **Performance cost:** nulo

## Usage

```tsx
<MagneticLink href="/work">Selected work</MagneticLink>
```

## Behaviour by context

| Context | Behaviour |
| --- | --- |
| Desktop | Fuerza 0,22 y radio 34 px, sin escala: un enlace que crece compite con su propio párrafo. |
| Tablet | Apagado con puntero grueso. |
| Mobile | **desactivado** — Un enlace normal. |
| Reduced motion | **desactivado** — Un enlace normal. |

## When to use it

- Menú del pie
- Énfasis dentro del texto
- Elementos de menú
