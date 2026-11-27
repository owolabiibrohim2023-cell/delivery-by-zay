/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0A1A3A', // deep navy
        coal: '#102552', // navy-2 (raised navy surfaces)
        paper: '#FFFFFF',
        mist: '#F7F3EA', // cream
        ghost: '#E4E9F2', // decorative background typography
        brand: '#C9A24B', // classy gold
        'brand-light': '#E3C77A',
        'brand-deep': '#A88434',
        cream: '#F7F3EA',
      },
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(10,26,58,.06), 0 12px 32px -16px rgba(10,26,58,.18)',
        lift: '0 24px 48px -24px rgba(10,26,58,.35)',
      },
      maxWidth: {
        shell: '1400px',
      },
    },
  },
  plugins: [],
};
