import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Allow configuring the API proxy target via an environment variable.
// Defaults to localhost (useful when running frontend locally against backend on port 3000).
const proxyTarget = process.env.PROXY_TARGET || process.env.API_PROXY_TARGET || 'http://localhost:3000'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,
    },
    proxy: {
      '/api': {
        target: proxyTarget,
        changeOrigin: true,
        // Remove the `/api` prefix when proxying to the backend so backend routes
        // defined at `/images/...` match correctly (no `/api` prefix).
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})

