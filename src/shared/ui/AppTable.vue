<script setup lang="ts" generic="T">
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

defineProps<{
  data: T[]
  columns: { field: string; header: string }[]
  loading?: boolean
}>()
</script>

<template>
  <DataTable :value="data" :loading="loading" stripedRows class="w-100 shadow-sm">
    <Column v-for="col in columns" :key="col.field" :field="col.field" :header="col.header" />
    <Column header="Дії" :exportable="false" style="min-width: 8rem">
      <template #body="slotProps">
        <slot name="actions" :item="slotProps.data"></slot>
      </template>
    </Column>
  </DataTable>
</template>
