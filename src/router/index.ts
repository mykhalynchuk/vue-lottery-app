import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      meta: { title: 'Головна', layout: 'DefaultLayout' },
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: { title: 'Про автора', layout: 'DefaultLayout' },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { title: 'Авторизація', layout: 'AuthLayout' },
    },
    {
      path: '/users',
      name: 'users',
      component: () => import('../views/users/UsersView.vue'),
      meta: { title: 'Користувачі', layout: 'DefaultLayout', requiresAuth: true },
    },
    {
      path: '/users/:id',
      name: 'user-detail',
      component: () => import('../views/users/UserDetailView.vue'),
      props: true,
      meta: { title: 'Профіль користувача', layout: 'DefaultLayout', requiresAuth: true },
    },
    {
      path: '/users/:id/edit',
      name: 'user-edit',
      component: () => import('../views/users/UserEditView.vue'),
      props: true,
      meta: { title: 'Редагування користувача', layout: 'DefaultLayout', requiresAuth: true },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
      meta: { title: '404 - Не знайдено', layout: 'DefaultLayout' },
    },
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  document.title = `${to.meta.title} | VueLottery`

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else if (to.name === 'login' && authStore.isAuthenticated) {
    next({ name: 'users' })
  } else {
    next()
  }
})

export default router
