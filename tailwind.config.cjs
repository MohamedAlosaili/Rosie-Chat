/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");
const defaultTheme = require("tailwindcss/defaultTheme");
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: colors.slate,
        accent: {
          600: "#4338ca",
          DEFAULT: "#4f46e5",
          400: "#6366f1",
        },
        accent: {
          600: "#4338ca",
          DEFAULT: "#4f46e5",
          400: "#6366f1",
        },
        loading: {
          light: "#0f172a",
          dark: "#f1f5f9",
        },
        success: {
          600: "#0284c7",
          DEFAULT: "#0ea5e9",
          400: "#38bdf8",
        },
        error: {
          600: "#9d174d",
          DEFAULT: "#be185d",
          400: "#db2777",
          300: "#ec4899",
        },
      },
      borderRadius: {
        50: "50%",
      },
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};
