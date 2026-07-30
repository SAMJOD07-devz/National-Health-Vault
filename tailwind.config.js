/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nhv: {
          dark: '#050B14',
          blue: '#1E3A8A',
          lightBlue: '#E0F2FE',
          accent: '#38BDF8',
          white: '#FFFFFF',
          green: '#10B981',
          red: '#EF4444',
          gray: '#9CA3AF',
          lightGray: '#F3F4F6'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
      animation: {
        'blob': 'blob 10s infinite alternate',
      },
      keyframes: {
        blob: {
          '0%': { transform: 'scale(1) translate(0px, 0px)' },
          '33%': { transform: 'scale(1.1) translate(30px, -50px)' },
          '66%': { transform: 'scale(0.9) translate(-20px, 20px)' },
          '100%': { transform: 'scale(1) translate(0px, 0px)' },
        }
      }
    },
  },
  plugins: [],
}
