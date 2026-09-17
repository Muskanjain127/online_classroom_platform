/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        ink: "#0E0B1A",
        panel: "#160F29",
        panel2: "#1D1538",
        panel3: "#241A44",
        brand: {
          DEFAULT: "#7C5CFF",
          soft: "#5A4AC4",
        },
        gold: "#C8A45E",
        parchment: "#F3EFE6",
        mist: "#B3A8CC",
        mistdim: "#8B7FAC",
      },
      fontFamily: {
        serif: ["Fraunces", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
