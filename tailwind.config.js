/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background: '#EEF2F0',
        surface: '#F7F5F2',
        'text-primary': '#1C2420',
        'text-secondary': '#5A6B64',
      },
    },
  },
  plugins: [],
};
