import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ["JetBrains Mono", "IBM Plex Mono", "Menlo", "monospace"],
        sans: ["Inter", "Geist", "system-ui", "sans-serif"],
      },
      colors: {
        background: "#FAFAFA",
        foreground: "#111111",
        accent: "#0051FF",
        pill: {
          bg: "#F0F0F0",
          border: "#E5E5E5",
        },
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        fallBounce: {
          "0%": { transform: "translateY(0px)" },
          "40%": { transform: "translateY(4px)" },
          "70%": { transform: "translateY(2px)" },
          "100%": { transform: "translateY(4px)" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "15%": { transform: "translateX(-3px) skewX(-2deg)" },
          "30%": { transform: "translateX(3px) skewX(2deg)" },
          "45%": { transform: "translateX(-2px)" },
          "60%": { transform: "translateX(2px)" },
          "75%": { transform: "translateX(-1px)" },
        },
        flash: {
          "0%, 100%": { filter: "invert(0)" },
          "50%": { filter: "invert(1)" },
        },
      },
      animation: {
        blink: "blink 1s step-end infinite",
        fallBounce: "fallBounce 300ms cubic-bezier(0.22,1,0.36,1) forwards",
        shake: "shake 400ms cubic-bezier(0.22,1,0.36,1)",
        flash: "flash 200ms step-end 2",
      },
    },
  },
  plugins: [],
};
export default config;
