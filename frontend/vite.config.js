import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), // standard Babel transform — no React compiler
  ],
  server: {
    port: 5173,
    proxy: {
      // All /api/* calls are proxied to the Express backend
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
