/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nature: {
          bg: '#F4F8F1',       // App global background (soft leaf-cream)
          bgSoft: '#EEF5EA',   // Secondary soft background
          bgAlt: '#E4EFDD',    // Section alt background (pale sage)
          card: '#FBFCF8',     // Harvest card background
          primary: '#1B4332',  // Primary deep agricultural green
          hover: '#2D6A4F',    // Primary hover
          leaf: '#40916C',     // Fresh leaf green
          soft: '#95D5B2',     // Soft natural green
          pale: '#D8F3DC',     // Very pale leaf green
          earth: '#6B4226',    // Earth brown for labels/metadata
          cream: '#F5EEDC',    // Warm beige/cream
          orange: '#F4A259',   // Produce orange for bulk & CTAs
          tomato: '#E63946',   // Tomato red for alerts & high risk
          harvest: '#F6BD60',  // Harvest yellow for warnings & Grade B
          ai: '#5B5FEF',       // AI blue (AI modules only)
          aiPurple: '#7B61FF', // AI purple accent
          text: '#22333B',     // Neutral dark body text
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Poppins', 'Plus Jakarta Sans', 'sans-serif'],
      },
      borderRadius: {
        'basket': '22px',
        'basket-lg': '28px',
      },
      boxShadow: {
        'nature': '0 10px 30px -4px rgba(45, 106, 79, 0.12), 0 4px 10px -2px rgba(45, 106, 79, 0.06)',
        'nature-lg': '0 16px 40px -6px rgba(45, 106, 79, 0.18), 0 6px 16px -3px rgba(45, 106, 79, 0.08)',
        'nature-sm': '0 4px 16px -2px rgba(45, 106, 79, 0.08)',
        'ai-glow': '0 0 30px -5px rgba(91, 95, 239, 0.35)',
      },
      animation: {
        'leaf-sway': 'sway 4s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan-laser': 'laserScan 2.2s ease-in-out infinite',
      },
      keyframes: {
        sway: {
          '0%, 100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.02)' },
        },
        laserScan: {
          '0%': { top: '5%', opacity: '0.8' },
          '50%': { top: '92%', opacity: '1' },
          '100%': { top: '5%', opacity: '0.8' },
        }
      }
    },
  },
  plugins: [],
}
