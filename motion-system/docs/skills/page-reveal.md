# Entrada de página

`page-reveal` · Carga y transiciones · básico

La entrada que sigue al loader: una subida corta y una opacidad.

## Source reference

> then ease-out fade

## Implementation

- **Export:** `PageReveal`
- **Technology:** GSAP · React
- **Performance cost:** nulo

## Usage

```tsx
<PageReveal delay={0.3}>{children}</PageReveal>
```

## Behaviour by context

| Context | Behaviour |
| --- | --- |
| Desktop | 14 px de subida en 1 s, arrancando cuando el loader se retira. |
| Tablet | Igual que en escritorio. |
| Mobile | **igual** — Solo opacidad y transform, así que no cuesta nada en ningún sitio. |
| Reduced motion | **estático** — El contenido se coloca, no se anima. |

## When to use it

- Toda página que use el loader
- Cambios de ruta
