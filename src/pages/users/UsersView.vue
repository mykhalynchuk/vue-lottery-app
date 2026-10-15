<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useUsersStore } from '@/entities/user'
import SearchBar from '@/widgets/SearchBar.vue'
import ParticipantsTable from '@/widgets/ParticipantsTable.vue'
import { useToast } from 'primevue/usetoast'

const store = useUsersStore()
const { users, isLoading, error } = storeToRefs(store)
const { fetchUsers, deleteUserLocal } = store

const route = useRoute()
const router = useRouter()
const toast = useToast()

const ITEMS_PER_PAGE = 10

const loadData = async () => {
  const page = parseInt(route.query.page as string) || 1
  const search = (route.query.q as string) || ''
  const skip = (page - 1) * ITEMS_PER_PAGE

  await fetchUsers(ITEMS_PER_PAGE, skip, search)

  if (error.value) {
    toast.add({ severity: 'error', summary: 'Помилка', detail: error.value, life: 3000 })
  }
}

onMounted(loadData)
watch(() => route.query, loadData, { deep: true })

const handleSearch = (query: string) => {
  router.push({ query: { ...route.query, q: query, page: 1 } })
}

const editParticipant = (id: number) => {
  router.push(`/users/${id}/edit`)
}

const deleteParticipant = async (id: number) => {
  try {
    deleteUserLocal(id)
    toast.add({ severity: 'success', summary: 'Успіх', detail: 'Користувача видалено', life: 3000 })
    if (users.value.length === 0 && Number(route.query.page) > 1) {
      router.push({ query: { ...route.query, page: Number(route.query.page) - 1 } })
    }
  } catch {
    toast.add({
      severity: 'error',
      summary: 'Помилка',
      detail: 'Не вдалося видалити користувача',
      life: 3000,
    })
  }
}
</script>

<template>
  <div class="container mt-4">
    <h2>Учасники лотереї</h2>

    <SearchBar @search="handleSearch" :initial-query="(route.query.q as string) || ''" />

    <ParticipantsTable
      :participants="users"
      :loading="isLoading"
      @edit="editParticipant"
      @delete="deleteParticipant"
    />
  </div>
</template>
