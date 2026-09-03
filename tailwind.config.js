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
        abyss: {
          950: '#020609',
          900: '#040b10',
          850: '#071219',
          800: '#0a1a24',
          700: '#0f2634',
          600: '#17394c',
          500: '#1f4d66',
        },
        biopunk: {
          green: '#00ff87',
          emerald: '#10b981',
          lime: '#a3e635',
          cyan: '#00f0ff',
          toxic: '#ccff00',
          amber: '#f59e0b',
          crimson: '#ff3366',
          violet: '#8b5cf6',
        }
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      animation: {
        'bio-pulse': 'bioPulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-flow': 'glowFlow 8s ease infinite',
      },
      keyframes: {
        bioPulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
        glowFlow: {
          '0%, 100%': { filter: 'drop-shadow(0 0 15px rgba(0, 255, 135, 0.4))' },
          '50%': { filter: 'drop-shadow(0 0 25px rgba(0, 240, 255, 0.6))' },
        }
      }
    },
  },
  plugins: [],
}
