<template>
  <div>
    <button class="btn btn-secondary mb-3" @click="$router.back()">Назад</button>
    <div v-if="isLoading" class="text-center"><span class="spinner-border"></span></div>
    <div v-else-if="user" class="card">
      <div class="card-body">
        <h3 class="card-title">{{ user.firstName }} {{ user.lastName }}</h3>
        <p><strong>Username:</strong> {{ user.username }}</p>
        <p><strong>Email:</strong> {{ user.email }}</p>
        <p><strong>Phone:</strong> {{ user.phone }}</p>
        <p><strong>Age:</strong> {{ user.age }} | <strong>Gender:</strong> {{ user.gender }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ServiceProvider } from '../../services/service-provider'
import type { User } from '../../types/user'
import { useUsersStore } from '../../stores/users'

const props = defineProps<{ id: string }>()
const user = ref<User | null>(null)
const isLoading = ref(true)
const usersStore = useUsersStore()

onMounted(async () => {
  // Перевіряємо локальний стор, щоб відобразити фейкові оновлення, якщо вони є
  const localUser = usersStore.users.find((u) => u.id === Number(props.id))
  if (localUser) {
    user.value = localUser
    isLoading.value = false
  } else {
    try {
      user.value = await ServiceProvider.users.getById(Number(props.id))
    } catch (e) {
      console.error(e)
    } finally {
      isLoading.value = false
    }
  }
})
</script>
