import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
          950: "#082f49",
        },
        // Abyss — Ultra-dark blue-black base palette
        abyss: {
          950: "#020408",
          900: "#040810",
          800: "#060b14",
          700: "#080f1c",
          600: "#0b1628",
          500: "#0d1e36",
          400: "#102440",
        },
        // Neon — Electric blue accent palette
        neon: {
          blue: "#0ea5e9",
          "blue-bright": "#38bdf8",
          "blue-dim": "#0284c7",
          indigo: "#6366f1",
          purple: "#8b5cf6",
          glow: "rgba(14,165,233,0.35)",
        },
        // Aurora — Soft glowing color tokens
        aurora: {
          cyan: "#22d3ee",
          sky: "#7dd3fc",
          violet: "#a78bfa",
          emerald: "#34d399",
          rose: "#fb7185",
          amber: "#fbbf24",
        },
        // Razorbill Plumage & Nordic Arctic Tokens (preserved)
        razor: {
          dark: "#060b14",
          obsidian: "#0b1628",
          slate: "#1e293b",
          light: "#f8fafc",
          snow: "#ffffff",
          ice: "#f1f5f9",
          border: "#1e293b",
        },
        oceanic: {
          50: "#f0fdfa",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0d9488",
          700: "#0f766e",
          800: "#115e59",
          900: "#134e4a",
        },
        beak: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        "3xl": "1.5rem",
        "2xl": "1rem",
        xl: "0.75rem",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        subtle: "0 1px 3px 0 rgb(0 0 0 / 0.3), 0 1px 2px -1px rgb(0 0 0 / 0.3)",
        razor: "0 4px 20px -2px rgba(0, 0, 0, 0.5)",
        // Glow shadows — blue
        glow: "0 0 20px rgba(14, 165, 233, 0.3), 0 0 60px rgba(14, 165, 233, 0.1)",
        "glow-sm": "0 0 8px rgba(14, 165, 233, 0.4), 0 0 20px rgba(14, 165, 233, 0.15)",
        "glow-lg": "0 0 30px rgba(14, 165, 233, 0.4), 0 0 80px rgba(14, 165, 233, 0.15), 0 0 160px rgba(14, 165, 233, 0.06)",
        // Card shadows — elevated dark
        "card-dark": "0 4px 24px rgba(0,0,0,0.5), 0 1px 4px rgba(0,0,0,0.4)",
        "card-hover": "0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(14,165,233,0.15), 0 0 20px rgba(14,165,233,0.08)",
      },
      backgroundImage: {
        // Mesh gradient backgrounds
        "mesh-dark": "linear-gradient(135deg, #060b14 0%, #0b1628 40%, #0c2040 60%, #060b14 100%)",
        "mesh-blue-banner": "radial-gradient(ellipse 70% 80% at 10% 50%, rgba(14,165,233,0.25) 0%, transparent 60%), radial-gradient(ellipse 60% 60% at 90% 20%, rgba(99,102,241,0.2) 0%, transparent 55%), linear-gradient(135deg, #060b14 0%, #0a1929 50%, #060b14 100%)",
        // Gradient borders
        "border-blue": "linear-gradient(135deg, rgba(14,165,233,0.5), rgba(99,102,241,0.3))",
        // Subtle surface gradient
        "surface-dark": "linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)",
      },
      fontWeight: {
        thin: '100',
        extralight: '200',
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '500',  // Bawaan Tailwind: 600 -> diubah ke 500
        bold: '500',      // Bawaan Tailwind: 700 -> diubah ke 500
        extrabold: '500', // Bawaan Tailwind: 800 -> diubah ke 500
        black: '500',
      },
      animation: {
        "orb-pulse": "orb-pulse 8s ease-in-out infinite",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
      },
      keyframes: {
        "orb-pulse": {
          "0%, 100%": { opacity: "0.7", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.1)" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 15px rgba(14,165,233,0.3)" },
          "50%": { boxShadow: "0 0 30px rgba(14,165,233,0.5), 0 0 60px rgba(14,165,233,0.2)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
