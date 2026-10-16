import { useSessionStore } from '@/entities/session'

const BASE_URL = import.meta.env.VITE_API_URL
let isRefreshing = false

export async function http<T>(path: string, options: RequestInit = {}): Promise<T> {
  const authStore = useSessionStore()

  const headers = new Headers(options.headers)
  headers.set('Content-Type', 'application/json')

  if (authStore.accessToken) {
    headers.set('Authorization', `Bearer ${authStore.accessToken}`)
  }

  let response = await fetch(`${BASE_URL}${path}`, { ...options, headers })

  if (response.status === 401 && authStore.refreshToken && !isRefreshing) {
    isRefreshing = true
    try {
      await authStore.refresh()
      headers.set('Authorization', `Bearer ${authStore.accessToken}`)
      response = await fetch(`${BASE_URL}${path}`, { ...options, headers })
    } catch (e) {
      authStore.clearSession()
    } finally {
      isRefreshing = false
    }
  }

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }

  return response.json() as Promise<T>
}
