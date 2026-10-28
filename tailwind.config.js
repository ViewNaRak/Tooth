/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FFFFFF',
          100: '#FDFBF7',
          200: '#F7F4EC',
          300: '#EFECE2',
        },
        earth: {
          dark: '#2E2A27',
          charcoal: '#3F3934',
          muted: '#716760',
          sand: '#D4C9BC',
          warm: '#9E8F83',
        },
        pastel: {
          peach: '#F9ABA2',
          peachDark: '#E07267',
          mint: '#6EE7B7',
          mintDark: '#10B981',
          sky: '#7DD3FC',
          skyDark: '#0284C7',
          honey: '#FDE047',
          amber: '#F59E0B',
          pink: '#F472B6',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '3xl': '1.75rem',
        '4xl': '2.25rem',
      }
    },
  },
  plugins: [],
}
