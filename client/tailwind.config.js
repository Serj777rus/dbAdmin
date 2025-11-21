/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,ts}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#0EA5E9',
          dark: '#0284C7'
        }
      }
    }
  },
  plugins: []
};

