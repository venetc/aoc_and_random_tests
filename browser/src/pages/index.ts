import type { RouteRecordRaw } from 'vue-router'

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Main Page',
    components: {
      default: () => import(/* webpackChunkName: "MainPage" */'./main'),
    },
  },
  {
    path: '/trie',
    name: 'Trie Page',
    components: {
      default: () => import(/* webpackChunkName: "TriePage" */'./trie'),
    },
  },
]

export { default as AppRouting } from './AppRouting.vue'
