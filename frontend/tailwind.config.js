import withMT from "@material-tailwind/react/utils/withMT";
/** @type {import('tailwindcss').Config} */
export default withMT({
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  mode: 'jit',
  theme: {
    extend: {
      screens: {
        'xs': '150px'
      },
      boxShadow: {
        'custom-navbar-shadow-down': '0 20px 0 0 white',
        'custom-navbar-shadow-up': '0 -20px 0 0 white'
      },
      borderRadius: {
        'nav-capsule-radius-down': '0 0 25px 0',
        'nav-capsule-radius-up': '0 25px 0 0'
      }
    }

  },
  plugins: [],
})

