# Partículas de polvo

`ambient-particles` · Hero y cine · intermedio

Motas de polvo en canvas que suben flotando, cada una respirando a su ritmo.

## Source reference

> Subtle dust particle layer on top

## Implementation

- **Export:** `DustParticles`
- **Technology:** Canvas · React
- **Performance cost:** medio

## Usage

```tsx
<DustParticles count={46} disableOnMobile />
```

## Behaviour by context

| Context | Behaviour |
| --- | --- |
| Desktop | Unas 46 motas en una sola capa de canvas. El bucle se detiene en cuanto la capa sale de pantalla. |
| Tablet | Igual, con menos motas. |
| Mobile | **simplificado** — Un tercio de la cantidad, o fuera del todo con disableOnMobile. |
| Reduced motion | **desactivado** — No se dibuja nada; el canvas ni siquiera se monta. |

## When to use it

- Heros cinematográficos
- Secciones oscuras con atmósfera
