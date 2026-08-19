# Tarjeta que crece

`card-scale` · Tarjetas y bento · básico

Un crecimiento mínimo al pasar el cursor, combinable con la elevación.

## Source reference

> button slight scale (1.02)

## Implementation

- **Export:** `HoverCard`
- **Technology:** Framer Motion
- **Performance cost:** nulo

## Usage

```tsx
<HoverCard scale={1.02} lift={0} />
```

## Behaviour by context

| Context | Behaviour |
| --- | --- |
| Desktop | Entre el 101% y el 103%. Más que eso se lee como otra tarjeta, no como la misma respondiendo. |
| Tablet | Igual que en escritorio. |
| Mobile | **desactivado** — En el móvil no existe el estado de cursor encima. |
| Reduced motion | **desactivado** — Apagado. |

## When to use it

- Tarjetas de característica
- Mosaicos de imagen
