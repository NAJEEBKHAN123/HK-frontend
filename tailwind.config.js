/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        xl1170: "1170px",
        xl1000: "xl1000",
        md550 : '550px',
        naje: "850px", // Add this new breakpoint
        sm650: "sm650",
        sm: "640px", // 👈 custom screen size
        md: "768px",
        lg: "1024px",
        xl: "1280px",
      },
    },
  },
  plugins: [],
};
