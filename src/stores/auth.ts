import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ServiceProvider } from '../services/service-provider'
import type { AuthUser } from '../types/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(JSON.parse(localStorage.getItem('auth_user') || 'null'))
  const accessToken = computed(() => user.value?.accessToken || null)
  const refreshToken = computed(() => user.value?.refreshToken || null)
  const isAuthenticated = computed(() => !!user.value)

  const setAuthData = (data: AuthUser) => {
    user.value = data
    localStorage.setItem('auth_user', JSON.stringify(data))
  }

  const login = async (credentials: Record<string, string>) => {
    const data = await ServiceProvider.auth.login(credentials)
    setAuthData(data)
  }

  const refresh = async () => {
    if (!refreshToken.value) throw new Error('No refresh token')
    const data = await ServiceProvider.auth.refresh(refreshToken.value)
    setAuthData(data)
  }

  const logout = () => {
    user.value = null
    localStorage.removeItem('auth_user')
    window.location.href = '/login'
  }

  return { user, accessToken, refreshToken, isAuthenticated, login, refresh, logout }
})
