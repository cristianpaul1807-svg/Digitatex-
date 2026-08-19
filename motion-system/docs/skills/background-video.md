# Vídeo de fondo (HLS)

`background-video` · Hero y cine · avanzado

Vídeo de fondo mudo que arranca solo, con camino HLS, fuentes progresivas de respaldo y tres alternativas distintas a imagen fija.

## Source reference

> Background: hls.js video with 50% black overlay

## Implementation

- **Export:** `HlsVideo`
- **Technology:** hls.js · React
- **Performance cost:** alto

## Usage

```tsx
<HlsVideo src="/stream.m3u8" sources={[...]} poster="/poster.jpg" pauseOffscreen />
```

## Behaviour by context

| Context | Behaviour |
| --- | --- |
| Desktop | hls.js donde hace falta; HLS nativo en Safari, donde cargar además la librería serían dos reproductores peleando por un mismo elemento. |
| Tablet | Igual, limitado al tamaño del reproductor. |
| Mobile | **estático** — Imagen fija si se activa posterOnMobile. También cae a la imagen con Ahorro de datos y en 2G, por motivos distintos al del teléfono. |
| Reduced motion | **estático** — Fotograma fijo. Movimiento que nadie pidió es justo lo que esa preferencia significa. |

## When to use it

- Fondos de hero
- Fondos ambientales de sección
- Bobinas de trabajo
