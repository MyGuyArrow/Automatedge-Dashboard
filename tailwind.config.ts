import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#070807',
        panel: '#111311',
        line: '#262a25',
        foreground: '#f5f3ec',
        muted: '#a7aa9d',
        accent: '#b8f26a',
        danger: '#ff6b6b',
        warning: '#f5c451',
      },
      fontFamily: {
        sans: ['Sora', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 18px 60px rgba(0,0,0,0.35)',
      },
    },
  },
  plugins: [],
};

export default config;
