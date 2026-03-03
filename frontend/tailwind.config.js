/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        sidebar: {
          bg: "#1e2139",
          hover: "#252a48",
          border: "#2d3158",
          text: "#9ca3af",
        },
        brand: {
          purple: "#7c3aed",
          "purple-light": "#a78bfa",
          "purple-bg": "#ede9fe",
        },
        page: "#f4f5f7",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)",
        "card-hover": "0 4px 12px rgba(0,0,0,0.12)",
      },
    },
  },
  plugins: [],
}
