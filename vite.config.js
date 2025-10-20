import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mkcert from 'vite-plugin-mkcert'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Only use HTTPS if explicitly enabled via environment variable
    process.env.USE_HTTPS === 'true' ? mkcert() : null
  ].filter(Boolean),
  server: {
    host: '0.0.0.0',
    port: 5173,
    // Use HTTP by default for local development and LAN access
    // Set USE_HTTPS=true to enable HTTPS with mkcert
    https: process.env.USE_HTTPS === 'true',
  },
})
