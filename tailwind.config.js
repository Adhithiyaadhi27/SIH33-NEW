/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        soil: {
          base: '#081F16',       // Deepest forest green background
          deep: '#0B2B1E',       // Dark emerald
          forest: '#0F3A26',     // Forest green panel base
          leaf: '#1B5E3E',       // Mid leaf green
          emerald: '#2E8B57',    // Emerald accent
          mint: '#7CCFA2',       // Light mint
          pale: '#C8E6D2',       // Very pale green text
          gold: '#F6BD60',       // Warm golden yellow highlight
          goldSoft: '#FAD48A',   // Soft gold
          cream: '#F5EEDC',      // Warm cream text
          glass: 'rgba(255,255,255,0.10)',
        },
        text: {
          primary: '#EAF6EE',
          secondary: '#B8D4C4',
          muted: '#8FB3A0',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Poppins', 'Plus Jakarta Sans', 'sans-serif'],
      },
      borderRadius: {
        'glass': '18px',
        'glass-lg': '24px',
        'glass-xl': '28px',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.35)',
        'glass-lg': '0 16px 48px rgba(0, 0, 0, 0.45)',
        'glow-gold': '0 0 30px -6px rgba(246, 189, 96, 0.5)',
        'glow-emerald': '0 0 30px -6px rgba(46, 139, 87, 0.5)',
      },
      backdropBlur: {
        'glass': '18px',
        'glass-sm': '10px',
      },
      animation: {
        'scan-line': 'scanLine 2.4s ease-in-out infinite',
        'route-flow': 'routeFlow 3s linear infinite',
        'pulse-glow': 'pulseGlow 2.5s ease-in-out infinite',
        'float-soft': 'floatSoft 6s ease-in-out infinite',
        'gradient-shift': 'gradientShift 8s ease infinite',
        'leaf-sway': 'leafSway 4s ease-in-out infinite',
      },
      keyframes: {
        leafSway: {
          '0%, 100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' },
        },
        scanLine: {
          '0%': { top: '4%', opacity: '0.6' },
          '50%': { top: '94%', opacity: '1' },
          '100%': { top: '4%', opacity: '0.6' },
        },
        routeFlow: {
          '0%': { strokeDashoffset: '1000' },
          '100%': { strokeDashoffset: '0' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px -6px rgba(246,189,96,0.4)' },
          '50%': { boxShadow: '0 0 32px -4px rgba(246,189,96,0.7)' },
        },
        floatSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      }
    },
  },
  plugins: [],
}
