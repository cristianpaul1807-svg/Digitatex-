# Entrada escalonada

`stagger-reveal` · Movimiento de texto · básico

Los hijos entran en secuencia desde un solo disparador.

## Source reference

> Scroll: GSAP ScrollTrigger for section reveals

## Implementation

- **Export:** `StaggerReveal`
- **Technology:** GSAP · ScrollTrigger
- **Performance cost:** bajo

## Usage

```tsx
<StaggerReveal stagger={0.08}>{items}</StaggerReveal>
```

## Behaviour by context

| Context | Behaviour |
| --- | --- |
| Desktop | 0,08 s entre cada hijo, en el orden en que están escritos. |
| Tablet | Igual que en escritorio. |
| Mobile | **simplificado** — Paso más corto: en una sola columna, doce elementos a 0,08 s tardan un segundo entero. |
| Reduced motion | **estático** — Todos los hijos visibles a la vez. |

## When to use it

- Listas
- Rejillas de características
- Menús
