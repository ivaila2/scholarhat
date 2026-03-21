/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./src/**/*.{astro,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['"General Sans"', 'sans-serif'],
        display: ['"Clash Display"', 'sans-serif'],
      },
    },
  },
}
