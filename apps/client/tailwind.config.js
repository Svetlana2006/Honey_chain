/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#7c5800',
          container: '#ffb800',
          fixed: '#ffdea8',
          'fixed-dim': '#ffba20',
        },
        'on-primary': {
          DEFAULT: '#ffffff',
          container: '#6b4c00',
        },
        secondary: {
          DEFAULT: '#2b6954',
          container: '#adedd3',
        },
        'on-secondary': {
          DEFAULT: '#ffffff',
          container: '#306d58',
        },
        tertiary: {
          DEFAULT: '#855300',
          container: '#ffb657',
        },
        'on-tertiary': {
          container: '#734800',
        },
        error: {
          DEFAULT: '#ba1a1a',
          container: '#ffdad6',
        },
        'on-error': {
          DEFAULT: '#ffffff',
          container: '#93000a',
        },
        background: '#f9f9f8',
        'on-background': '#1a1c1c',
        surface: {
          DEFAULT: '#f9f9f8',
          variant: '#e2e2e2',
          'container-lowest': '#ffffff',
          'container-low': '#f3f4f3',
          container: '#eeeeed',
          'container-high': '#e8e8e7',
        },
        'on-surface': {
          DEFAULT: '#1a1c1c',
          variant: '#514532',
        },
        'inverse-surface': '#2f3130',
        outline: {
          DEFAULT: '#837560',
          variant: '#d5c4ab',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
