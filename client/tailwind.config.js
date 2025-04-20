import lineClamp from "@tailwindcss/line-clamp";

export default {
  darkMode: "class", // Enables class-based dark mode
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        changeColor: "changeColor 20s linear infinite",
      },
      keyframes: {
        changeColor: {
          "0%, 100%": { backgroundColor: "black" }, 
          "50%": { backgroundColor: "white" },
        },
      },
    },
  },
  plugins: [lineClamp], // Correct ES module syntax
};
