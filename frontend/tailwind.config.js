/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"], // make sure it's scanning your components
  theme: {
    extend: {
      animation: {
        blink: "blink 1s infinite",
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.3" },
        },
      },
    },
  },
  plugins: [require('tailwind-scrollbar-hide')],
};
 