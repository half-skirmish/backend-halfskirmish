/** @type {import('tailwindcss').Config} */
export default {
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
        'pastel-cyan': '#A7F3D0', // Added pastel cyan color
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'], // Updated to use Montserrat font
      },
    },
  },
  plugins: [],
};
