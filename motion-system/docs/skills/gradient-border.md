# Borde degradado

`gradient-border` · Atmósfera · intermedio

Un filo degradado alrededor de la superficie, enmascarado para que el cristal de debajo sobreviva.

## Source reference

> Each card: rounded 16px, glass surface, hover lift 6px

## Implementation

- **Export:** `GradientBorder`
- **Technology:** CSS
- **Performance cost:** nulo

## Usage

```tsx
<GradientBorder radius={16}>{content}</GradientBorder>
```

## Behaviour by context

| Context | Behaviour |
| --- | --- |
| Desktop | La máscara pinta solo el aro, así que el desenfoque de debajo sigue funcionando. |
| Tablet | Igual que en escritorio. |
| Mobile | **igual** — Gratis. |
| Reduced motion | **igual** — Estática. |

## When to use it

- Tarjetas destacadas
- Planes destacados
- Estados activos
