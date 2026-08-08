/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#09090b',
        surface: {
          DEFAULT: '#111114',
          subtle: '#16161a',
          hover: '#1c1c22',
          border: '#23232a',
          'border-light': '#2f2f38',
        },
        accent: {
          green: '#22c55e',
          'green-glow': 'rgba(34, 197, 94, 0.15)',
          red: '#ef4444',
          cyan: '#06b6d4',
          mono: '#e2e8f0',
          muted: '#80808a',
          faded: '#4e4e56',
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Space Mono"', 'Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.04em',
        widest: '0.15em',
        mega: '0.25em',
      },
      animation: {
        'pulse-subtle': 'pulseSubtle 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-slow': 'floatSlow 8s ease-in-out infinite',
      },
      keyframes: {
        pulseSubtle: {
          '0%, 100%': { opacity: '0.9' },
          '50%': { opacity: '0.4' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
