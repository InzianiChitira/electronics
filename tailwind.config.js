/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        primary: '#2563eb',
        dark: '#0f172a',
        mpesa: '#00a651',
      },
    },
  },
  plugins: [],
}

