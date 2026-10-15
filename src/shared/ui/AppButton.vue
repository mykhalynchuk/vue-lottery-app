<script setup lang="ts">
import Button from 'primevue/button'

defineProps<{
  label?: string
  icon?: string
  loading?: boolean
  severity?: 'secondary' | 'success' | 'info' | 'warning' | 'help' | 'danger'
  type?: 'button' | 'submit'
}>()
</script>

<template>
  <Button :label="label" :icon="icon" :loading="loading" :severity="severity" :type="type" />
</template>
