/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: { brand: "#f5b700", ink: "#17202a", cream: "#fffaf0" },
      fontFamily: {
        sans: ["Roboto", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: { soft: "0 18px 45px rgba(23, 32, 42, .10)" },
    },
  },
  plugins: [],
};
