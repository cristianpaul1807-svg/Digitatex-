export type SplitBy = 'chars' | 'words' | 'lines';

export interface SplitResult {
  parts: HTMLElement[];
  /** Restores the original markup. Always call this on cleanup. */
  revert: () => void;
}

/**
 * Splits an element's text into animatable spans.
 *
 * Written by hand rather than pulled from a plugin for one reason worth
 * stating: splitting text destroys the accessibility tree. A headline cut into
 * 34 spans is announced as 34 fragments and copy-paste produces gibberish. So
 * the original string is preserved as `aria-label`, the spans are
 * `aria-hidden`, and `revert()` puts the DOM back exactly as it was.
 *
 * Line splitting measures `offsetTop` after layout, so it must run once fonts
 * are ready — a split measured against the fallback font groups the wrong words
 * as soon as the webfont swaps in.
 */
export function splitText(el: HTMLElement, by: SplitBy = 'words'): SplitResult {
  const original = el.innerHTML;
  const text = el.textContent ?? '';

  el.setAttribute('aria-label', text.trim());

  const makeSpan = (content: string, cls: string) => {
    const s = document.createElement('span');
    s.className = cls;
    s.style.display = 'inline-block';
    s.style.willChange = 'transform, opacity';
    s.textContent = content;
    s.setAttribute('aria-hidden', 'true');
    return s;
  };

  const revert = () => {
    el.innerHTML = original;
    el.removeAttribute('aria-label');
  };

  if (by === 'chars') {
    el.textContent = '';
    const parts: HTMLElement[] = [];
    for (const ch of Array.from(text)) {
      if (ch === ' ') {
        el.appendChild(document.createTextNode(' '));
        continue;
      }
      const s = makeSpan(ch, 'split-char');
      el.appendChild(s);
      parts.push(s);
    }
    return { parts, revert };
  }

  const words = text.split(/(\s+)/);
  el.textContent = '';
  const wordSpans: HTMLElement[] = [];
  for (const w of words) {
    if (!w.trim()) {
      el.appendChild(document.createTextNode(w));
      continue;
    }
    const s = makeSpan(w, 'split-word');
    el.appendChild(s);
    wordSpans.push(s);
  }

  if (by === 'words') return { parts: wordSpans, revert };

  // Group words into lines by vertical offset after layout.
  const lines = new Map<number, HTMLElement[]>();
  for (const s of wordSpans) {
    const top = Math.round(s.offsetTop);
    const bucket = lines.get(top);
    if (bucket) bucket.push(s);
    else lines.set(top, [s]);
  }

  const lineInners: HTMLElement[] = [];
  for (const [, group] of Array.from(lines).sort((a, b) => a[0] - b[0])) {
    const first = group[0];
    if (!first) continue;
    const line = document.createElement('span');
    line.className = 'split-line';
    line.style.display = 'block';
    // The mask that makes a line rise out of nothing lives here, not on the
    // words: clipping each word individually leaves seams at descenders.
    line.style.overflow = 'hidden';
    line.setAttribute('aria-hidden', 'true');

    const inner = document.createElement('span');
    inner.className = 'split-line-inner';
    inner.style.display = 'block';
    inner.style.willChange = 'transform, opacity';

    first.parentNode?.insertBefore(line, first);
    for (const w of group) {
      inner.appendChild(w);
      inner.appendChild(document.createTextNode(' '));
    }
    line.appendChild(inner);
    lineInners.push(inner);
  }

  return { parts: lineInners, revert };
}
