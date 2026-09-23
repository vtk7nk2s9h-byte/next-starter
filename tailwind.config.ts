import type { Config } from 'tailwindcss';

const config: Config = {
  // The toggle puts a .dark class on <html>; without this, dark: utilities
  // would follow the OS setting instead and ignore the switch.
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        '13': 'repeat(13, minmax(0, 1fr))',
      },
      keyframes: {
        'm-pulse': {
          '0%, 100%': {
            transform: 'scale(1)',
            textShadow: '0 0 0 rgba(255, 77, 90, 0)',
          },
          '50%': {
            transform: 'scale(1.22)',
            textShadow: '0 0 18px rgba(255, 77, 90, 0.6)',
          },
        },
      },
      animation: {
        'm-pulse': 'm-pulse 2.4s ease-in-out infinite',
      },
      colors: {
        // shadcn/ui semantic tokens, backed by the CSS variables in global.css.
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // The system red: the wordmark letters and every header hover state.
        'brand-red': '#c9394a',
        // Brand accent. 500 is the primary; 400 lightens for hover, 600 for
        // pressed/active. Matches the --accent of the navigation menu.
        maroon: {
          50: '#fbf4f5',
          100: '#f6e6e9',
          200: '#ecccd3',
          300: '#cf8e9c',
          400: '#9c2739',
          500: '#7b1e2c',
          600: '#5e1622',
          700: '#4a1119',
          800: '#350c12',
          900: '#20070b',
        },
        // Near-black surfaces. 900 matches the --bar of the navigation menu.
        ink: {
          50: '#f6f5f6',
          100: '#e9e7e9',
          200: '#d0cbcd',
          300: '#a9a2a5',
          400: '#736b6f',
          500: '#4c4548',
          600: '#332e31',
          700: '#232023',
          800: '#1a171a',
          900: '#121013',
        },
        // Dark-first neutrals, warmed toward the brand hue. The ramp is
        // inverted relative to Tailwind's: low numbers are near-black surfaces,
        // high numbers are near-white text. That flips every existing
        // bg-gray-50 panel dark and its text-gray-900 copy light at once,
        // without touching the call sites. The middle of the ramp is lifted
        // rather than mirrored, so text-gray-400/500 stay readable on black.
        gray: {
          // Elevation ladder. The page ground is #0a0809, so 50 sits above it
          // rather than matching it — panels have to read as raised surfaces,
          // not holes. Each step warms slightly, as a surface closer to the
          // key light would.
          50: '#121013', //  panel on page
          100: '#1c1719', //  card on panel
          200: '#2b2529', //  border / divider
          300: '#4a4145', //  dim + disabled text
          400: '#7d7376', //  tertiary text
          500: '#a09699', //  muted body text
          600: '#bdb4b7', //  secondary text
          700: '#d6cfd1',
          800: '#eae5e6',
          900: '#f7f4f5', //  primary text
          950: '#fcfbfb',
        },
      },
    },
    keyframes: {
      shimmer: {
        '100%': {
          transform: 'translateX(100%)',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('tailwindcss-animate')],
};
export default config;
