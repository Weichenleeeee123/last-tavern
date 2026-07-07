/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'tavern-bg': '#1a120b',
        'tavern-bg2': '#2a1f15',
        'tavern-text': '#e8dcc4',
        'tavern-gold': '#c9a84c',
        'tavern-muted': '#9a8b6f',
        'tavern-candle': '#f4c842',
      },
      fontFamily: {
        'serif-cn': ['"Noto Serif SC"', 'serif'],
        'serif-en': ['"Cormorant Garamond"', 'serif'],
      },
      animation: {
        'candle-flicker': 'flicker 3s ease-in-out infinite',
        'fade-in': 'fadeIn 0.8s ease-out',
        'door-open': 'doorOpen 1.5s ease-in-out forwards',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '0.8' },
          '50%': { opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        doorOpen: {
          '0%': { transform: 'perspective(1000px) rotateY(0deg)' },
          '100%': { transform: 'perspective(1000px) rotateY(-85deg)' },
        },
      },
    },
  },
  plugins: [],
}
