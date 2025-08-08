/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  safelist: [
    'bg-red-50', 'bg-red-100', 'text-red-800', 'border-red-300', 'border-red-400',
    'bg-yellow-50', 'bg-yellow-100', 'text-yellow-800', 'border-yellow-300', 'border-yellow-400',
    'bg-green-50', 'bg-green-100', 'text-green-800', 'border-green-300', 'border-green-400',
    'bg-blue-50', 'bg-blue-100', 'text-blue-800', 'border-blue-300', 'border-blue-400',
    'bg-orange-50', 'border-orange-300'
  ]
}
