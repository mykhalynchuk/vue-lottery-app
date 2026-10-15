<script setup lang="ts">
import { computed } from 'vue'
import InputText from 'primevue/inputtext'

const props = defineProps<{
  id: string
  label: string
  modelValue: string | number | null | undefined
  error?: string
  type?: string
}>()

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

// Робимо безпечну обгортку для значення, щоб PrimeVue не сварився
const internalValue = computed({
  get: () =>
    props.modelValue === null || props.modelValue === undefined ? '' : String(props.modelValue),
  set: (val: string) => emit('update:modelValue', val),
})
</script>

<template>
  <div class="d-flex flex-column gap-1 mb-3">
    <label :for="id" class="form-label fw-bold">{{ label }}</label>
    <InputText
      :id="id"
      :type="type || 'text'"
      v-model="internalValue"
      :invalid="!!error"
      class="w-100"
    />
    <small v-if="error" class="text-danger">{{ error }}</small>
  </div>
</template>
