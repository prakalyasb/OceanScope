import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true
  },
  define: {
    CESIUM_BASE_URL: JSON.stringify('/cesium/')
  },
  resolve: {
    alias: {
      cesium: path.resolve(__dirname, 'node_modules/cesium/Build/Cesium/index.js')
    }
  },
  optimizeDeps: {
    include: ['cesium']
  }
})

