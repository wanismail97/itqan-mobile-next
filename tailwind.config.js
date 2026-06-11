/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0a1929",
        accent: "#d4a853",
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        nunito: ["var(--font-nunito)", "Inter", "sans-serif"],
      },
      animation: {
        "pulse-wa": "pulse-wa 2s infinite",
        "modal-in": "modal-in 200ms ease-out",
        "scroll": "scroll 40s linear infinite",
      },
      keyframes: {
        "pulse-wa": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.1)" },
        },
        "modal-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "scroll": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};
