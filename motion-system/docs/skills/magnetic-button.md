# Botón magnético

`magnetic-button` · Microinteracciones · intermedio

El botón se inclina hacia el cursor dentro de un radio y vuelve al salir.

## Source reference

> Hover: card lift, button slight scale (1.02)

## Implementation

- **Export:** `MagneticButton`
- **Technology:** GSAP · Framer Motion
- **Performance cost:** bajo

## Usage

```tsx
<MagneticButton strength={0.35} radius={60}>Talk to us</MagneticButton>
```

## Behaviour by context

| Context | Behaviour |
| --- | --- |
| Desktop | El detector vive en el propio botón y reapunta una sola animación viva, en vez de crear una por cada movimiento del ratón. |
| Tablet | Apagado salvo que haya un puntero fino. |
| Mobile | **desactivado** — Ni se instala el detector. No hay cursor al que atraerse. |
| Reduced motion | **desactivado** — Un botón normal. |

## When to use it

- Botones principales
- Acciones del hero
