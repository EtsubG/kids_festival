/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        sunflower: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#F4C430',
          500: '#E8B04B',
          600: '#D49A2E',
          700: '#B07A22',
          800: '#8A5F1E',
          900: '#6B4917',
        },
        terracotta: {
          50: '#FBF3F0',
          100: '#F8E2DA',
          200: '#EFC6B6',
          300: '#E3A288',
          400: '#D67E5D',
          500: '#C25E3A',
          600: '#A84A2C',
          700: '#863A23',
          800: '#652D1E',
          900: '#4D2419',
        },
        ethiogreen: {
          50: '#F0F9F1',
          100: '#DCF0DF',
          200: '#BCE0C2',
          300: '#8FCB98',
          400: '#5DAE68',
          500: '#3C9148',
          600: '#2D7739',
          700: '#25602F',
          800: '#1F4C28',
          900: '#193D22',
        },
        cream: {
          50: '#FFFEFB',
          100: '#FFF9F0',
          200: '#FDF1E0',
          300: '#F8E6CC',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Noto Sans Ethiopic', 'system-ui', 'sans-serif'],
        ethiopic: ['Noto Sans Ethiopic', 'Plus Jakarta Sans', 'sans-serif'],
      },
      keyframes: {
        floatUp: {
          '0%': { transform: 'translateY(0) translateX(0) rotate(0deg)', opacity: '0' },
          '10%': { opacity: '0.9' },
          '90%': { opacity: '0.9' },
          '100%': { transform: 'translateY(-110vh) translateX(40px) rotate(360deg)', opacity: '0' },
        },
        drift: {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
          '25%': { transform: 'translate(20px, -30px) rotate(8deg)' },
          '50%': { transform: 'translate(-15px, -55px) rotate(-6deg)' },
          '75%': { transform: 'translate(25px, -25px) rotate(10deg)' },
        },
        confettiFall: {
          '0%': { transform: 'translateY(-10vh) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(110vh) rotate(720deg)', opacity: '0' },
        },
        popIn: {
          '0%': { transform: 'scale(0.6)', opacity: '0' },
          '60%': { transform: 'scale(1.08)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(232,176,75,0.5)' },
          '50%': { boxShadow: '0 0 0 18px rgba(232,176,75,0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
      },
      animation: {
        'float-up': 'floatUp linear infinite',
        drift: 'drift ease-in-out infinite',
        'confetti-fall': 'confettiFall ease-in forwards',
        'pop-in': 'popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'slide-up': 'slideUp 0.4s ease-out forwards',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
        wiggle: 'wiggle 0.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
