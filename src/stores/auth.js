import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authAPI, getAuthToken, setAuthToken } from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isAuthenticated = computed(() => !!user.value && !!getAuthToken())

  // Initialize from token
  const initAuth = async () => {
    const token = getAuthToken()
    if (token) {
      try {
        const result = await authAPI.verify()
        if (result.success && result.user) {
          user.value = result.user
        } else {
          // Invalid token, clear it
          setAuthToken(null)
          user.value = null
        }
      } catch (error) {
        // Only clear token if it's an authentication error (401/403)
        // If it's a network error, keep the token and user state
        if (error.message && (error.message.includes('401') || error.message.includes('403') || error.message.includes('Unauthorized'))) {
          // Token invalid or expired
          setAuthToken(null)
          user.value = null
        } else {
          // Network error or server down - keep token but don't set user
          // User will remain "logged in" based on token presence
          // This prevents logout on page reload when backend is temporarily unavailable
          console.warn('Auth verification failed, but keeping token:', error.message)
        }
      }
    }
  }

  // Login
  const login = async (email, password) => {
    try {
      const result = await authAPI.login(email, password)
      if (result.success && result.user) {
        user.value = result.user
        return { success: true, user: result.user }
      }
      return { success: false, error: result.error || 'Login failed' }
    } catch (error) {
      return { success: false, error: error.message || 'Login failed' }
    }
  }

  // Register
  const register = async (userData) => {
    try {
      const result = await authAPI.register(userData)
      if (result.success && result.user) {
        user.value = result.user
        return { success: true, user: result.user }
      }
      return { success: false, error: result.error || 'Registration failed' }
    } catch (error) {
      return { success: false, error: error.message || 'Registration failed' }
    }
  }

  // Verify token
  const verifyToken = async () => {
    try {
      const result = await authAPI.verify()
      if (result.success && result.user) {
        user.value = result.user
        return true
      }
      return false
    } catch (error) {
      return false
    }
  }

  // Logout
  const logout = () => {
    user.value = null
    authAPI.logout()
  }

  // Check if user has specific role
  const hasRole = (role) => {
    return user.value?.role_name === role || user.value?.role === role
  }

  return {
    user,
    isAuthenticated,
    login,
    register,
    logout,
    hasRole,
    verifyToken,
    initAuth
  }
})
