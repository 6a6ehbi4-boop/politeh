import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Для GitHub Pages: базовый путь = имя репозитория
const base = process.env.BASE_PATH ?? '/politeh/'

export default defineConfig({
  base,
  plugins: [react()],
})
