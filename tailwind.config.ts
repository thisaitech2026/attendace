import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "#6366f1",
          dark: "#4f46e5",
          light: "#818cf8",
          glow: "#a5b4fc",
        },
        accent: {
          DEFAULT: "#22d3ee",
          pink: "#f472b6",
          violet: "#a78bfa",
        },
        surface: {
          DEFAULT: "var(--surface)",
          elevated: "var(--surface-elevated)",
          glass: "var(--surface-glass)",
        },
        border: {
          DEFAULT: "var(--border)",
          glow: "var(--border-glow)",
        },
        muted: "var(--muted)",
      },
      borderRadius: {
        card: "20px",
        button: "14px",
        pill: "999px",
      },
      fontSize: {
        body: ["15px", { lineHeight: "1.6" }],
        caption: ["12px", { lineHeight: "1.5", letterSpacing: "0.02em" }],
        title: ["22px", { lineHeight: "1.25", fontWeight: "700" }],
        display: ["28px", { lineHeight: "1.2", fontWeight: "800" }],
      },
      boxShadow: {
        card: "0 4px 24px -4px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.04)",
        glow: "0 0 40px -8px rgba(99,102,241,0.5)",
        fab: "0 8px 32px -4px rgba(99,102,241,0.6), 0 0 0 1px rgba(255,255,255,0.1)",
        nav: "0 -8px 32px -8px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.06)",
      },
      backgroundImage: {
        "gradient-premium": "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #22d3ee 100%)",
        "gradient-mesh": "radial-gradient(at 40% 20%, rgba(99,102,241,0.35) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(34,211,238,0.2) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(167,139,250,0.25) 0px, transparent 50%)",
        "gradient-card": "linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(34,211,238,0.06) 100%)",
        "gradient-stat-blue": "linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(99,102,241,0.05) 100%)",
        "gradient-stat-green": "linear-gradient(135deg, rgba(52,211,153,0.2) 0%, rgba(52,211,153,0.05) 100%)",
        "gradient-stat-red": "linear-gradient(135deg, rgba(248,113,113,0.2) 0%, rgba(248,113,113,0.05) 100%)",
        "gradient-stat-amber": "linear-gradient(135deg, rgba(251,191,36,0.2) 0%, rgba(251,191,36,0.05) 100%)",
        "gradient-stat-purple": "linear-gradient(135deg, rgba(167,139,250,0.2) 0%, rgba(167,139,250,0.05) 100%)",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
        shimmer: "shimmer 1.5s infinite",
      },
      keyframes: {
        fadeIn: { from: { opacity: "0" }, to: { opacity: "1" } },
        slideUp: { from: { opacity: "0", transform: "translateY(12px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        pulseGlow: { "0%, 100%": { opacity: "0.6" }, "50%": { opacity: "1" } },
        shimmer: { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
      },
    },
  },
  plugins: [],
};
export default config;
