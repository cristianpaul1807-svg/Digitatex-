# Sección que enfoca

`blur-transition` · Transiciones de sección · intermedio

La sección pasa de desenfocada a nítida.

## Source reference

> then ease-out fade

## Implementation

- **Export:** `SectionTransition`
- **Technology:** GSAP · ScrollTrigger · CSS
- **Performance cost:** alto

## Usage

```tsx
<SectionTransition kind="blur" />
```

## Behaviour by context

| Context | Behaviour |
| --- | --- |
| Desktop | De 14 px de desenfoque a cero. |
| Tablet | Con menos radio. |
| Mobile | **simplificado** — Mejor usar la aparición simple. El desenfoque repinta todo el bloque en cada fotograma: aceptable como entrada corta, caro si se recorre con el scroll. |
| Reduced motion | **estático** — Nítida desde el principio. |

## When to use it

- Un único paso desde el hero
- Con mucha moderación
