import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Utiliser './' permet au site de fonctionner peu importe le nom du dossier sur GitHub
  base: './',
})