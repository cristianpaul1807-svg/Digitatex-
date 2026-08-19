# Tarjeta que se eleva

`card-hover-lift` · Tarjetas y bento · básico

La tarjeta sube hacia quien mira al pasar el cursor.

## Source reference

> Each card: rounded 16px, glass surface, hover lift 6px

## Implementation

- **Export:** `HoverCard`
- **Technology:** Framer Motion
- **Performance cost:** nulo

## Usage

```tsx
<HoverCard lift={6}>{content}</HoverCard>
```

## Behaviour by context

| Context | Behaviour |
| --- | --- |
| Desktop | 6 px de subida en 300 ms. |
| Tablet | Igual allí donde hay puntero. |
| Mobile | **desactivado** — Ni se instala el detector. Un efecto de cursor que se dispara al tocar hace que la tarjeta parezca rota justo antes de navegar. |
| Reduced motion | **desactivado** — Solo cambio de color. |

## When to use it

- Rejillas bento
- Tarjetas de caso
- Tablas de precios
