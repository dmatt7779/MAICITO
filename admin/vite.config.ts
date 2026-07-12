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
      // Proxy PHP API requests to the PHP container.
      // El DocumentRoot de Apache YA es la carpeta `api`, así que se elimina el
      // prefijo `/api` (igual que hace Nginx en prod con `proxy_pass .../`).
      // Ej: /api/v1/signIn.php -> /v1/signIn.php
      '/api': {
        target: 'http://ubi-php:80',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      // Proxy Python API requests to the Python container.
      // NO se reescribe: el router de FastAPI ya es dueño del prefijo `/ubi`.
      '/ubi': {
        target: 'http://ubi-python:8000',
        changeOrigin: true,
      },
    },
  },
})