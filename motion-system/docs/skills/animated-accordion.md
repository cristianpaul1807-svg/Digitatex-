# Acordeón animado

`animated-accordion` · Movimiento de interfaz · intermedio

Los paneles abren y cierran con altura y opacidad, con teclado y accesibilidad completos.

## Source reference

> FAQ accordion · Smooth height + opacity transition (300ms ease-out)

## Implementation

- **Export:** `Accordion`
- **Technology:** Framer Motion · React
- **Performance cost:** bajo

## Usage

```tsx
<Accordion items={faq} mode="single" />
```

## Behaviour by context

| Context | Behaviour |
| --- | --- |
| Desktop | 300 ms midiendo la altura real, en modo de uno abierto o varios. |
| Tablet | Igual que en escritorio. |
| Mobile | **igual** — Mismo comportamiento, con zonas de toque más grandes. |
| Reduced motion | **simplificado** — Abre y cierra al instante; el cambio de estado se sigue viendo. |

## When to use it

- FAQ
- Fichas técnicas
- Información que se despliega a demanda
