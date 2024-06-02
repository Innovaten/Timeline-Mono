/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neonGreen': {
          '50': '#ffffe4',
          '100': '#fdffc5',
          '200': '#f8ff92',
          '300': '#efff53',
          '400': '#e0fb20',
          '500': '#bbd900',
          '600': '#97b500',
          '700': '#728902',
          '800': '#5a6c08',
          '900': '#4b5b0c',
          '950': '#273300',
      },
      'blue': {
        '50': '#f1f9fe',
        '100': '#e2f1fc',
        '200': '#bfe4f8',
        '300': '#86cef3',
        '400': '#46b4ea',
        '500': '#1e9bd9',
        '600': '#107cb9',
        '700': '#0e6193',
        '800': '#10547c',
        '900': '#134667',
        '950': '#0d2d44',
    },
      }
    },
  },
  plugins: [],
}

