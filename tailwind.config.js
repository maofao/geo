/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1677ff',
          dark: '#1668dc',
        },
        text: {
          DEFAULT: 'rgba(0, 0, 0, 0.85)',
          secondary: 'rgba(0, 0, 0, 0.45)',
          dark: 'rgba(255, 255, 255, 0.85)',
          'dark-secondary': 'rgba(255, 255, 255, 0.45)',
        },
        background: {
          light: '#f0f2f5',
          dark: '#141414',
          card: {
            light: '#ffffff',
            dark: '#1f1f1f',
          },
        },
        border: {
          light: '#d9d9d9',
          dark: '#303030',
        },
      },
      boxShadow: {
        card: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)',
        hover: '0 4px 12px -2px rgba(0, 0, 0, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.06)',
      },
      fontSize: {
        'weather-temp': '2.5rem',
      },
      spacing: {
        'weather-icon': '64px',
      },
    },
  },
  plugins: [],
}