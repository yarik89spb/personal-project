import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // server: {
  //   proxy: {
  //     '/api': {
  //       target: 'http://localhost:3000',
  //       changeOrigin: true,
  //       rewrite: (path) => path.replace(/^\/api/, '')
  //     },
  //     '/socket.io': {
  //       target: 'http://localhost:3000',
  //       ws: true,
  //       changeOrigin: true,
  //       rewrite: (path) => path.replace(/^\/socket.io/, '/socket.io')
  //     }
  //   }
  // }
});
