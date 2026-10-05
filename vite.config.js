import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // ✅ Ensures React Router works properly in dev mode
    historyApiFallback: true,
  },
  build: {
    // ✅ Optional: ensures compatibility with static hosts like Netlify or Vercel
    outDir: 'dist',
  },
})
