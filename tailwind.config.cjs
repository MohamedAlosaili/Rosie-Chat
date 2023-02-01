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
        loading: {
          light: "#0f172a",
          dark: "#f1f5f9",
        },
        success: {
          600: "#14532d",
          DEFAULT: "#166534",
          400: "#15803d",
        },
        error: {
          600: "#7f1d1d",
          DEFAULT: "#991b1b",
          400: "#b91c1c",
        },
        info: {
          600: "#0369a1",
          DEFAULT: "#0284c7",
          400: "#0ea5e9",
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
