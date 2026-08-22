import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: "#c9a15a",
        charcoal: "#0f0f10",
        cream: "#faf6ee",
      },
      fontFamily: {
        serif: ["Playfair Display", "serif"],
      },
      perspective: {
        "1500": "1500px",
      },
    },
  },
  plugins: [],
};
export default config;