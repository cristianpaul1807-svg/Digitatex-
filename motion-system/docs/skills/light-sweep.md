# Barrido de luz

`light-sweep` · Atmósfera · básico

Una banda de brillo que cruza la superficie, al pasar el cursor o en bucle.

## Source reference

> Loading screen (3s monogram shimmer, ease-out fade)

## Implementation

- **Export:** `LightSweep`
- **Technology:** CSS
- **Performance cost:** bajo

## Usage

```tsx
<LightSweep onHover speed={3.2} />
```

## Behaviour by context

| Context | Behaviour |
| --- | --- |
| Desktop | Solo mueve un degradado: compone, no repinta. |
| Tablet | Igual que en escritorio. |
| Mobile | **simplificado** — El modo por cursor nunca se dispara; usar el modo en bucle o quitarlo. |
| Reduced motion | **desactivado** — No dibuja nada. |

## When to use it

- Botones
- Tarjetas
- Logotipos
