/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        forest: { 950: "#16251f", 900: "#1d3029", 800: "#27413a", 700: "#2f4d43", 600: "#3b5d51" },
        neon: { DEFAULT: "#ff5a1f", soft: "#ff8a4c", deep: "#e0420d" },
        cream: "#f2ede4",
        mist: "#a8bdb2",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      boxShadow: { glow: "0 0 60px rgba(255,90,31,.45)", card: "0 40px 80px -30px rgba(0,0,0,.55)" },
    },
  },
  plugins: [],
};
