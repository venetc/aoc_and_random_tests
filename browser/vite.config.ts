// @ts-ignore config later
import { handlers } from './src/shared/mocks/handlers'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import msw from '@iodigital/vite-plugin-msw'

import { resolve } from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    msw({ mode: 'browser', handlers }),
  ],
  base: '/aoc_and_random_tests/',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
})
