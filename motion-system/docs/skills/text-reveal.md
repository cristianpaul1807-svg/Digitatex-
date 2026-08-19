# Text Reveal

`text-reveal` · Text Motion · intermediate

Headline that rises into view by line, word, character or as a whole.

## Source reference

> Scroll: GSAP ScrollTrigger for section reveals · Headline mixing sans + italic serif

## Implementation

- **Export:** `TextReveal`
- **Technology:** GSAP · ScrollTrigger
- **Performance cost:** low

## Usage

```tsx
<TextReveal by="lines" stagger={0.08}>Your headline</TextReveal>
```

## Behaviour by context

| Context | Behaviour |
| --- | --- |
| Desktop | Lines rise out of an overflow mask, staggered, after document.fonts.ready. |
| Tablet | Identical. |
| Mobile | **simplified** — Word or element mode: a long headline split into many lines on a narrow screen staggers for too long. |
| Reduced motion | **static** — No split at all, which also leaves the accessibility tree untouched. |

## When to use it

- Hero headlines
- Section openers
- Pull quotes
