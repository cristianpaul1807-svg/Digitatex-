# Barrido con máscara

`clip-reveal` · Movimiento de texto · intermedio

El contenido se descubre con un barrido, no con una opacidad.

## Source reference

> Scroll: GSAP ScrollTrigger for section reveals

## Implementation

- **Export:** `ClipReveal`
- **Technology:** GSAP · ScrollTrigger · CSS
- **Performance cost:** bajo

## Usage

```tsx
<ClipReveal clipFrom="bottom">{children}</ClipReveal>
```

## Behaviour by context

| Context | Behaviour |
| --- | --- |
| Desktop | Barrido vertical, horizontal o desde el centro. |
| Tablet | Igual que en escritorio. |
| Mobile | **igual** — El barrido lo resuelve el compositor; no repinta nada. |
| Reduced motion | **estático** — Se quita la máscara y se ve el contenido. |

## When to use it

- Imágenes
- Separadores editoriales
- Descubrir paneles a sangre
