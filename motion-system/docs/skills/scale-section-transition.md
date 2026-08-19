# Sección que se asienta

`scale-section-transition` · Transiciones de sección · básico

La sección se asienta del 106% al 100%.

## Source reference

> then ease-out fade

## Implementation

- **Export:** `SectionTransition`
- **Technology:** GSAP · ScrollTrigger
- **Performance cost:** nulo

## Usage

```tsx
<SectionTransition kind="scale" />
```

## Behaviour by context

| Context | Behaviour |
| --- | --- |
| Desktop | Escala junto con la opacidad. |
| Tablet | Igual que en escritorio. |
| Mobile | **igual** — Transform only. |
| Reduced motion | **estático** — Se coloca ya a su tamaño final. |

## When to use it

- Secciones dominadas por imagen
- Paneles a sangre
