/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,tsx,jsx}"],
  theme: {
    extend: {
      boxShadow: {
        '3xl': '1px 1px 11.1px 5px #F3343924',
        '4xl': '0px -1px 5.1px 6px #F3343969',
        '5xl': '0px -9px 93px 21px #F3343940',
        'logo': '0px 0px 7.1px 19px #F3343929',
        'red-bg': '0px -41px 37px -1px #FFB50021',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out',
        slideUp: 'slideUp 0.5s ease-out',
      },
    },
  },
  plugins: [],
}

