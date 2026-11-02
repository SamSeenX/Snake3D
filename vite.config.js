import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    host: true,
    port: 5174
  },
  esbuild: {
    target: 'es2022',
    drop: ['console', 'debugger']
  },
  build: {
    target: 'es2022'
  }
})
