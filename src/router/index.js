import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { title: 'Dashboard', icon: 'mdi-view-dashboard' }
  },
  {
    path: '/customers',
    name: 'Customers',
    component: () => import('@/views/CustomersView.vue'),
    meta: { title: 'Clientes', icon: 'mdi-account-group' }
  },
  {
    path: '/pipeline',
    name: 'Pipeline',
    component: () => import('@/views/PipelineView.vue'),
    meta: { title: 'Pipeline', icon: 'mdi-pipe' }
  },
  {
    path: '/reports',
    name: 'Reports',
    component: () => import('@/views/ReportsView.vue'),
    meta: { title: 'Relatórios', icon: 'mdi-chart-bar' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router