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
  build: {
    // Las dependencias grandes (React, React Router, TanStack Query, Supabase)
    // no se empaquetan: se cargan en el navegador desde un CDN de ESM (esm.sh)
    // vía import map (ver index.html). Así el bundle propio queda repartido
    // en varios archivos pequeños, uno por página (import() dinámico).
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react-dom/client',
        'react/jsx-runtime',
        'react/jsx-dev-runtime',
        'react-router-dom',
        '@tanstack/react-query',
        '@supabase/supabase-js',
      ],
    },
    chunkSizeWarningLimit: 300,
  },
})
