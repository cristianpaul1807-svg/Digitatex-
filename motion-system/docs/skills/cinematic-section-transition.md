# Transición cinematográfica

`cinematic-section-transition` · Transiciones de sección · avanzado

Máscara, escala y desenfoque compuestos en una sola entrada de autor.

## Source reference

> then ease-out fade

## Implementation

- **Export:** `SectionTransition`
- **Technology:** GSAP · ScrollTrigger · CSS
- **Performance cost:** alto

## Usage

```tsx
<SectionTransition kind="cinematic" />
```

## Behaviour by context

| Context | Behaviour |
| --- | --- |
| Desktop | 1,6 s y tres propiedades a la vez. |
| Tablet | Igual que en escritorio. |
| Mobile | **simplificado** — Se queda sin el desenfoque. |
| Reduced motion | **estático** — El contenido se coloca sin más. |

## When to use it

- Un solo momento por página: donde el relato gira
