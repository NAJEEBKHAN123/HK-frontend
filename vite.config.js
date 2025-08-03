import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    react(),
    visualizer()
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          vendor: ['axios', 'i18next'],
          charts: ['chart.js', 'react-chartjs-2'],
          pdf: ['jspdf', 'html2canvas']
        }
      }
    }
  },
  optimizeDeps: {
    exclude: ['js-big-decimal'] // Add any other problematic dependencies
  }
})