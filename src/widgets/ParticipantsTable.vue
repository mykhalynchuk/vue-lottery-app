<template>
  <div class="card-block">
    <div class="d-flex justify-content-end mb-3">
      <div style="width: 300px">
        <slot name="search"></slot>
      </div>
    </div>
    <table class="table table-borderless align-middle">
      <thead class="border-bottom">
        <tr>
          <th class="text-muted small">#</th>
          <th class="text-muted small cursor-pointer" @click="$emit('sort', 'name')">
            Name <span v-if="sortKey === 'name'">{{ sortDir === 'asc' ? '↓' : '↑' }}</span>
          </th>
          <th class="text-muted small cursor-pointer" @click="$emit('sort', 'dob')">
            Date of Birth <span v-if="sortKey === 'dob'">{{ sortDir === 'asc' ? '↓' : '↑' }}</span>
          </th>
          <th class="text-muted small">Email</th>
          <th class="text-muted small">Phone number</th>
          <th class="text-muted small text-end">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(p, index) in participants" :key="p.id" class="border-bottom">
          <td class="text-muted">{{ index + 1 }}</td>
          <td>{{ p.name }}</td>
          <td>{{ p.dob }}</td>
          <td>{{ p.email }}</td>
          <td>{{ p.phone }}</td>
          <td class="text-end">
            <button class="btn btn-sm btn-outline-primary me-2" @click="$emit('edit', p)">
              Редагувати
            </button>
            <button class="btn btn-sm btn-outline-danger" @click="$emit('delete', p)">
              Видалити
            </button>
          </td>
        </tr>
        <tr v-if="participants.length === 0">
          <td colspan="6" class="text-center text-muted py-4">No participants found.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import type { Participant } from '../types'

defineProps<{
  participants: Participant[]
  sortKey: string
  sortDir: 'asc' | 'desc'
}>()

defineEmits(['edit', 'delete', 'sort'])
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
  user-select: none;
}
</style>
