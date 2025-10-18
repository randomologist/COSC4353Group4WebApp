import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  server: {
    proxy: {
      '/api': 'http://localhost:5000'
    }
  },
  resolve: {
    alias:{
      '@server': path.resolve(__dirname,'../server')
    }
  }
})
