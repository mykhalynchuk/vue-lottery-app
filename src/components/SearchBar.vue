<template>
  <input type="text" class="form-control" placeholder="Search by name..." v-model="query" />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const query = ref('')
const emit = defineEmits(['filter-by-name'])

let timeout: ReturnType<typeof setTimeout>

watch(query, (newVal) => {
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    emit('filter-by-name', newVal)
  }, 300) // Debounce 300ms
})
</script>
