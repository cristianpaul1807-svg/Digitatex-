import type { Config } from 'tailwindcss';

/**
 * The palette is deliberately narrow. A motion system lives or dies on
 * restraint: if every surface has its own colour, motion stops reading as
 * hierarchy and starts reading as noise.
 */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: '#08090a', soft: '#0e1012', raised: '#14171a' },
        bone: { DEFAULT: '#f2efe9', dim: '#a8a49b', faint: '#6d6a63' },
        accent: { DEFAULT: '#c8f24a', deep: '#8fae2b', glow: 'rgba(200,242,74,0.35)' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      transitionTimingFunction: {
        entrance: 'cubic-bezier(0.22, 1, 0.36, 1)',
        exit: 'cubic-bezier(0.4, 0, 1, 1)',
      },
    },
  },
  plugins: [],
} satisfies Config;
