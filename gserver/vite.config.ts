import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import { mars3dPlugin } from 'vite-plugin-mars3d'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import qiankun from 'vite-plugin-qiankun'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    vue(),
    vueJsx(),
    qiankun(
      'gserver', // 微应用名字，与主应用注册的微应用名字保持一致
      {
        useDevMode: true // 如果是在主应用中加载子应用vite,必须打开这个,否则vite加载不成功, 单独运行没影响
      }
    ),
    mars3dPlugin()
  ],
  server: {
    host: '0.0.0.0',
    port: 9001,
    proxy: {
      // '/prod-api': {
      //   target: 'http://10.0.32.33/',
      //   changeOrigin: true
      // }
      '/prod-api': {
        target: 'http://localhost:8000/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/prod-api/, '')
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
