/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#1a56db',
        mpesa: '#00a651',
      }
    },
  },
  plugins: [],
}

