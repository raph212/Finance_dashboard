/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Candy Rainbow for Kids 🎨🍭
        candy: {
          pink: '#ff69b4',    // Hot pink
          yellow: '#ffd700',  // Gold yellow  
          orange: '#ff8c00',  // Bright orange
          green: '#00ff7f',   // Spring green
          purple: '#da70d6',  // Orchid purple
          blue: '#00bfff',    // Deep sky blue
          red: '#ff1493',     // Deep pink/red
        },
        primary: '#ff69b4',  // Candy pink (main)
        secondary: '#ffd700', // Sunshine yellow
        success: '#00ff7f',  // Mint green
        warning: '#ff8c00',  // Candy orange
        danger: '#ff1493',   // Bubblegum red
      },
      backdropBlur: { xs: '20px' },
      boxShadow: {
        'glow-candy': '0 0 30px rgba(255,105,180,0.6)',
        'glow-yellow': '0 0 30px rgba(255,215,0,0.6)',
      },
    },
  },
  plugins: [],
}

