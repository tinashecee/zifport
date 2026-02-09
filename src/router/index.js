import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { getAuthToken } from '@/services/api'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/players',
    name: 'PlayerDatabase',
    component: () => import('@/views/PlayerDatabase.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/registration',
    name: 'Registration',
    component: () => import('@/views/Registration.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/player/:id',
    name: 'PlayerProfile',
    component: () => import('@/views/PlayerProfile.vue'),
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/coaches',
    name: 'CoachDatabase',
    component: () => import('@/views/CoachDatabase.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/coach/:id',
    name: 'CoachProfile',
    component: () => import('@/views/CoachProfile.vue'),
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/referees',
    name: 'RefereeDatabase',
    component: () => import('@/views/RefereeDatabase.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/referee/:id',
    name: 'RefereeProfile',
    component: () => import('@/views/RefereeProfile.vue'),
    props: true,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Track if auth initialization is complete
let authInitPromise = null

// Navigation guard for protected routes
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Ensure auth is initialized before checking routes (only on first navigation)
  if (!authInitPromise) {
    authInitPromise = authStore.initAuth()
  }
  await authInitPromise
  
  // Check if route requires authentication
  if (to.meta.requiresAuth) {
    // Check if user has a token
    const token = getAuthToken()
    if (token) {
      // Token exists - check if user is loaded
      if (authStore.user) {
        // User is loaded and authenticated, allow access
        next()
      } else {
        // Token exists but user not loaded - this shouldn't happen after initAuth
        // But if it does, try to verify once
        const isValid = await authStore.verifyToken()
        if (isValid) {
          next()
        } else {
          // Token invalid, logout and redirect
          authStore.logout()
          next({ name: 'Home', query: { redirect: to.fullPath, login: 'true' } })
        }
      }
    } else {
      // No token, redirect to home with redirect query
      next({ name: 'Home', query: { redirect: to.fullPath, login: 'true' } })
    }
  } else {
    // Public route, allow access
    next()
  }
})

export default router
