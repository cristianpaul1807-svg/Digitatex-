# Entrada con escala

`fade-scale` · Movimiento de texto · básico

Entra asentándose del 94% al 100% mientras aparece.

## Source reference

> Scroll: GSAP ScrollTrigger for section reveals

## Implementation

- **Export:** `FadeScale`
- **Technology:** GSAP · ScrollTrigger
- **Performance cost:** nulo

## Usage

```tsx
<FadeScale>{children}</FadeScale>
```

## Behaviour by context

| Context | Behaviour |
| --- | --- |
| Desktop | Escala del 94% al 100% junto con la opacidad. |
| Tablet | Igual que en escritorio. |
| Mobile | **igual** — Solo transform y opacidad. |
| Reduced motion | **estático** — Se coloca ya a su tamaño final. |

## When to use it

- Bloques de imagen o vídeo
- Tarjetas
- Logotipos
