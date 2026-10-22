import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Backend (Express) runs on PORT from Backend/.env
const BACKEND = 'http://localhost:5555'

export default defineConfig({
  base: "/",
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      // API calls (axios baseURL is "/api")
      '/api': { target: BACKEND, changeOrigin: true },
      // Uploaded files are served statically by Express at /uploads
      '/uploads': { target: BACKEND, changeOrigin: true },
    },
  },
})
