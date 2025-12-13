/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FFF8F0", // soft cream
        accent: "#FFD1DC",     // warm light pink
        text: "#3E3E3E",       // charcoal
        button: "#FF6F61",     // coral red
      },
    },
  },
  plugins: [],
}
