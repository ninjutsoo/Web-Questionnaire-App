import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

let mkcert
try {
  mkcert = (await import('vite-plugin-mkcert')).default
} catch {
  mkcert = null
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  /** Forward /api/* to hosted Firebase (or .env) so local dev does not require port 5001. */
  const apiProxyTarget =
    env.VITE_API_BASE_URL || 'https://web-app-new-efb66.web.app'

  return {
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
      proxy: {
        '/api': {
          target: apiProxyTarget,
          changeOrigin: true,
          secure: true,
        },
      },
    },
  }
})
