import keepPreset from "keep-react/preset";
import defaultTheme from 'tailwindcss/defaultTheme'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/keep-react/**/*.{js,jsx,ts,tsx}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      backgroundImage: {
        backgroundAuthentication: "url('./src/assets/planeta.jpg')",
        backgroundAplication: "url('./src/assets/fondo3.svg')"
      }
    },
    fontFamily: {
      'sans': ['"Quicksand"', ...defaultTheme.fontFamily.sans],
    },
  },
  plugins: [],
  presets: [keepPreset],
}


