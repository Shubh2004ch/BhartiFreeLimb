/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Scans all files in src with JS/TS extensions
    "./public/index.html"         // Optional: scan HTML if needed
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
