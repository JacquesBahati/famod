import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  theme: {
    extend: {
      colors:{
        oui: ' #070066',
        nom: '#8378FA',
        bac: '#0D0718',
        Front:'#9333EA',
        conteneur: '#1E1434',
        survol:'16A34A'

      }
    },
  },
})