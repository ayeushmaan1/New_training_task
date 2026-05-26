export default {
  darkMode: 'class',
  content: ['./index.html', './client/src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          50: '#f7f8fb',
          100: '#edf0f7',
          200: '#d9e0ef',
          500: '#66728a',
          600: '#4b5870',
          700: '#2f3b52',
          900: '#111827'
        },
        coral: '#e86f51',
        mint: '#20a58a',
        gold: '#d49b2a'
      },
      boxShadow: {
        soft: '0 18px 60px rgba(17, 24, 39, 0.12)'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
};
