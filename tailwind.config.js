/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        jabee: {
          orange: '#FF6B1A',
          orangeDark: '#E0550B',
          orangeLight: '#FFF2EB',
          black: '#111111',
          darkBg: '#0B0D12',
          warmGrey: '#CFCBC6',
          studioBg: '#F6F5F2',
          officeBg: '#EAE6DF',
        }
      },
      fontFamily: {
        sans: ['Poppins', 'Montserrat', 'sans-serif'],
        display: ['Montserrat', 'Poppins', 'sans-serif'],
      },
      boxShadow: {
        'glow-orange': '0 0 35px -5px rgba(255, 107, 26, 0.4)',
        'soft': '0 20px 40px -15px rgba(0,0,0,0.06)',
        'card': '0 10px 30px -10px rgba(0,0,0,0.04)',
      }
    },
  },
  plugins: [],
};
