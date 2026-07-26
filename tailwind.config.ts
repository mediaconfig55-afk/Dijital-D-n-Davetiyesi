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
          50: "#FAF6EB",
          100: "#F5ECD7",
          200: "#EBD9AF",
          300: "#E0C687",
          400: "#D6B35F",
          500: "#D4AF37", // Primary Metallic Gold
          600: "#AA8C2C",
          700: "#7F6921",
          800: "#554616",
          900: "#2A230B",
        },
        champagne: {
          light: "#FAF3E0",
          DEFAULT: "#F7E7CE",
          dark: "#E3CFA8",
        },
        onyx: {
          900: "#0A0A0A",
          800: "#121212",
          700: "#1A1A1A",
          600: "#262626",
        },
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        script: ["var(--font-great-vibes)", "cursive"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #FFF7D6 0%, #D4AF37 50%, #AA8C2C 100%)",
        "gold-glow": "radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, rgba(10, 10, 10, 0) 70%)",
        "glass-gradient": "linear-gradient(135deg, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0.02) 100%)",
      },
      animation: {
        "float-slow": "float 6s ease-in-out infinite",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
        "shimmer": "shimmer 2.5s linear infinite",
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
      },
      boxShadow: {
        "gold-soft": "0 10px 30px -5px rgba(212, 175, 55, 0.15)",
        "gold-glow": "0 0 25px rgba(212, 175, 55, 0.25)",
        "glass": "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
      },
    },
  },
  plugins: [],
};

export default config;
