import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    // server
    {
      path: '/server/:pathMatch(.*)*',
      name: 'server',
      component: () => import('@/views/SeverView.vue'),
    },
    // tools
    {
      path: '/tools/:pathMatch(.*)*',
      name: 'tools',
      component: () => import('@/views/SeverView.vue'),
    },
  ]
})

export default router
