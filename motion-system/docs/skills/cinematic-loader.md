# Loader cinematográfico

`cinematic-loader` · Carga y transiciones · intermedio

Velo a pantalla completa con el logotipo brillando y una salida suavizada.

## Source reference

> Loading screen (3s monogram shimmer, ease-out fade)

## Implementation

- **Export:** `CinematicLoader`
- **Technology:** GSAP · React · CSS
- **Performance cost:** bajo

## Usage

```tsx
<CinematicLoader duration={3} logo="MS" skipOnRepeatVisit />
```

## Behaviour by context

| Context | Behaviour |
| --- | --- |
| Desktop | Aguanta 3 segundos, el monograma brilla, y sale en 0,9 s levantando la marca mientras el velo cae. |
| Tablet | Igual que en escritorio. |
| Mobile | **simplificado** — Mismos tiempos, pero la espera es lo primero que se recorta si la carga va justa. |
| Reduced motion | **desactivado** — Se quita entero, la espera incluida. Pedir menos movimiento no es pedir esperar más por él. |

## When to use it

- Webs de agencia y porfolios
- Microsites de campaña
- Donde el primer fotograma marca el tono
