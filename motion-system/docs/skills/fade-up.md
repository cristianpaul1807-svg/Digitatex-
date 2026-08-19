# Entrada desde abajo

`fade-up` · Movimiento de texto · básico

La entrada de siempre: opacidad más una subida corta.

## Source reference

> Scroll: GSAP ScrollTrigger for section reveals

## Implementation

- **Export:** `FadeUp`
- **Technology:** GSAP · ScrollTrigger
- **Performance cost:** nulo

## Usage

```tsx
<FadeUp distance={36}>{children}</FadeUp>
```

## Behaviour by context

| Context | Behaviour |
| --- | --- |
| Desktop | 36 px de subida en 0,8 s. |
| Tablet | Igual que en escritorio. |
| Mobile | **simplificado** — La distancia baja a unos 16 px: un recorrido largo en una pantalla corta llega tarde. |
| Reduced motion | **estático** — Visible desde el principio; no se crea ningún disparador. |

## When to use it

- Casi cualquier cosa
- La opción por defecto si dudas
