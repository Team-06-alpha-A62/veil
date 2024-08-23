/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  plugins: [require('daisyui')],

  daisyui: {
    themes: ['light', 'dark', 'cupcake', 'retro'],
    darkTheme: 'dark',
    base: true,
    styled: true,
    utils: true,
    prefix: '',
    logs: true,
    themeRoot: ':root',
  },
  theme: {
    extend: {
      backgroundImage: {
        'theme-gradient':
          'linear-gradient(135deg, #2D1A45 0%, #3A234F 35%, #522958 70%, #623264 85%, #92405D 100%)',
      },
    },
  },
};
