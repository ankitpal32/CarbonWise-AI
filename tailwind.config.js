/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        carbon: {
          950: '#06100c',
<<<<<<< HEAD
          900: '#08140f',
          850: '#0c1b14',
          800: '#10241b',
          700: '#183327',
          600: '#204434',
          500: '#2d5e49',
=======
          900: '#0a1712',
          850: '#0d1f18',
          800: '#11281f',
          700: '#1a3a2c',
          600: '#244f3c',
          500: '#33694f',
>>>>>>> 44e51c889406c7d32cea2fe385fee8568117e882
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
<<<<<<< HEAD
          100: '#e2ded7',
=======
>>>>>>> 44e51c889406c7d32cea2fe385fee8568117e882
          200: '#cfc6b8',
          300: '#a89d8c',
          400: '#7d7464',
        },
        signal: {
<<<<<<< HEAD
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
        'rise': 'rise 0.4s cubic-bezier(0.16, 1, 0.3, 1) both',
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
=======
          good: '#3fc47e',
          warn: '#e3b341',
          bad: '#e2604f',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'grain': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")",
        'canopy-glow': 'radial-gradient(circle at 50% 0%, rgba(63, 196, 126, 0.18), transparent 60%)',
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
        'glow-moss': '0 0 40px -8px rgba(63, 196, 126, 0.45)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      animation: {
        'rise': 'rise 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
        'sway': 'sway 6s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 2.4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'leaf-fall': 'leaf-fall 8s linear infinite',
      },
      keyframes: {
        rise: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        sway: {
          '0%, 100%': { transform: 'rotate(-1.5deg)' },
          '50%': { transform: 'rotate(1.5deg)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.95)', opacity: '0.7' },
          '70%': { transform: 'scale(1.3)', opacity: '0' },
          '100%': { transform: 'scale(0.95)', opacity: '0' },
        },
        'leaf-fall': {
          '0%': { transform: 'translateY(-10%) rotate(0deg)', opacity: '0' },
          '10%': { opacity: '0.6' },
          '100%': { transform: 'translateY(110%) rotate(180deg)', opacity: '0' },
        },
>>>>>>> 44e51c889406c7d32cea2fe385fee8568117e882
      },
    },
  },
  plugins: [],
}
