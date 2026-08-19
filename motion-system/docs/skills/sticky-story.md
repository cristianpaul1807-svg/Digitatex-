# Sticky Storytelling

`sticky-story` · Scroll Motion · advanced

Pinned section that steps through chapters, driving text and visuals from one progress value.

## Source reference

> Sticky-pinned scroll variant on desktop

## Implementation

- **Export:** `StickyStory`
- **Technology:** GSAP · ScrollTrigger · React
- **Performance cost:** medium

## Usage

```tsx
<StickyStory chapters={chapters} heightPerStep={1} />
```

## Behaviour by context

| Context | Behaviour |
| --- | --- |
| Desktop | The section pins and chapters cross-fade in place with a progress rail. |
| Tablet | Pinned, shorter scroll per chapter. |
| Mobile | **simplified** — A different layout, not a smaller one: chapters stack and scroll normally, because pinning fights the URL bar on a phone. |
| Reduced motion | **simplified** — Falls back to the stacked layout. |

## When to use it

- Process and method sections
- Case studies
- Feature walkthroughs
