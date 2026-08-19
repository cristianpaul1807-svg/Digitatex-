# Botón que responde

`button-scale` · Microinteracciones · básico

Respuesta al cursor y a la pulsación: 102% y 98%.

## Source reference

> button slight scale (1.02)

## Implementation

- **Export:** `MagneticButton`
- **Technology:** Framer Motion
- **Performance cost:** nulo

## Usage

```tsx
<MagneticButton variant="solid">Start</MagneticButton>
```

## Behaviour by context

| Context | Behaviour |
| --- | --- |
| Desktop | 102% con el cursor encima, 98% al pulsar, en 200 ms. |
| Tablet | Solo el estado de pulsación. |
| Mobile | **simplificado** — La respuesta al pulsar se mantiene; la del cursor no existe. |
| Reduced motion | **desactivado** — Solo transición de color. |

## When to use it

- Todos los botones del sistema
