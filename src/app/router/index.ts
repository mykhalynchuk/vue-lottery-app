import { createRouter, createWebHistory } from 'vue-router'
import { useSessionStore } from '@/entities/session'

const router = createRouter({
  history: createWebHistory('/vue-lottery-app/'),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/pages/home').then((m) => m.HomeView),
      meta: { title: 'Головна', layout: 'DefaultLayout' },
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/pages/about').then((m) => m.AboutView),
      meta: { title: 'Про автора', layout: 'DefaultLayout' },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/login').then((m) => m.LoginView),
      meta: { title: 'Авторизація', layout: 'AuthLayout' },
    },
    {
      path: '/users',
      name: 'users',
      component: () => import('@/pages/users').then((m) => m.UserView),
      meta: { title: 'Користувачі', layout: 'DefaultLayout', requiresAuth: true },
    },
    {
      path: '/users/:id',
      name: 'user-detail',
      component: () => import('@/pages/users').then((m) => m.UserDetailView),
      props: true,
      meta: { title: 'Профіль користувача', layout: 'DefaultLayout', requiresAuth: true },
    },
    {
      path: '/users/:id/edit',
      name: 'user-edit',
      component: () => import('@/pages/users').then((m) => m.UserEditView),
      props: true,
      meta: { title: 'Редагування користувача', layout: 'DefaultLayout', requiresAuth: true },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/pages/not-found').then((m) => m.NotFoundView),
      meta: { title: '404 - Не знайдено', layout: 'DefaultLayout' },
    },
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useSessionStore()

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
