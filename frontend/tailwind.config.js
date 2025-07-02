/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'retro-pink': '#ff6b9d',
        'retro-purple': '#a855f7',
        'retro-blue': '#3b82f6',
        'retro-cyan': '#06b6d4',
        'retro-green': '#10b981',
        'retro-yellow': '#f59e0b',
        'retro-orange': '#f97316',
        'retro-red': '#ef4444',
        'dark-bg': '#0f0f23',
        'dark-card': '#1a1a2e',
        'dark-accent': '#16213e',
      },
      fontFamily: {
        'mono': ['JetBrains Mono', 'Fira Code', 'monospace'],
        'retro': ['Orbitron', 'monospace'],
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 3s infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #3b82f6, 0 0 10px #3b82f6, 0 0 15px #3b82f6' },
          '100%': { boxShadow: '0 0 10px #3b82f6, 0 0 20px #3b82f6, 0 0 30px #3b82f6' }
        }
      },
      backgroundImage: {
        'gradient-retro': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-cyber': 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
      }
    },
  },
  plugins: [],
}
