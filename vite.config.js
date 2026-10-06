import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Libraries that only some screens need get their own chunks, so they stay out
// of the initial payload and are fetched with the route that uses them.
// Everything else that always loads with the shell shares one `vendor` chunk:
// splitting react away from @mui/@emotion produces a circular chunk graph
// (react-dom and emotion import each other's internals), which breaks the
// module init order at runtime.
const ON_DEMAND_VENDORS = [
  [/[\\/]node_modules[\\/](gsap|@gsap)[\\/]/, 'vendor-gsap'],
  [/[\\/]node_modules[\\/]@supabase[\\/]/, 'vendor-supabase'],
  [/[\\/]node_modules[\\/]html2canvas[\\/]/, 'vendor-html2canvas'],
]

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
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          const match = ON_DEMAND_VENDORS.find(([pattern]) => pattern.test(id))
          return match ? match[1] : 'vendor'
        },
      },
    },
  },
})
