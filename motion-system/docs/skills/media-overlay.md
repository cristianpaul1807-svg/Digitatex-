# Media Overlay

`media-overlay` · Hero & Cinematic · basic

Configurable wash over media — flat, directional or radial — that makes overlaid text legible.

## Source reference

> 50% black overlay

## Implementation

- **Export:** `MediaOverlay`
- **Technology:** CSS
- **Performance cost:** none

## Usage

```tsx
<MediaOverlay opacity={0.5} gradient="to-bottom" />
```

## Behaviour by context

| Context | Behaviour |
| --- | --- |
| Desktop | Directional gradient by default: darkens the band the copy sits on and leaves the rest of the image alive. |
| Tablet | Identical. |
| Mobile | **identical** — Often needs more opacity: less screen means text sits over busier parts of the frame. |
| Reduced motion | **identical** — Static by nature. |

## When to use it

- Any text over media
- Hero legibility
- Card image scrims
