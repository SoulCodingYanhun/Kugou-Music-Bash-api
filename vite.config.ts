import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: "./",
  server: {
    host: "0.0.0.0",
    port: 8080,
    proxy: {
      "/kugou": {
        target: "http://mobilecdn.kugou.com/api/v3/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/kugou/, '')//这里的/需要转义
      }
    }
  }
})
