import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ServiceProvider } from '../services/service-provider'
import type { User, UpdateUserDto } from '../types/user'

export const useUsersStore = defineStore('users', () => {
  const users = ref<User[]>([])
  const total = ref(0)

  const fetchUsers = async (limit: number, skip: number, q: string) => {
    const response = await ServiceProvider.users.getAll({ limit, skip, q })
    users.value = response.users
    total.value = response.total
  }

  const updateUserLocal = (id: number, data: UpdateUserDto) => {
    const index = users.value.findIndex((u) => u.id === id)

    if (index !== -1) {
      const currentUser = users.value[index]

      // Перевіряємо, чи юзер точно існує (задовольняємо правило noUncheckedIndexedAccess)
      if (currentUser) {
        users.value[index] = {
          ...currentUser,
          ...data,
        } as User // Приводимо тип, запевняючи TS, що все добре
      }
    }
  }

  const deleteUserLocal = (id: number) => {
    users.value = users.value.filter((u) => u.id !== id)
    total.value--
  }

  return { users, total, fetchUsers, updateUserLocal, deleteUserLocal }
})
