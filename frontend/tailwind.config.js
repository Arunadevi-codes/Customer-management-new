// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        peach: {
          100: '#FFDAB9',  // mild peach color
          200: '#FFC8A2',
          300: '#FFB68B',
        },
      },
    },
  },
  plugins: [],
}