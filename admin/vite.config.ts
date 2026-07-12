import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  base: '',
  plugins: [react()],
  server: {
    host: true, // Expose to Docker network (0.0.0.0)
    port: 5173,
    proxy: {
      // Proxy PHP API requests to the PHP container
      '/api': {
        target: 'http://ubi-php:80',
        changeOrigin: true,
      },
      // Proxy Python API requests to the Python container
      '/ubi': {
        target: 'http://ubi-python:8000',
        changeOrigin: true,
      },
    },
  },
})