/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          pink: '#ff69b4',
          pinkHover: '#ff4da6',
          purple: '#667eea',
          purpleDark: '#5466c3',
          green: '#25d366',
          greenHover: '#1ebd57',
          grayBg: '#f8f9fa',
          darkText: '#333333',
          starGold: '#FFD700'
        }
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif']
      },
      boxShadow: {
        card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        cardHover: '0 10px 25px -5px rgba(255, 105, 180, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
      }
    },
  },
  plugins: [],
}
