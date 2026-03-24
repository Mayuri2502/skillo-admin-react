import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})

// https://github.com/vaibhav-dhoran/versal-deploy.git
// git init
// git branch -M main
// git remote add origin https://github.com/vaibhav-dhoran/versal-deploy.git
