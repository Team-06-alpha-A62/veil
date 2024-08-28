/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  plugins: [require('daisyui')],

  daisyui: {
    themes: [
      {
        mytheme: {
          primary: '#FE764C', // Vibrant accent color for buttons and highlights
          'primary-focus': '#FF5C35', // Slightly darker for focus state
          'primary-content': '#ffffff', // Text on primary color

          secondary: '#4A3A54', // Dark secondary color for sidebars and backgrounds
          'secondary-focus': '#32283A', // Darker focus state
          'secondary-content': '#E0D7F9', // Light text on secondary

          accent: '#FFAD60', // Accent color for smaller highlights or buttons
          'accent-focus': '#FF9C4A', // Darker accent color on hover/focus
          'accent-content': '#1b1c22', // Text on accent

          neutral: '#22212C', // Background for containers
          'neutral-focus': '#1B1C22', // Focus state for neutral background
          'neutral-content': '#D5CCFF', // Text on neutral background

          'base-100': '#131237', // Main dark background
          'base-200': '#1D1B32', // Slightly lighter for contrast
          'base-300': '#26253D', // Lighter still, for cards and components
          'base-content': '#E4D8F8', // Text color on dark backgrounds

          success: '#009485', // Success color

          info: '#1C92F2', // Info color (for badges, etc.)
          warning: '#FF9900', // Warning color
          error: '#FF5724', // Error color

          // Custom rounded and animation settings
          'rounded-box': '1.2rem', // Slightly rounded for containers
          'rounded-btn': '0.6rem', // Rounded buttons
          'rounded-badge': '1.6rem', // Rounded badges

          'animation-btn': '.3s', // Smooth animations for buttons
          'animation-input': '.25s', // Animation for input focus

          'btn-text-case': 'capitalize', // Capitalize button text for a more modern look
          'navbar-padding': '0.75rem', // Comfortable padding for navbars
          'border-btn': '1px', // Button border width
        },
      },
      'light',
      'dark',
      'cupcake',
      'retro',
    ],
    darkTheme: 'mytheme',
    base: true,
    styled: true,
    utils: true,
    prefix: '',
    logs: true,
    themeRoot: ':root',
  },

  theme: {
    extend: {
      borderRadius: {
        box: '1rem', // rounded-box
        btn: '.5rem', // rounded-btn
        badge: '1.9rem', // rounded-badge
      },
      animation: {
        btn: '.25s', // animation-btn
        input: '.2s', // animation-input
      },
      padding: {
        navbar: '.5rem', // navbar-padding
      },
      borderWidth: {
        btn: '1px', // border-btn
      },
      backgroundImage: {
        'theme-gradient':
          'linear-gradient(135deg, #2D1A45 0%, #3A234F 35%, #522958 70%, #623264 85%, #92405D 100%)',
        'custom-gradient':
          'radial-gradient(circle at 30% 40%, rgba(255, 255, 255, 0.1) 0%, rgba(26, 25, 41, 0) 60%), radial-gradient(circle at 70% 70%, rgba(255, 255, 255, 0.1) 0%, rgba(26, 25, 41, 0) 60%), linear-gradient(135deg, #1B1B34 0%, #292942 35%, #3A2D46 100%)',
      },
        backgroundColor: {
          'default': 'linear-gradient(135deg, #1B1B34 0%, #292942 35%, #2E2035 70%, #3A2D46 100%)',
        },
      textTransform: {
        btn: 'uppercase', // btn-text-case
      },
    },
  },
};
