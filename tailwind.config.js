/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        carbon: {
          950: '#06100c',
          900: '#08140f',
          850: '#0c1b14',
          800: '#10241b',
          700: '#183327',
          600: '#204434',
          500: '#2d5e49',
        },
        moss: {
          50: '#eefbf3',
          100: '#d3f4e1',
          200: '#a3e8c2',
          300: '#6dd89e',
          400: '#3fc47e',
          500: '#22a866',
          600: '#168752',
          700: '#136b43',
          800: '#125538',
          900: '#0f4530',
        },
        lichen: {
          400: '#c9e567',
          500: '#aed43b',
        },
        bark: {
          100: '#e2ded7',
          200: '#cfc6b8',
          300: '#a89d8c',
          400: '#7d7464',
        },
        signal: {
          good: '#22a866',
          warn: '#d99e2b',
          bad: '#d94f3d',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
        body: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'canopy-glow': 'radial-gradient(circle at 50% 0%, rgba(34, 168, 102, 0.12), transparent 55%)',
      },
      boxShadow: {
        glass: '0 4px 20px 0 rgba(0, 0, 0, 0.35)',
        'glow-moss': '0 0 24px -4px rgba(34, 168, 102, 0.25)',
      },
      animation: {
        rise: 'rise 0.4s cubic-bezier(0.16, 1, 0.3, 1) both',
        'pulse-ring': 'pulse-ring 2.4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        rise: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.95)', opacity: '0.7' },
          '70%': { transform: 'scale(1.25)', opacity: '0' },
          '100%': { transform: 'scale(0.95)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
