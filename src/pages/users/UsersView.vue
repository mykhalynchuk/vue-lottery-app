<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2>Учасники лотереї</h2>

      <div class="d-flex gap-2 w-50">
        <input
          v-model="searchQuery"
          @input="onSearch"
          type="text"
          class="form-control"
          placeholder="Фільтр за ім'ям або email..."
        />
        <button
          @click="pickWinner"
          class="btn btn-success fw-bold text-nowrap"
          :disabled="usersStore.users.length === 0 || isLoading"
        >
          Розіграти!
        </button>
      </div>
    </div>

    <div v-if="winner" class="alert alert-success text-center shadow-sm mb-4">
      <h3 class="mb-0">
        Переможець лотереї: <strong>{{ winner.firstName }} {{ winner.lastName }}</strong
        >!
      </h3>
      <p class="mb-0 text-muted">Email: {{ winner.email }} | Вік: {{ winner.age }}</p>
    </div>

    <div v-if="isLoading" class="text-center py-5"><span class="spinner-border"></span></div>
    <div v-else-if="error" class="alert alert-danger">{{ error }}</div>

    <div v-else>
      <table class="table table-hover align-middle">
        <thead class="table-light">
          <tr>
            <th>ID</th>
            <th>Ім'я та Прізвище</th>
            <th>Email</th>
            <th>Вік</th>
            <th>Дії</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in usersStore.users" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.firstName }} {{ user.lastName }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.age }}</td>
            <td>
              <RouterLink :to="`/users/${user.id}`" class="btn btn-sm btn-info me-2 text-white">
                Деталі
              </RouterLink>
              <RouterLink :to="`/users/${user.id}/edit`" class="btn btn-sm btn-warning me-2">
                Редагувати
              </RouterLink>
              <button @click="handleDelete(user.id)" class="btn btn-sm btn-danger">Видалити</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="d-flex justify-content-between align-items-center mt-3">
        <span class="text-muted">Всього учасників: {{ usersStore.total }}</span>
        <div>
          <button
            class="btn btn-outline-secondary btn-sm me-2"
            :disabled="page <= 1"
            @click="changePage(page - 1)"
          >
            Попередня
          </button>
          <span class="mx-2">Сторінка {{ page }}</span>
          <button
            class="btn btn-outline-secondary btn-sm ms-2"
            :disabled="page * limit >= usersStore.total"
            @click="changePage(page + 1)"
          >
            Наступна
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUsersStore } from '../../stores/users'
import { ServiceProvider } from '../../services/service-provider'
import type { User } from '../../types/user'

const route = useRoute()
const router = useRouter()
const usersStore = useUsersStore()

const limit = 10
const page = ref(Number(route.query.page) || 1)
const searchQuery = ref(route.query.q?.toString() || '')
const isLoading = ref(false)
const error = ref('')

const winner = ref<User | null>(null)

let timeout: ReturnType<typeof setTimeout>

const loadData = async () => {
  isLoading.value = true
  error.value = ''
  winner.value = null
  try {
    const skip = (page.value - 1) * limit
    await usersStore.fetchUsers(limit, skip, searchQuery.value)
  } catch (e) {
    error.value = (e as Error).message
  } finally {
    isLoading.value = false
  }
}

const updateQueryParams = () => {
  router.push({ query: { page: page.value, q: searchQuery.value || undefined } })
}

const changePage = (newPage: number) => {
  page.value = newPage
  updateQueryParams()
}

const onSearch = () => {
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    page.value = 1
    updateQueryParams()
  }, 500)
}

const pickWinner = () => {
  const participants = usersStore.users
  if (participants.length > 0) {
    const randomIndex = Math.floor(Math.random() * participants.length)

    winner.value = participants[randomIndex] || null
  }
}

const handleDelete = async (id: number) => {
  if (confirm('Ви впевнені, що хочете видалити учасника?')) {
    try {
      await ServiceProvider.users.delete(id)
      usersStore.deleteUserLocal(id)

      if (winner.value && winner.value.id === id) {
        winner.value = null
      }
    } catch (e) {
      alert((e as Error).message)
    }
  }
}

watch(
  () => route.query,
  () => {
    page.value = Number(route.query.page) || 1
    searchQuery.value = route.query.q?.toString() || ''
    loadData()
  },
  { deep: true },
)

onMounted(loadData)
</script>
