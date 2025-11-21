import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../store/auth.js';

const routes = [
  {
    path: '/setup',
    name: 'setup',
    component: () => import('../pages/SetupPage.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../pages/LoginPage.vue')
  },
  {
    path: '/',
    component: () => import('../layouts/DashboardLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import('../pages/DashboardPage.vue')
      },
      {
        path: 'connections',
        name: 'connections',
        component: () => import('../pages/ConnectionsPage.vue')
      },
      {
        path: 'databases/:connectionId',
        name: 'databases',
        component: () => import('../pages/DatabasesPage.vue'),
        props: true
      },
      {
        path: 'tables/:connectionId/:dbName',
        name: 'tables',
        component: () => import('../pages/TablesPage.vue'),
        props: true
      },
      {
        path: 'users',
        name: 'users',
        component: () => import('../pages/UsersPage.vue'),
        meta: { requiresMaster: true }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(async (to) => {
  const auth = useAuthStore();
  if (!auth.isInitialized) {
    await auth.checkMasterStatus();
  }
  if (auth.token && !auth.user) {
    await auth.fetchProfile();
  }

  if (to.name === 'setup' && auth.masterExists) {
    return { name: 'login' };
  }

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'login' };
  }

  if (to.meta.requiresMaster && auth.user?.role !== 'master') {
    return { name: 'dashboard' };
  }

  if (to.name === 'login' && auth.isAuthenticated) {
    return { name: 'dashboard' };
  }

  if (!auth.masterExists && to.name !== 'setup') {
    return { name: 'setup' };
  }

  return true;
});

export default router;

