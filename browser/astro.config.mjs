import { defineConfig } from 'astro/config'
import vue from '@astrojs/vue'
import tailwind from '@astrojs/tailwind'

// https://astro.build/config
export default defineConfig({
  site: 'https://venetc.github.io',
  base: '/aoc_and_random_tests/',
  integrations: [
    vue(),
    tailwind({ applyBaseStyles: false }),
  ],
})
