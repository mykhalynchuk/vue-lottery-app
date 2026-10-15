<script setup lang="ts">
import { useConfirm } from 'primevue/useconfirm'
import { AppTable, AppButton, AppConfirmDialog } from '@/shared/ui'
import type { User } from '@/entities/user'

defineProps<{
  participants: User[]
  loading?: boolean
}>()

const emit = defineEmits<{
  edit: [id: number]
  delete: [id: number]
}>()

const confirm = useConfirm()

const tableColumns = [
  { field: 'id', header: 'ID' },
  { field: 'firstName', header: "Ім'я" },
  { field: 'lastName', header: 'Прізвище' },
  { field: 'email', header: 'Email' },
]

const confirmDelete = (event: Event, id: number) => {
  confirm.require({
    target: event.currentTarget as HTMLElement,
    message: 'Ви впевнені, що хочете видалити цього учасника?',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
      emit('delete', id)
    },
  })
}
</script>

<template>
  <div class="mt-4">
    <AppConfirmDialog />

    <AppTable :data="participants" :columns="tableColumns" :loading="loading">
      <template #actions="{ item }">
        <div class="d-flex gap-2">
          <AppButton label="Редагувати" severity="info" @click="$emit('edit', item.id)" />
          <AppButton label="Видалити" severity="danger" @click="confirmDelete($event, item.id)" />
        </div>
      </template>
    </AppTable>
  </div>
</template>
