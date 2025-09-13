// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'move': 'move 10s ease-in-out infinite',
        'move-reverse': 'move-reverse 8s ease-in-out infinite',
      },
      keyframes: {
        move: {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
          '25%': { transform: 'translate(5px, 5px) rotate(5deg)' },
          '50%': { transform: 'translate(10px, -5px) rotate(-5deg)' },
          '75%': { transform: 'translate(-5px, 10px) rotate(3deg)' },
        },
        'move-reverse': {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
          '25%': { transform: 'translate(-5px, -5px) rotate(-5deg)' },
          '50%': { transform: 'translate(-10px, 5px) rotate(5deg)' },
          '75%': { transform: 'translate(5px, -10px) rotate(-3deg)' },
        }
      }
    }
  }
}