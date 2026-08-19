# Desenfoque de fondo

`ambient-blur` · Atmósfera · básico

Un plano esmerilado sobre lo que haya detrás.

## Source reference

> Each card: rounded 16px, glass surface, hover lift 6px

## Implementation

- **Export:** `AmbientBlur`
- **Technology:** CSS
- **Performance cost:** alto

## Usage

```tsx
<AmbientBlur blur={24} tint="rgba(8,9,10,0.45)" />
```

## Behaviour by context

| Context | Behaviour |
| --- | --- |
| Desktop | Desenfoque y saturación del fondo, con un tinte encima. |
| Tablet | Con menos radio. |
| Mobile | **simplificado** — Bajar el radio a la mitad o cambiarlo por un tinte opaco. Es la propiedad más cara de la librería. |
| Reduced motion | **igual** — Estática. |

## When to use it

- Menús que se quedan pegados
- Fondos de ventana modal
- Paneles superpuestos
