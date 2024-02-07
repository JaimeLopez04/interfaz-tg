import keepPreset from "keep-react/preset";

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
        backgroundAuthentication: "url('./src/assets/planeta.jpg')"
      }
    }
  },
  plugins: [],
  presets: [keepPreset],
}


