<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2>Users List</h2>
      <input
        v-model="searchQuery"
        @input="onSearch"
        type="text"
        class="form-control w-25"
        placeholder="Search..."
      />
    </div>

    <div v-if="isLoading" class="text-center py-5"><span class="spinner-border"></span></div>
    <div v-else-if="error" class="alert alert-danger">{{ error }}</div>

    <div v-else>
      <table class="table table-hover align-middle">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Age</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in usersStore.users" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.firstName }} {{ user.lastName }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.age }}</td>
            <td>
              <RouterLink :to="`/users/${user.id}`" class="btn btn-sm btn-info me-2 text-white"
                >Details</RouterLink
              >
              <RouterLink :to="`/users/${user.id}/edit`" class="btn btn-sm btn-warning me-2"
                >Edit</RouterLink
              >
              <button @click="handleDelete(user.id)" class="btn btn-sm btn-danger">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="d-flex justify-content-between align-items-center mt-3">
        <span>Total: {{ usersStore.total }}</span>
        <div>
          <button
            class="btn btn-outline-secondary btn-sm me-2"
            :disabled="page <= 1"
            @click="changePage(page - 1)"
          >
            Prev
          </button>
          <span>Page {{ page }}</span>
          <button
            class="btn btn-outline-secondary btn-sm ms-2"
            :disabled="page * limit >= usersStore.total"
            @click="changePage(page + 1)"
          >
            Next
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

const route = useRoute()
const router = useRouter()
const usersStore = useUsersStore()

const limit = 10
const page = ref(Number(route.query.page) || 1)
const searchQuery = ref(route.query.q?.toString() || '')
const isLoading = ref(false)
const error = ref('')

let timeout: ReturnType<typeof setTimeout>

const loadData = async () => {
  isLoading.value = true
  error.value = ''
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

const handleDelete = async (id: number) => {
  if (confirm('Are you sure?')) {
    try {
      await ServiceProvider.users.delete(id)
      usersStore.deleteUserLocal(id)
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
