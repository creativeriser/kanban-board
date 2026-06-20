/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        canvas: 'rgb(var(--color-canvas) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        border: 'rgb(var(--color-border) / <alpha-value>)',
        ink: {
          950: 'rgb(var(--color-ink-950) / <alpha-value>)',
          900: 'rgb(var(--color-ink-900) / <alpha-value>)',
          700: 'rgb(var(--color-ink-700) / <alpha-value>)',
          600: 'rgb(var(--color-ink-600) / <alpha-value>)',
          400: 'rgb(var(--color-ink-400) / <alpha-value>)',
          200: 'rgb(var(--color-ink-200) / <alpha-value>)',
        },
        moss: {
          100: 'rgb(var(--color-moss-100) / <alpha-value>)',
          300: 'rgb(var(--color-moss-300) / <alpha-value>)',
          500: 'rgb(var(--color-moss-500) / <alpha-value>)',
          600: 'rgb(var(--color-moss-600) / <alpha-value>)',
          700: 'rgb(var(--color-moss-700) / <alpha-value>)',
        },
        ember: {
          100: 'rgb(var(--color-ember-100) / <alpha-value>)',
          400: 'rgb(var(--color-ember-400) / <alpha-value>)',
          500: 'rgb(var(--color-ember-500) / <alpha-value>)',
          600: 'rgb(var(--color-ember-600) / <alpha-value>)',
        },
        indigo: {
          100: 'rgb(var(--color-indigo-100) / <alpha-value>)',
          400: 'rgb(var(--color-indigo-400) / <alpha-value>)',
          500: 'rgb(var(--color-indigo-500) / <alpha-value>)',
          600: 'rgb(var(--color-indigo-600) / <alpha-value>)',
        },
        amber: {
          100: 'rgb(var(--color-amber-100) / <alpha-value>)',
          400: 'rgb(var(--color-amber-400) / <alpha-value>)',
          500: 'rgb(var(--color-amber-500) / <alpha-value>)',
          600: 'rgb(var(--color-amber-600) / <alpha-value>)',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        sm: '8px',
        DEFAULT: '10px',
        lg: '16px',
        xl: '20px',
      },
      boxShadow: {
        xs: '0 1px 2px rgba(20,22,26,0.04)',
        card: '0 1px 2px rgba(20,22,26,0.04), 0 1px 1px rgba(20,22,26,0.03)',
        raised: '0 8px 24px rgba(20,22,26,0.08), 0 2px 6px rgba(20,22,26,0.04)',
        floating: '0 16px 40px rgba(20,22,26,0.16), 0 4px 12px rgba(20,22,26,0.08)',
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
      },
      keyframes: {
        'ring-fill': {
          from: { strokeDashoffset: 'var(--ring-from)' },
          to: { strokeDashoffset: 'var(--ring-to)' },
        },
        'fade-up': {
          from: { opacity: 0, transform: 'translateY(8px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.4s ease-out both',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
