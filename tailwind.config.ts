import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-body)", "ui-sans-serif", "system-ui"],
        display: ["var(--font-heading)", "var(--font-body)", "ui-sans-serif", "system-ui"]
      },
      colors: {
        ink: {
          50: "#f3f7fa",
          100: "#e4edf3",
          200: "#ccdbe6",
          300: "#a6bfd1",
          400: "#769bb6",
          500: "#567b9a",
          600: "#42627d",
          700: "#344d64",
          800: "#253848",
          900: "#152535",
          950: "#09131d"
        }
      },
      boxShadow: {
        soft: "0 12px 30px rgba(9, 19, 29, 0.10)",
        lift: "0 24px 70px rgba(9, 19, 29, 0.16)",
        halo: "0 0 0 6px rgba(137, 212, 47, 0.15)"
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "pulse-soft": {
          "0%": { transform: "scale(1)", opacity: "0.95" },
          "50%": { transform: "scale(1.02)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "0.95" }
        }
      },
      animation: {
        "fade-up": "fade-up 650ms cubic-bezier(0.2, 0.65, 0.3, 1) both",
        "pulse-soft": "pulse-soft 3s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

export default config;
