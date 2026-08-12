import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Los assets estáticos fuente (favicon, _redirects) viven en "static/" en vez
  // de "public/": "public/" es la carpeta que Render publica tal cual en el
  // despliegue y contiene el resultado del build (ver README > Despliegue).
  publicDir: 'static',
})
