# Tarjeta de cristal

`glass-card` · Tarjetas y bento · básico

Superficie translúcida y desenfocada, con borde de un píxel y un brillo en el canto superior.

## Source reference

> Each card: rounded 16px, glass surface, hover lift 6px

## Implementation

- **Export:** `GlassCard`
- **Technology:** CSS
- **Performance cost:** medio

## Usage

```tsx
<GlassCard radius={16}>{content}</GlassCard>
```

## Behaviour by context

| Context | Behaviour |
| --- | --- |
| Desktop | Desenfoque del fondo con algo de saturación, más el brillo del canto que la hace leerse como cristal. |
| Tablet | Igual que en escritorio. |
| Mobile | **simplificado** — Bajar el radio de desenfoque. Es la propiedad más cara de toda la librería en la gráfica de un móvil. |
| Reduced motion | **igual** — Superficie estática. |

## When to use it

- Tarjetas sobre fotografía
- Paneles flotantes
- Barras de navegación
