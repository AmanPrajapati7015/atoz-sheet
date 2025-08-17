import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  
  server: {
    proxy: {
      '/api': {
        target: 'http://atoz-sheet-env.eba-4sn9xnkt.ap-south-1.elasticbeanstalk.com/',
        changeOrigin: true,   // 👈 makes the host header = target
        rewrite: (path) => path.replace(/^\/api/, ''), 
      },
    },
  },
})
