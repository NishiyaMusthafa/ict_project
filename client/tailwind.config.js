/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#070a12',
          900: '#0B0F19',
          850: '#111827',
          800: '#151D30',
          700: '#1E293B',
          600: '#334155',
        },
        violet: {
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
        },
        lavender: {
          light: '#F8F7FF',
          DEFAULT: '#EDE9FE',
          muted: '#E0DBFF'
        },
        warm: {
          white: '#FDFDFC',
          50: '#F8FAFC',
          100: '#F1F5F9'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(15, 23, 42, 0.05), 0 2px 6px -1px rgba(15, 23, 42, 0.03)',
        'card': '0 10px 30px -4px rgba(15, 23, 42, 0.06), 0 4px 10px -2px rgba(15, 23, 42, 0.04)',
        'elevated': '0 20px 40px -8px rgba(15, 23, 42, 0.12), 0 8px 16px -4px rgba(15, 23, 42, 0.06)',
        'glow': '0 0 35px -5px rgba(124, 58, 237, 0.25)',
      }
    },
  },
  plugins: [],
}
