/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  presets: [require("nativewind/preset")],

  theme: {
    extend: {
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
        34: "8.5rem",
      },
      colors: {
        primary: "#03BD49",
        dark: {
          100: "#171a1c",
          200: "#141618",
          300: "#000",
        },
        light: {
          100: "#F8FAFC",
          200: "#F3F6FE",
          300: "#EDF2F8",
        },
      },
      fontFamily: {
        poppins_bold: ["Poppins_Bold", "sans-serif"],
        poppins_semibold: ["Poppins_SemiBold", "sans-serif"],
        poppins_regular: ["Poppins_Regular", "sans-serif"],
      },
    },
  },
  plugins: [],
};
