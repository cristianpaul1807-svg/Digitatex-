# Image Zoom

`image-zoom` · Cards & Bento · basic

Image scales inside a fixed frame while the frame stays put.

## Source reference

> Each card: rounded 16px, glass surface, hover lift 6px

## Implementation

- **Export:** `ZoomImage`
- **Technology:** Framer Motion · CSS
- **Performance cost:** none

## Usage

```tsx
<ZoomImage src="/shot.jpg" scale={1.06} />
```

## Behaviour by context

| Context | Behaviour |
| --- | --- |
| Desktop | 1.06 over 700ms inside an overflow-hidden frame. |
| Tablet | Identical. |
| Mobile | **disabled** — No hover state exists. |
| Reduced motion | **disabled** — Static image. |

## When to use it

- Portfolio thumbnails
- Editorial cards
- Product tiles
