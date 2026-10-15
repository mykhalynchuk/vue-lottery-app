import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ServiceProvider } from '@/shared/api/service-provider'
import type { UserService } from '../api/user.service'
import type { User, UpdateUserDto } from './types'

export const useUsersStore = defineStore('users', () => {
  const users = ref<User[]>([])
  const total = ref(0)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const localEdits = ref<Record<number, User>>({})
  const deletedIds = ref<Set<number>>(new Set())

  // Отримуємо сервіс через наш новий універсальний реєстр
  const service = () => ServiceProvider.get<UserService>('users')

  const fetchUsers = async (limit = 10, skip = 0, q = '') => {
    isLoading.value = true
    error.value = null
    try {
      const response = await service().getAll({ limit, skip, q })

      let mergedUsers = response.users.map((apiUser) => {
        return localEdits.value[apiUser.id] || apiUser
      })

      mergedUsers = mergedUsers.filter((apiUser) => !deletedIds.value.has(apiUser.id))

      users.value = mergedUsers
      total.value = response.total - deletedIds.value.size
    } catch (e) {
      error.value = (e as Error).message
    } finally {
      isLoading.value = false
    }
  }

  const updateUserLocal = (id: number, data: UpdateUserDto) => {
    const index = users.value.findIndex((u) => u.id === id)
    if (index !== -1) {
      const currentUser = users.value[index]
      if (currentUser) {
        const updated = { ...currentUser, ...data } as User
        users.value[index] = updated
        localEdits.value[id] = updated
      }
    }
  }

  const deleteUserLocal = (id: number) => {
    users.value = users.value.filter((u) => u.id !== id)
    deletedIds.value.add(id)
    total.value--
  }

  return { users, total, isLoading, error, fetchUsers, updateUserLocal, deleteUserLocal }
})
