import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command, mode }) => {
  // Load env file based on mode
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    build: {
      outDir: 'dist',
      sourcemap: mode === 'development',
      minify: 'terser',
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            ui: ['@fortawesome/fontawesome-free', 'bootstrap', 'bootstrap-icons'],
          }
        }
      }
    },
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:8000',
          changeOrigin: true,
          secure: mode === 'production',
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
        '/socket.io': {
          target: env.VITE_SOCKET_URL || 'http://localhost:8001',
          changeOrigin: true,
          secure: mode === 'production',
          ws: true,
        }
      }
    }
  }
})
