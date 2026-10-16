import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ServiceProvider } from '@/shared/api'
import type { AuthService } from '../api/auth.service'
import type { AuthUser } from './types'

export const useSessionStore = defineStore(
  'session',
  () => {
    const user = ref<AuthUser | null>(null)

    const accessToken = computed(() => user.value?.accessToken || null)
    const refreshToken = computed(() => user.value?.refreshToken || null)
    const isAuthenticated = computed(() => !!user.value)

    const service = () => ServiceProvider.get<AuthService>('auth')

    const setSession = (data: AuthUser) => {
      user.value = data
    }

    const login = async (credentials: Record<string, string>) => {
      const data = await service().login(credentials)
      setSession(data)
    }

    const refresh = async () => {
      if (!refreshToken.value) throw new Error('No refresh token')
      const data = await service().refresh(refreshToken.value)
      setSession(data)
    }

    const clearSession = () => {
      user.value = null
      window.location.href = import.meta.env.BASE_URL + 'login'
    }

    return { user, accessToken, refreshToken, isAuthenticated, login, refresh, clearSession }
  },
  {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    persist: true,
  },
)
