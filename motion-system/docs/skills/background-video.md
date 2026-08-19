# Background Video (HLS)

`background-video` · Hero & Cinematic · advanced

Autoplaying muted background video with an HLS path, progressive fallbacks and three separate still-image fallbacks.

## Source reference

> Background: hls.js video with 50% black overlay

## Implementation

- **Export:** `HlsVideo`
- **Technology:** hls.js · React
- **Performance cost:** high

## Usage

```tsx
<HlsVideo src="/stream.m3u8" sources={[...]} poster="/poster.jpg" pauseOffscreen />
```

## Behaviour by context

| Context | Behaviour |
| --- | --- |
| Desktop | hls.js where needed; native HLS in Safari, where loading the library too would mean two players fighting over one element. |
| Tablet | Identical, capped to the player size. |
| Mobile | **static** — Poster when posterOnMobile is set. Also falls back to the poster on Save-Data and 2G, for different reasons than the phone case. |
| Reduced motion | **static** — Poster frame. Motion nobody asked for is exactly what the setting means. |

## When to use it

- Hero backgrounds
- Ambient section backdrops
- Showreels
