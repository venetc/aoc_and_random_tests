import { createRouter, createWebHistory } from 'vue-router'

import type { RouteRecordRaw, Router } from 'vue-router'

import { routes } from '@/pages'

export const router: Router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes as RouteRecordRaw[],
})
