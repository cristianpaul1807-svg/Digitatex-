# Zoom de imagen

`image-zoom` · Tarjetas y bento · básico

La imagen crece dentro de un marco fijo, y el marco no se mueve.

## Source reference

> Each card: rounded 16px, glass surface, hover lift 6px

## Implementation

- **Export:** `ZoomImage`
- **Technology:** Framer Motion · CSS
- **Performance cost:** nulo

## Usage

```tsx
<ZoomImage src="/shot.jpg" scale={1.06} />
```

## Behaviour by context

| Context | Behaviour |
| --- | --- |
| Desktop | Crece un 6% en 700 ms dentro de un marco que recorta. |
| Tablet | Igual que en escritorio. |
| Mobile | **desactivado** — En el móvil no existe el estado de cursor encima. |
| Reduced motion | **desactivado** — Imagen quieta. |

## When to use it

- Miniaturas de porfolio
- Tarjetas editoriales
- Fichas de producto
