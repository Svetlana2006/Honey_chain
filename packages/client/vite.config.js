import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
  ],
  server: {
    port: 5173,
    // Proxy all /api calls to the Express backend
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/photos': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
