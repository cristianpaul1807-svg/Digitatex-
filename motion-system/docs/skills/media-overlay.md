# Velo sobre el vídeo

`media-overlay` · Hero y cine · básico

Capa configurable sobre el vídeo — plana, direccional o radial — que hace legible el texto de encima.

## Source reference

> 50% black overlay

## Implementation

- **Export:** `MediaOverlay`
- **Technology:** CSS
- **Performance cost:** nulo

## Usage

```tsx
<MediaOverlay opacity={0.5} gradient="to-bottom" />
```

## Behaviour by context

| Context | Behaviour |
| --- | --- |
| Desktop | Degradado direccional por defecto: oscurece solo la franja donde va el texto y deja viva el resto de la imagen. |
| Tablet | Igual que en escritorio. |
| Mobile | **igual** — Suele necesitar más opacidad: con menos pantalla el texto cae sobre zonas más cargadas del fotograma. |
| Reduced motion | **igual** — Es estático por naturaleza. |

## When to use it

- Cualquier texto sobre vídeo o foto
- Legibilidad del hero
- Velos en imágenes de tarjeta
