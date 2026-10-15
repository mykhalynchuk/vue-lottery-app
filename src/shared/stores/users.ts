import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ServiceProvider } from '../services/service-provider'
import type { User, UpdateUserDto } from '../types/user'

export const useUsersStore = defineStore('users', () => {
  const users = ref<User[]>([])
  const total = ref(0)

  const localEdits = ref<Record<number, User>>({})
  const deletedIds = ref<Set<number>>(new Set())

  const fetchUsers = async (limit: number, skip: number, q: string) => {
    const response = await ServiceProvider.users.getAll({ limit, skip, q })

    let mergedUsers = response.users.map((apiUser) => {
      return localEdits.value[apiUser.id] || apiUser
    })

    mergedUsers = mergedUsers.filter((apiUser) => !deletedIds.value.has(apiUser.id))

    users.value = mergedUsers
    total.value = response.total - deletedIds.value.size
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

  return { users, total, fetchUsers, updateUserLocal, deleteUserLocal }
})
