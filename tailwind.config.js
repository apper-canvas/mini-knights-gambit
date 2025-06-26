/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2C3E50',
        secondary: '#ECF0F1',
        accent: '#E74C3C',
        surface: '#34495E',
        background: '#1A252F',
        success: '#27AE60',
        warning: '#F39C12',
        error: '#C0392B',
        info: '#3498DB'
      },
      fontFamily: {
        'display': ['Bebas Neue', 'Arial Black', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif']
      },
      animation: {
        'check-pulse': 'check-pulse 2s infinite',
        'piece-shake': 'piece-shake 0.3s ease-in-out',
        'capture-flash': 'capture-flash 0.4s ease-out'
      },
      keyframes: {
        'check-pulse': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(231, 76, 60, 0.7)' },
          '50%': { boxShadow: '0 0 0 8px rgba(231, 76, 60, 0)' }
        },
        'piece-shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-4px)' },
          '75%': { transform: 'translateX(4px)' }
        },
        'capture-flash': {
          '0%': { backgroundColor: 'rgba(231, 76, 60, 0.5)' },
          '100%': { backgroundColor: 'transparent' }
        }
      }
    },
  },
  plugins: [],
}