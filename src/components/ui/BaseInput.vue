<template>
  <div class="mb-3">
    <label v-if="label" class="form-label text-muted small fw-bold">{{ label }}</label>
    <input
      :type="type"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @keydown.enter="$emit('enter')"
      class="form-control"
      :class="{ 'is-invalid': error, 'is-valid': isValid }"
      :placeholder="placeholder"
    />
    <div v-if="error" class="invalid-feedback">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label?: string
  type?: string
  modelValue: string
  error?: string
  isValid?: boolean
  placeholder?: string
}>()

defineEmits(['update:modelValue', 'enter'])
</script>
