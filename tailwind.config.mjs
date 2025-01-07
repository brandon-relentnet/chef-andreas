/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        deepRed: '#8B0000',
        cream: '#FAF3E0',
        forestGreen: '#228B22',
        goldenYellow: '#DAA520',
        navyBlue: '#000080',
        softBrown: '#A0522D',
        lightGreen: '#98FB98',
      },
    },
  },
  plugins: [],
};
