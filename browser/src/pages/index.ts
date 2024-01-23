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
  {
    path: '/favorites',
    name: 'Optimistic UI Page',
    components: {
      default: () => import(/* webpackChunkName: "FavoritesPage" */'./favorites'),
    },
  },
]

export { default as AppRouting } from './AppRouting.vue'
