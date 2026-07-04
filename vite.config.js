import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// Vite config: React plugin for JSX/Fast Refresh, Tailwind v4's native Vite plugin
// (no separate postcss.config needed), and a "@" alias so imports read as
// "@/components/Card" instead of "../../../components/Card".
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
