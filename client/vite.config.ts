import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: 'localhost',
    port: 5173,
    cors: {
      origin: 'http://127.0.0.1:8000',
      credentials: true,
    },
  },
})
