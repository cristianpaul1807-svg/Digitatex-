# Aparición del titular

`text-reveal` · Movimiento de texto · intermedio

El titular entra subiendo, por líneas, por palabras, por letras o entero.

## Source reference

> Scroll: GSAP ScrollTrigger for section reveals · Headline mixing sans + italic serif

## Implementation

- **Export:** `TextReveal`
- **Technology:** GSAP · ScrollTrigger
- **Performance cost:** bajo

## Usage

```tsx
<TextReveal by="lines" stagger={0.08}>Your headline</TextReveal>
```

## Behaviour by context

| Context | Behaviour |
| --- | --- |
| Desktop | Las líneas suben desde detrás de una máscara, escalonadas, una vez cargadas las tipografías. |
| Tablet | Igual que en escritorio. |
| Mobile | **simplificado** — Por palabras o entero: un titular largo partido en muchas líneas tarda demasiado en una pantalla estrecha. |
| Reduced motion | **estático** — No se parte nada, lo que además deja intacto el árbol de accesibilidad. |

## When to use it

- Titulares de hero
- Aperturas de sección
- Citas destacadas
