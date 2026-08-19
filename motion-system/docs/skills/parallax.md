# Parallax

`parallax` · Movimiento por scroll · intermedio

Mueve un elemento a distinta velocidad que la página, en proporción a su propio tamaño.

## Source reference

> Mobile: disable parallax, simplify hover states

## Implementation

- **Export:** `useParallax`
- **Technology:** GSAP · ScrollTrigger
- **Performance cost:** bajo

## Usage

```tsx
const ref = useParallax({ speed: 0.18 })
```

## Behaviour by context

| Context | Behaviour |
| --- | --- |
| Desktop | El recorrido es una fracción del tamaño del elemento, así que un solo valor sirve en todas las pantallas. |
| Tablet | Velocidad reducida. |
| Mobile | **desactivado** — Apagado por defecto. Con un recorrido corto y el dedo en el cristal, el parallax se percibe como retraso. |
| Reduced motion | **desactivado** — No se crea la animación. |

## When to use it

- Imágenes de hero
- Secciones editoriales
- Fondos por capas
