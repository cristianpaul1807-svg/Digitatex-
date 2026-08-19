# Resplandor de fondo

`radial-glow` · Atmósfera · básico

Un foco de luz de color, anclado donde haga falta dentro de una sección.

## Source reference

> Background: subtle radial lime glow at bottom-center

## Implementation

- **Export:** `RadialGlow`
- **Technology:** CSS
- **Performance cost:** nulo

## Usage

```tsx
<RadialGlow x="50%" y="100%" color="rgba(200,242,74,0.3)" animated />
```

## Behaviour by context

| Context | Behaviour |
| --- | --- |
| Desktop | Posición, tamaño, color e intensidad configurables, con un latido opcional de 9 s. |
| Tablet | Igual que en escritorio. |
| Mobile | **igual** — Un degradado no cuesta nada. |
| Reduced motion | **estático** — Se quita el latido; el resplandor se queda. |

## When to use it

- Fondos de hero
- Secciones de cierre
- Anclar el color de acento
