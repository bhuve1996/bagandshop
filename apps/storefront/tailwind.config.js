/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-dm-sans)', 'DM Sans', 'system-ui', 'sans-serif'],
        heading: ['var(--font-dm-sans)', 'DM Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        accent: 'rgb(var(--color-accent) / <alpha-value>)',
      },
      maxWidth: {
        container: 'var(--container-max)',
      },
      boxShadow: {
        soft: 'var(--shadow)',
        'soft-md': 'var(--shadow-md)',
        'soft-lg': 'var(--shadow-lg)',
      },
    },
  },
  plugins: [],
};
