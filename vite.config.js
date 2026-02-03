import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

let mkcert
try {
  mkcert = (await import('vite-plugin-mkcert')).default
} catch {
  mkcert = null
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    process.env.USE_HTTPS === 'true' && mkcert ? mkcert() : null
  ].filter(Boolean),
  server: {
    host: '0.0.0.0',
    port: 5173,
    // Use HTTP by default for local development and LAN access
    // Set USE_HTTPS=true to enable HTTPS with mkcert
    https: process.env.USE_HTTPS === 'true',
  },
})
