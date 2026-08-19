# Motor de entradas por scroll

`scroll-reveal-engine` · Movimiento por scroll · avanzado

La única pieza por la que pasan todas las entradas: limpieza, estado inicial, movimiento reducido y marcas de depuración, resueltos una sola vez.

## Source reference

> Scroll: GSAP ScrollTrigger for section reveals

## Implementation

- **Export:** `useScrollReveal`
- **Technology:** GSAP · ScrollTrigger · React
- **Performance cost:** bajo

## Usage

```tsx
const ref = useScrollReveal({ kind: "fade-up", children: ":scope > *" })
```

## Behaviour by context

| Context | Behaviour |
| --- | --- |
| Desktop | Los disparadores viven dentro de su contenedor y se deshacen solos al desmontarlo. |
| Tablet | Igual que en escritorio. |
| Mobile | **igual** — Se ignora el cambio de alto del móvil, para que plegar la barra de direcciones no recalcule todos los disparadores. |
| Reduced motion | **desactivado** — No se crea disparador; los elementos se muestran directamente. |

## When to use it

- La base de todos los demás efectos de scroll
