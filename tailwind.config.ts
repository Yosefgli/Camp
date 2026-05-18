import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './context/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          500: '#c0392b',
          600: '#b91c1c',
          700: '#991b1b',
          800: '#7f1d1d',
        },
        accent: {
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
        },
        camp: {
          bg: '#fff5f5',
          card: '#ffffff',
          border: '#fecaca',
        },
      },
      fontFamily: {
        hebrew: ['"Noto Sans Hebrew"', 'Arial', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

export default config
