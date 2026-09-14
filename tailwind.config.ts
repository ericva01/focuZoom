import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Google Sans"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
      },
      colors: {
        background: "#090D16",
        foreground: "#F8FAFC",
        canvas: {
          DEFAULT: "#090D16",
          alt: "#0D121F",
          card: "#121826",
        },
        glass: {
          subtle: "rgba(255, 255, 255, 0.03)",
          surface: "rgba(255, 255, 255, 0.05)",
          elevated: "rgba(255, 255, 255, 0.08)",
          highlight: "rgba(255, 255, 255, 0.12)",
          sunken: "rgba(0, 0, 0, 0.28)",
          border: {
            subtle: "rgba(255, 255, 255, 0.07)",
            medium: "rgba(255, 255, 255, 0.13)",
            strong: "rgba(255, 255, 255, 0.22)",
            accent: "rgba(251, 113, 133, 0.35)",
          },
        },
        dark: {
          950: "#06070a",
          900: "#0b0d14",
          850: "#101320",
          800: "#161b2c",
          750: "#1c2238",
          700: "#242c48",
          600: "#333d61",
        },
        glideo: {
          coral: "#fb7185",
          salmon: "#fda4af",
          blue: "#3b82f6",
          indigo: "#6366f1",
          purple: "#8b5cf6",
          pink: "#ec4899",
          emerald: "#10b981",
          amber: "#f59e0b",
        },
      },
      boxShadow: {
        "glass-sm": "0 2px 8px 0 rgba(0, 0, 0, 0.25)",
        "glass-md": "0 8px 32px 0 rgba(0, 0, 0, 0.36)",
        "glass-lg": "0 16px 48px 0 rgba(0, 0, 0, 0.45)",
        "glass-inner": "inset 0 1px 1px 0 rgba(255, 255, 255, 0.14)",
        "glass-glow-accent": "0 0 35px -5px rgba(251, 113, 133, 0.25)",
        "glow-cyan": "0 0 35px -5px rgba(251, 113, 133, 0.35)",
        "glow-card": "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        "inner-glass": "inset 0 1px 1px 0 rgba(255, 255, 255, 0.12)",
      },
      backdropBlur: {
        "glass-sm": "8px",
        "glass-md": "16px",
        "glass-lg": "24px",
        "glass-xl": "32px",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
