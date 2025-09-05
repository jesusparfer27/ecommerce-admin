/** @type {import('tailwindcss').Config} */
export default {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#5542F6',
        highlight: '#eae8fb',
        bgGray: '#fbfbfd',
    },
  },
},
  plugins: [],
};
