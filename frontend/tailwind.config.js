/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          950: "#07090B",
          900: "#0B0F12",
          850: "#0F1418",
          800: "#141A1F",
          700: "#1C242B",
          600: "#26313A",
        },
        emerald: {
          glow: "#00FF87",
          DEFAULT: "#00E67A",
          dim: "#00B863",
        },
        cyan: {
          glow: "#3DF2FF",
          DEFAULT: "#22D3EE",
        },
        risk: {
          excellent: "#00FF87",
          good: "#3DF2FF",
          moderate: "#F5D547",
          watch: "#FF9F43",
          risk: "#FF4D6D",
        },
      },
      fontFamily: {
        display: ["var(--font-space)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      boxShadow: {
        "glow-emerald": "0 0 40px -8px rgba(0, 255, 135, 0.45)",
        "glow-cyan": "0 0 40px -8px rgba(61, 242, 255, 0.4)",
        "inner-glass": "inset 0 1px 0 0 rgba(255,255,255,0.06)",
      },
      backgroundImage: {
        "grid-glow":
          "radial-gradient(circle at 20% 20%, rgba(0,255,135,0.12), transparent 40%), radial-gradient(circle at 80% 0%, rgba(61,242,255,0.10), transparent 45%), radial-gradient(circle at 50% 100%, rgba(0,255,135,0.08), transparent 50%)",
        "card-sheen":
          "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 60%)",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.55 },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "pulse-glow": "pulse-glow 2.4s ease-in-out infinite",
        float: "float 5s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite",
      },
      borderRadius: {
        "3xl": "1.75rem",
      },
    },
  },
  plugins: [],
};
