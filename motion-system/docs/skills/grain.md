# Grano de película

`grain` · Atmósfera · básico

Textura de película sobre la interfaz, a saltos y no suave.

## Source reference

> Subtle dust particle layer on top

## Implementation

- **Export:** `Grain`
- **Technology:** CSS
- **Performance cost:** bajo

## Usage

```tsx
<Grain opacity={0.045} animated />
```

## Behaviour by context

| Context | Behaviour |
| --- | --- |
| Desktop | Un mosaico de ruido en SVG, dibujado una vez y repetido. |
| Tablet | Igual que en escritorio. |
| Mobile | **simplificado** — Se quita la animación y se queda la textura. |
| Reduced motion | **estático** — Textura sin el titileo. |

## When to use it

- Interfaces oscuras
- Heros cinematográficos
- Webs dominadas por fotografía
