# MOTION SOURCE MAP

Every skill in the library, traced back to the fragment of the reference
brief it was extracted from.

**A note on the reference.** Section 01 of the commissioning brief left the
reference specification unpasted — the placeholder `[PASTE THE ORIGINAL
HYLIOX PROMPT HERE]` is still there. The brief does, however, quote the
specification verbatim throughout sections 05 to 18, and those quoted
fragments are the corpus used here. They are reproduced exactly.

No branding, copy, template name or commercial content from the reference
was carried across. What was extracted is behaviour: timing, layering,
thresholds, fallbacks.

---

## 22 reference fragments → 41 skills

### REFERENCE: "then ease-out fade"

→ **`page-reveal`** — Page Reveal  
   The page entrance that follows the loader out: a short rise and fade.  
   *GSAP · React · none cost · mobile: identical · reduced motion: static*

→ **`fade-section-transition`** — Fade Section Transition  
   Section fades in as it enters.  
   *GSAP · ScrollTrigger · none cost · mobile: identical · reduced motion: static*

→ **`scale-section-transition`** — Scale Section Transition  
   Section settles from 1.06 to 1.  
   *GSAP · ScrollTrigger · none cost · mobile: identical · reduced motion: static*

→ **`clip-section-transition`** — Clip Section Transition  
   Section unmasks from a rounded inset to full bleed.  
   *GSAP · ScrollTrigger · CSS · low cost · mobile: identical · reduced motion: static*

→ **`blur-transition`** — Blur Transition  
   Section resolves from blurred to sharp.  
   *GSAP · ScrollTrigger · CSS · high cost · mobile: simplified · reduced motion: static*

→ **`cinematic-section-transition`** — Cinematic Section Transition  
   Clip, scale and blur composed into one signature entrance.  
   *GSAP · ScrollTrigger · CSS · high cost · mobile: simplified · reduced motion: static*

### REFERENCE: "Scroll: GSAP ScrollTrigger for section reveals"

→ **`text-reveal`** — Text Reveal  
   Headline that rises into view by line, word, character or as a whole.  
   *GSAP · ScrollTrigger · low cost · mobile: simplified · reduced motion: static*

→ **`fade-up`** — Fade Up  
   The workhorse entrance: opacity plus a short directional rise.  
   *GSAP · ScrollTrigger · none cost · mobile: simplified · reduced motion: static*

→ **`fade-scale`** — Fade + Scale  
   Entrance that settles from 0.94 to 1 while fading in.  
   *GSAP · ScrollTrigger · none cost · mobile: identical · reduced motion: static*

→ **`stagger-reveal`** — Stagger Reveal  
   Children animate in sequence from one trigger.  
   *GSAP · ScrollTrigger · low cost · mobile: simplified · reduced motion: static*

→ **`clip-reveal`** — Clip Reveal  
   Content wiped into view with an animated clip-path.  
   *GSAP · ScrollTrigger · CSS · low cost · mobile: identical · reduced motion: static*

→ **`scroll-reveal-engine`** — Scroll Reveal Engine  
   The single ScrollTrigger abstraction every reveal goes through: cleanup, initial state, reduced motion and dev markers handled once.  
   *GSAP · ScrollTrigger · React · low cost · mobile: identical · reduced motion: disabled*

### REFERENCE: "Each card: rounded 16px, glass surface, hover lift 6px"

→ **`card-hover-lift`** — Card Hover Lift  
   Card rises toward the viewer on hover.  
   *Framer Motion · none cost · mobile: disabled · reduced motion: disabled*

→ **`image-zoom`** — Image Zoom  
   Image scales inside a fixed frame while the frame stays put.  
   *Framer Motion · CSS · none cost · mobile: disabled · reduced motion: disabled*

→ **`glass-card`** — Glass Card  
   Translucent blurred surface with a hairline border and an upper-lip highlight.  
   *CSS · medium cost · mobile: simplified · reduced motion: identical*

→ **`ambient-blur`** — Ambient Blur  
   Frosted plane over whatever sits behind it.  
   *CSS · high cost · mobile: simplified · reduced motion: identical*

→ **`gradient-border`** — Gradient Border  
   Gradient hairline around a surface, masked so glass behind it survives.  
   *CSS · none cost · mobile: identical · reduced motion: identical*

### REFERENCE: "Sticky-pinned scroll variant on desktop"

→ **`sticky-story`** — Sticky Storytelling  
   Pinned section that steps through chapters, driving text and visuals from one progress value.  
   *GSAP · ScrollTrigger · React · medium cost · mobile: simplified · reduced motion: simplified*

→ **`horizontal-scroll`** — Horizontal Scroll  
   Vertical scrolling drives a horizontal track across a pinned section.  
   *GSAP · ScrollTrigger · medium cost · mobile: simplified · reduced motion: simplified*

→ **`scroll-scrub-media`** — Scroll-Scrub Media  
   Video or image sequence whose frame is chosen by scroll position.  
   *GSAP · ScrollTrigger · Canvas · high cost · mobile: simplified · reduced motion: static*

→ **`product-scroll`** — Product Scroll  
   Pinned product stage with synchronised chapters and hotspots, over a video, an image sequence or a canvas renderer.  
   *GSAP · ScrollTrigger · Canvas · hls.js · React · high cost · mobile: simplified · reduced motion: simplified*

### REFERENCE: "Hover: card lift, button slight scale (1.02)"

→ **`magnetic-button`** — Magnetic Button  
   Button leans toward the cursor inside a radius and springs back on leave.  
   *GSAP · Framer Motion · low cost · mobile: disabled · reduced motion: disabled*

→ **`magnetic-link`** — Magnetic Link  
   Weaker magnetic pull for inline links, with no scale.  
   *GSAP · none cost · mobile: disabled · reduced motion: disabled*

→ **`image-tilt`** — Image Tilt  
   3D lean toward the cursor, capped at about 7 degrees.  
   *GSAP · low cost · mobile: disabled · reduced motion: disabled*

### REFERENCE: "Loading screen (3s monogram shimmer, ease-out fade)"

→ **`cinematic-loader`** — Cinematic Loader  
   Full-screen entrance overlay with a shimmering mark and an eased exit.  
   *GSAP · React · CSS · low cost · mobile: simplified · reduced motion: disabled*

→ **`light-sweep`** — Light Sweep  
   Specular band travelling across a surface, on hover or on a loop.  
   *CSS · low cost · mobile: simplified · reduced motion: disabled*

### REFERENCE: "50% black overlay"

→ **`media-overlay`** — Media Overlay  
   Configurable wash over media — flat, directional or radial — that makes overlaid text legible.  
   *CSS · none cost · mobile: identical · reduced motion: identical*

→ **`vignette`** — Vignette  
   Edge darkening that settles the eye on the centre.  
   *CSS · none cost · mobile: identical · reduced motion: identical*

### REFERENCE: "Subtle dust particle layer on top"

→ **`ambient-particles`** — Ambient Particles (Dust)  
   Canvas dust motes drifting upward, each breathing at its own rate.  
   *Canvas · React · medium cost · mobile: simplified · reduced motion: disabled*

→ **`grain`** — Grain / Noise  
   Film-like texture over the interface, stepped rather than smooth.  
   *CSS · low cost · mobile: simplified · reduced motion: static*

### REFERENCE: "Headline mixing sans + italic serif"

→ **`text-reveal`** — Text Reveal  
   Headline that rises into view by line, word, character or as a whole.  
   *GSAP · ScrollTrigger · low cost · mobile: simplified · reduced motion: static*

→ **`split-text-reveal`** — Split Text Reveal  
   The splitter underneath Text Reveal: cuts text into spans while preserving the accessible label.  
   *GSAP · low cost · mobile: simplified · reduced motion: disabled*

### REFERENCE: "button slight scale (1.02)"

→ **`card-scale`** — Card Scale  
   Subtle scale on hover, composable with lift.  
   *Framer Motion · none cost · mobile: disabled · reduced motion: disabled*

→ **`button-scale`** — Button Scale  
   Hover and press feedback at 1.02 and 0.98.  
   *Framer Motion · none cost · mobile: simplified · reduced motion: disabled*

### REFERENCE: "Background: subtle radial lime glow at bottom-center"

→ **`hover-glow`** — Hover Glow  
   Radial highlight that tracks the cursor across a surface.  
   *CSS · React · low cost · mobile: simplified · reduced motion: simplified*

→ **`radial-glow`** — Radial Glow  
   Coloured light bloom anchored anywhere in a section.  
   *CSS · none cost · mobile: identical · reduced motion: static*

### REFERENCE: "Hero section (full-bleed HLS video bg, centered headline)"

→ **`cinematic-hero`** — Cinematic Hero  
   Full-viewport hero composing background media, overlay, glow, particles, vignette and grain in a fixed layer order.  
   *React · CSS · Canvas · hls.js · medium cost · mobile: simplified · reduced motion: static*

### REFERENCE: "Hero takes 100svh"

→ **`cinematic-hero`** — Cinematic Hero  
   Full-viewport hero composing background media, overlay, glow, particles, vignette and grain in a fixed layer order.  
   *React · CSS · Canvas · hls.js · medium cost · mobile: simplified · reduced motion: static*

### REFERENCE: "Background: hls.js video with 50% black overlay"

→ **`background-video`** — Background Video (HLS)  
   Autoplaying muted background video with an HLS path, progressive fallbacks and three separate still-image fallbacks.  
   *hls.js · React · high cost · mobile: static · reduced motion: static*

### REFERENCE: "Mobile: disable parallax, simplify hover states"

→ **`parallax`** — Parallax  
   Moves an element at a different rate from the page, expressed relative to its own size.  
   *GSAP · ScrollTrigger · low cost · mobile: disabled · reduced motion: disabled*

### REFERENCE: "scroll-controlled"

→ **`product-scroll`** — Product Scroll  
   Pinned product stage with synchronised chapters and hotspots, over a video, an image sequence or a canvas renderer.  
   *GSAP · ScrollTrigger · Canvas · hls.js · React · high cost · mobile: simplified · reduced motion: simplified*

### REFERENCE: "8 cards in an asymmetric grid"

→ **`bento-grid-motion`** — Bento Grid Motion  
   Staggered entrance for an asymmetric grid, ordered by DOM position.  
   *GSAP · ScrollTrigger · low cost · mobile: simplified · reduced motion: static*

### REFERENCE: "Marquee: CSS infinite scroll, pauses on hover"

→ **`infinite-marquee`** — Infinite Marquee  
   Seamless looping strip in CSS, pausing on hover.  
   *CSS · React · none cost · mobile: identical · reduced motion: static*

### REFERENCE: "BUILT WITH AI"

→ **`infinite-marquee`** — Infinite Marquee  
   Seamless looping strip in CSS, pausing on hover.  
   *CSS · React · none cost · mobile: identical · reduced motion: static*

### REFERENCE: "NOT BY AI ·"

→ **`infinite-marquee`** — Infinite Marquee  
   Seamless looping strip in CSS, pausing on hover.  
   *CSS · React · none cost · mobile: identical · reduced motion: static*

### REFERENCE: "FAQ accordion"

→ **`animated-accordion`** — Animated Accordion  
   Height and opacity panel transition with full keyboard and ARIA support.  
   *Framer Motion · React · low cost · mobile: identical · reduced motion: simplified*

### REFERENCE: "Smooth height + opacity transition (300ms ease-out)"

→ **`animated-accordion`** — Animated Accordion  
   Height and opacity panel transition with full keyboard and ARIA support.  
   *Framer Motion · React · low cost · mobile: identical · reduced motion: simplified*

---

## Extracted but not stated

Some skills exist because the reference implies them rather than names
them. They are listed against the nearest fragment above and marked here
so the distinction is not lost:

- `split-text-reveal` — implied by "Headline mixing sans + italic serif"
- `card-scale` — implied by "button slight scale (1.02)"
- `image-zoom` — implied by "Each card: rounded 16px, glass surface, hover lift 6px"
- `magnetic-button` — implied by "Hover: card lift, button slight scale (1.02)"
- `magnetic-link` — implied by "Hover: card lift, button slight scale (1.02)"
- `hover-glow` — implied by "Background: subtle radial lime glow at bottom-center"
- `image-tilt` — implied by "Hover: card lift, button slight scale (1.02)"
- `vignette` — implied by "50% black overlay"
- `light-sweep` — implied by "Loading screen (3s monogram shimmer, ease-out fade)"
- `ambient-blur` — implied by "Each card: rounded 16px, glass surface, hover lift 6px"
- `gradient-border` — implied by "Each card: rounded 16px, glass surface, hover lift 6px"
