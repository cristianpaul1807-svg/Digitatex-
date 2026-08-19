# Viñeta

`vignette` · Atmósfera · básico

Oscurece los bordes para que el ojo se pose en el centro.

## Source reference

> 50% black overlay

## Implementation

- **Export:** `Viñeta`
- **Technology:** CSS
- **Performance cost:** nulo

## Usage

```tsx
<Vignette intensity={0.55} spread={0.55} />
```

## Behaviour by context

| Context | Behaviour |
| --- | --- |
| Desktop | Degradado elíptico, con intensidad y extensión configurables. |
| Tablet | Igual que en escritorio. |
| Mobile | **igual** — Gratis. |
| Reduced motion | **igual** — Estática. |

## When to use it

- Sobre vídeo
- Imagen a sangre
- Encuadre cinematográfico
