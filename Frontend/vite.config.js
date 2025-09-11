import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:5000', // proxy API calls
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
