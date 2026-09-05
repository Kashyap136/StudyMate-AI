import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Forward AI requests to the StudyMate backend during development.
      '/api': 'http://localhost:3001',
    },
  },
})
