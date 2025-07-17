import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
   base: './',
  server: {
   host: true,

    // Allow traffic from your LocalTunnel domain(s):
    // You can add specific domains like 'fancy-dog.loca.lt'
    // or use `true` to allow all (less secure but fine for dev)
    allowedHosts: true,
  proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
