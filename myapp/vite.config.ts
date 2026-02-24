
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Proxy: /api i /live (WebSocket) → backend na 8080
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // REST
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      // WebSocket
      '/live': {
        target: 'ws://localhost:8080',
        ws: true,
        changeOrigin: true,
      },
    },
  },
})
