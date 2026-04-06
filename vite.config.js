import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://163.227.92.122:4032',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})

// https://github.com/vaibhav-dhoran/versal-deploy.git
// git init
// git branch -M main
// git remote add origin https://github.com/vaibhav-dhoran/versal-deploy.git
