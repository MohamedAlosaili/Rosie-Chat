/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");
const defaultTheme = require("tailwindcss/defaultTheme");
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      transitionDuration: {
        DEFAULT: "250ms",
      },
      colors: {
        primary: colors.slate,
        accent: {
          600: "#4338ca",
          DEFAULT: "#4f46e5",
          400: "#6366f1",
        },
        info: {
          600: "#0369a1",
          DEFAULT: "#0284c7",
          400: "#0ea5e9",
        },
      },
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};
