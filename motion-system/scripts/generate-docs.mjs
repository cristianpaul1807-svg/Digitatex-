/**
 * Generates MOTION-SOURCE-MAP.md and docs/skills/*.md from the registry.
 *
 * Generated rather than written by hand for one reason: documentation that is
 * maintained separately from the thing it documents is documentation that is
 * wrong within a month. The registry is the single source of truth, and this
 * script is how it reaches the filesystem.
 *
 * Run with:  node --experimental-strip-types scripts/generate-docs.mjs
 */
import { mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');

// The registry imports its types through the `@` alias, which node cannot
// resolve. The import is type-only and therefore erasable, so a throwaway copy
// without it is enough to load the data.
const src = readFileSync(join(root, 'src/showcase/registry/skills.ts'), 'utf8')
  .replace(/^import type .*$/m, '')
  .replace(/export const categoryLabels: Record<MotionCategory, string>/, 'export const categoryLabels');
const tmp = join(here, '.registry.tmp.ts');
writeFileSync(tmp, src);
const { motionSkills, categoryLabels } = await import('./.registry.tmp.ts');
rmSync(tmp);

const techLabel = {
  gsap: 'GSAP', scrolltrigger: 'ScrollTrigger', 'framer-motion': 'Framer Motion',
  css: 'CSS', canvas: 'Canvas', 'hls.js': 'hls.js', react: 'React',
};
const tech = (s) => s.dependencies.map((d) => techLabel[d] ?? d).join(' · ');

/* ---- MOTION-SOURCE-MAP.md ------------------------------------------------ */

const byReference = new Map();
for (const s of motionSkills) {
  for (const frag of s.sourceReference.split(' · ')) {
    const key = frag.trim();
    (byReference.get(key) ?? byReference.set(key, []).get(key)).push(s);
  }
}

const map = [
  '# MOTION SOURCE MAP',
  '',
  'Every skill in the library, traced back to the fragment of the reference',
  'brief it was extracted from.',
  '',
  '**A note on the reference.** Section 01 of the commissioning brief left the',
  'reference specification unpasted — the placeholder `[PASTE THE ORIGINAL',
  'HYLIOX PROMPT HERE]` is still there. The brief does, however, quote the',
  'specification verbatim throughout sections 05 to 18, and those quoted',
  'fragments are the corpus used here. They are reproduced exactly.',
  '',
  'No branding, copy, template name or commercial content from the reference',
  'was carried across. What was extracted is behaviour: timing, layering,',
  'thresholds, fallbacks.',
  '',
  '---',
  '',
  `## ${byReference.size} reference fragments → ${motionSkills.length} skills`,
  '',
];

for (const [frag, skills] of [...byReference].sort((a, b) => b[1].length - a[1].length)) {
  map.push(`### REFERENCE: "${frag}"`, '');
  for (const s of skills) {
    map.push(`→ **\`${s.id}\`** — ${s.name}  `);
    map.push(`   ${s.description}  `);
    map.push(`   *${tech(s)} · ${s.performanceCost} cost · mobile: ${s.mobile.behaviour} · reduced motion: ${s.reducedMotion.behaviour}*`);
    map.push('');
  }
}

map.push('---', '', '## Extracted but not stated', '');
map.push('Some skills exist because the reference implies them rather than names');
map.push('them. They are listed against the nearest fragment above and marked here');
map.push('so the distinction is not lost:', '');
for (const s of motionSkills) {
  if (['card-scale', 'image-zoom', 'magnetic-button', 'magnetic-link', 'hover-glow', 'image-tilt', 'light-sweep', 'gradient-border', 'ambient-blur', 'vignette', 'split-text-reveal'].includes(s.id)) {
    map.push(`- \`${s.id}\` — implied by "${s.sourceReference}"`);
  }
}
map.push('');

writeFileSync(join(root, 'MOTION-SOURCE-MAP.md'), map.join('\n'));

/* ---- docs/skills/*.md ---------------------------------------------------- */

mkdirSync(join(root, 'docs/skills'), { recursive: true });
for (const s of motionSkills) {
  const doc = `# ${s.name}

\`${s.id}\` · ${categoryLabels[s.category]} · ${s.difficulty}

${s.description}

## Source reference

> ${s.sourceReference}

## Implementation

- **Export:** \`${s.export}\`
- **Technology:** ${tech(s)}
- **Performance cost:** ${s.performanceCost}

## Usage

\`\`\`tsx
${s.usage}
\`\`\`

## Behaviour by context

| Context | Behaviour |
| --- | --- |
| Desktop | ${s.desktop} |
| Tablet | ${s.tablet} |
| Mobile | **${s.mobile.behaviour}** — ${s.mobile.note} |
| Reduced motion | **${s.reducedMotion.behaviour}** — ${s.reducedMotion.note} |

## When to use it

${s.recommendedUse.map((u) => `- ${u}`).join('\n')}
`;
  writeFileSync(join(root, 'docs/skills', `${s.id}.md`), doc);
}

/* ---- docs/README.md index ------------------------------------------------ */

const index = ['# Skill documentation', '', `${motionSkills.length} skills across ${Object.keys(categoryLabels).length} categories.`, ''];
for (const [key, label] of Object.entries(categoryLabels)) {
  const group = motionSkills.filter((s) => s.category === key);
  if (!group.length) continue;
  index.push(`## ${label}`, '');
  for (const s of group) index.push(`- [${s.name}](skills/${s.id}.md) — \`${s.id}\``);
  index.push('');
}
writeFileSync(join(root, 'docs/README.md'), index.join('\n'));

console.log(`generado: MOTION-SOURCE-MAP.md (${byReference.size} fragmentos), docs/skills/*.md (${motionSkills.length})`);
