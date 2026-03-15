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
        "saudi-green": "#1B6B3A",
        "saudi-green-dark": "#145429",
        "saudi-green-light": "#22873f",
        "warm-gold": "#C8962E",
        "warm-gold-light": "#E5B84A",
        "warm-gray": "#F8F6F2",
        "warm-gray-2": "#F0EDE8",
        "warm-gray-3": "#E5E1DA",
        platinum: "#E8F0FF",
        gold: "#FFF8E1",
        silver: "#F5F5F5",
        bronze: "#FFF3E0",
        redflag: "#FFF5F5",
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "Noto Sans Arabic", "sans-serif"],
        arabic: ["Noto Sans Arabic", "sans-serif"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      boxShadow: {
        "card": "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
        "card-hover": "0 4px 12px rgba(0,0,0,0.08), 0 16px 48px rgba(0,0,0,0.06)",
        "green-glow": "0 0 30px rgba(27,107,58,0.15)",
      },
    },
  },
  plugins: [],
};

export default config;
