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
          DEFAULT: "#1565C0",
          dark: "#0D47A1",
          light: "#42A5F5",
          container: "#E3F2FD",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          dim: "#F5F7FA",
          container: "#FFFFFF",
        },
        outline: "#E2E8F0",
      },
      borderRadius: {
        card: "16px",
        button: "12px",
      },
      fontSize: {
        body: ["15px", { lineHeight: "1.5" }],
        caption: ["13px", { lineHeight: "1.4" }],
        title: ["20px", { lineHeight: "1.3", fontWeight: "600" }],
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)",
        fab: "0 4px 12px rgba(21,101,192,0.4)",
      },
    },
  },
  plugins: [],
};
export default config;
