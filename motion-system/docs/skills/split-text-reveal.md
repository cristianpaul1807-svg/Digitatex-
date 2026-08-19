# Split Text Reveal

`split-text-reveal` · Text Motion · advanced

The splitter underneath Text Reveal: cuts text into spans while preserving the accessible label.

## Source reference

> Headline mixing sans + italic serif

## Implementation

- **Export:** `splitText`
- **Technology:** GSAP
- **Performance cost:** low

## Usage

```tsx
const { parts, revert } = splitText(el, "lines")
```

## Behaviour by context

| Context | Behaviour |
| --- | --- |
| Desktop | Char, word or line splitting, measured after fonts are ready. |
| Tablet | Identical. |
| Mobile | **simplified** — Character splitting is avoided: dozens of inline-block spans per headline cost layout for little visible gain. |
| Reduced motion | **disabled** — Not invoked. |

## When to use it

- Cinematic headlines
- Kinetic typography
