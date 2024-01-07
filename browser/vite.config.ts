import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import { resolve } from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '/aoc_and_random_tests/',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
})
