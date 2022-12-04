/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        50: "50%",
      },
      fontFamily: {
        sans: ["Poppins, sans-serif", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};
