import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        gold: {
          50: "#FBF6ED",
          100: "#F5EBDA",
          200: "#E8D5B0",
          300: "#D4C4A0",
          400: "#C9A96E",
          500: "#B8984E", // Primary warm gold
          600: "#8B6F47",
          700: "#6B5539",
          800: "#4A3B27",
          900: "#2A2116",
          950: "#1A150E",
        },
        rose: {
          100: "#F5E0E0",
          200: "#EBBCBC",
          300: "#D4A0A0",
          400: "#C08080",
          500: "#A06060",
        },
        sage: {
          100: "#E8F0E9",
          200: "#C5D9C8",
          300: "#9DBE9F",
          400: "#7A9E7E",
          500: "#5A7E5E",
        },
        cream: {
          50: "#FFFDF8",
          100: "#FFF9F0",
          200: "#F5F0E8",
          300: "#EBE4D8",
          400: "#D9CFC0",
        },
        warm: {
          50: "#F8F4F0",
          100: "#EDE6DE",
          200: "#D9CFC0",
          300: "#B8A898",
          400: "#8B7B6B",
          500: "#6B5B4E",
          600: "#4A3B2E",
          700: "#3D2B1F",
          800: "#2A1D14",
          900: "#1A120C",
        },
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        script: ["var(--font-great-vibes)", "cursive"],
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-playfair)", "Georgia", "serif"],
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #C9A96E 0%, #8B6F47 100%)",
        "gold-glow": "radial-gradient(circle, rgba(201, 169, 110, 0.1) 0%, transparent 70%)",
        "rose-glow": "radial-gradient(circle, rgba(212, 160, 160, 0.1) 0%, transparent 70%)",
        "cream-gradient": "linear-gradient(180deg, #FFFDF8 0%, #F5F0E8 100%)",
      },
      animation: {
        "float-slow": "float 6s ease-in-out infinite",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
        "shimmer": "shimmer 2.5s linear infinite",
        "fade-in-up": "fadeInUp 0.8s ease-out forwards",
        "fade-in-scale": "fadeInScale 0.6s ease-out forwards",
        "float-petal": "floatPetal 8s linear infinite",
        "soft-pulse": "softPulse 3s ease-in-out infinite",
        "gentle-sway": "gentleSway 4s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.05)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInScale: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        floatPetal: {
          "0%": { transform: "translateY(-10%) rotate(0deg)", opacity: "0" },
          "10%": { opacity: "0.7" },
          "90%": { opacity: "0.5" },
          "100%": { transform: "translateY(110vh) rotate(360deg)", opacity: "0" },
        },
        softPulse: {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.02)" },
        },
        gentleSway: {
          "0%, 100%": { transform: "rotate(-2deg)" },
          "50%": { transform: "rotate(2deg)" },
        },
      },
      boxShadow: {
        "gold-soft": "0 4px 20px -4px rgba(201, 169, 110, 0.15)",
        "gold-glow": "0 4px 20px rgba(201, 169, 110, 0.2)",
        "card": "0 4px 24px rgba(61, 43, 31, 0.06), 0 1px 3px rgba(61, 43, 31, 0.04)",
        "card-hover": "0 8px 32px rgba(61, 43, 31, 0.1), 0 2px 8px rgba(201, 169, 110, 0.08)",
        "soft": "0 2px 12px rgba(61, 43, 31, 0.05)",
      },
    },
  },
  plugins: [],
};

export default config;
