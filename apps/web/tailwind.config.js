/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        purple: {
          DEFAULT: '#7C3AED',
          dark: '#5B21B6',
          light: '#A78BFA',
        },
        blue: {
          DEFAULT: '#3B82F6',
          dark: '#1E40AF',
          light: '#60A5FA',
        },
        gold: {
          DEFAULT: '#F59E0B',
          dark: '#D97706',
          light: '#FBBF24',
        },
        // Premium Gold Colors - Story 7.7
        premium: {
          gold: {
            50: '#FFFBEB',
            100: '#FEF3C7',
            200: '#FDE68A',
            300: '#FCD34D',
            400: '#FBBF24',
            500: '#F59E0B',
            600: '#D97706',
            700: '#B45309',
            800: '#92400E',
            900: '#78350F',
          },
          bronze: {
            400: '#CD7F32',
            500: '#B87333',
            600: '#A0522D',
          },
        },
      },
      fontFamily: {
        // Anuphan - main font for everything
        sans: ['var(--font-anuphan)', 'Anuphan', 'sans-serif'],
        // Trirong - for card headings/titles
        serif: ['var(--font-trirong)', 'Trirong', 'serif'],
        // Specific class for card titles
        card: ['var(--font-trirong)', 'Trirong', 'serif'],
      },
      animation: {
        blob: 'blob 7s infinite',
        'premium-shimmer': 'premium-shimmer 3s infinite',
        'premium-glow': 'premium-glow 2s ease-in-out infinite',
        'premium-sparkle': 'premium-sparkle 2s ease-in-out infinite',
        'premium-float': 'premium-float 6s ease-in-out infinite',
      },
      keyframes: {
        blob: {
          '0%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
          '33%': {
            transform: 'translate(30px, -50px) scale(1.1)',
          },
          '66%': {
            transform: 'translate(-20px, 20px) scale(0.9)',
          },
          '100%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
        },
        'premium-shimmer': {
          '0%': {
            transform: 'translateX(-100%)',
          },
          '100%': {
            transform: 'translateX(100%)',
          },
        },
        'premium-glow': {
          '0%, 100%': {
            boxShadow: '0 0 15px rgba(251, 191, 36, 0.2)',
          },
          '50%': {
            boxShadow: '0 0 30px rgba(251, 191, 36, 0.4)',
          },
        },
        'premium-sparkle': {
          '0%, 100%': {
            opacity: 0.5,
            transform: 'scale(0.8)',
          },
          '50%': {
            opacity: 1,
            transform: 'scale(1.2)',
          },
        },
        'premium-float': {
          '0%, 100%': {
            transform: 'translateY(0)',
          },
          '50%': {
            transform: 'translateY(-10px)',
          },
        },
      },
      backgroundImage: {
        'premium-gradient': 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 50%, #F59E0B 100%)',
        'premium-gradient-radial': 'radial-gradient(circle, rgba(251,191,36,0.3) 0%, transparent 70%)',
        'premium-border': 'linear-gradient(90deg, #F59E0B, #FCD34D, #F59E0B)',
      },
    },
  },
  plugins: [],
};
