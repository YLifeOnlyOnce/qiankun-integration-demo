import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import qiankun from 'vite-plugin-qiankun'

import { name as appName } from './package.json';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    qiankun(appName, {
      useDevMode: true
    })
  ],
  server: {
    origin: 'http://localhost:5173', // 解决静态资源加载404问题
    host: 'localhost',
    port: 5174
  }
})
