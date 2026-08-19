# Partidor de texto

`split-text-reveal` · Movimiento de texto · avanzado

El motor que hay debajo del titular: parte el texto en trozos sin perder la etiqueta accesible.

## Source reference

> Headline mixing sans + italic serif

## Implementation

- **Export:** `splitText`
- **Technology:** GSAP
- **Performance cost:** bajo

## Usage

```tsx
const { parts, revert } = splitText(el, "lines")
```

## Behaviour by context

| Context | Behaviour |
| --- | --- |
| Desktop | Parte por letras, palabras o líneas, midiendo con las tipografías ya cargadas. |
| Tablet | Igual que en escritorio. |
| Mobile | **simplificado** — Se evita partir por letras: decenas de trozos por titular cuestan cálculo de maquetación para poca ganancia visible. |
| Reduced motion | **desactivado** — No se llega a usar. |

## When to use it

- Titulares cinematográficos
- Tipografía en movimiento
