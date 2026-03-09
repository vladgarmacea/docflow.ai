/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        mono:    ['JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['Syne', 'sans-serif'],
      },
      colors: {
        navy: {
          50:  '#e8edf5',
          100: '#c5d0e3',
          900: '#0a1628',
          950: '#060e1e',
        },
        teal: {
          DEFAULT: '#0d9488',
          light:   '#14b8a6',
        },
      },
    },
  },
  plugins: [],
}
