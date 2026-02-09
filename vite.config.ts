import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Для GitHub Pages: базовый путь = имя репозитория (например /умный-дом/)
const base = process.env.BASE_PATH || '/'

export default defineConfig({
  base,
  plugins: [react()],
})
