# Sección que se descubre

`clip-section-transition` · Transiciones de sección · intermedio

La sección se descubre desde un recuadro redondeado hasta ocupar todo el ancho.

## Source reference

> then ease-out fade

## Implementation

- **Export:** `SectionTransition`
- **Technology:** GSAP · ScrollTrigger · CSS
- **Performance cost:** bajo

## Usage

```tsx
<SectionTransition kind="clip" />
```

## Behaviour by context

| Context | Behaviour |
| --- | --- |
| Desktop | Máscara que se abre, con las esquinas redondeándose en el camino. |
| Tablet | Igual que en escritorio. |
| Mobile | **igual** — Lo resuelve el compositor. |
| Reduced motion | **estático** — Se quita la máscara. |

## When to use it

- El paso del hero al contenido
- Cortes de capítulo
