<template>
  <span class="badge bg-info text-white me-2 p-2 d-inline-flex align-items-center">
    {{ name }}
    <button
      type="button"
      class="btn-close btn-close-white ms-2"
      style="font-size: 0.5rem"
      @click="$emit('remove')"
    ></button>
  </span>
</template>

<script setup lang="ts">
defineProps<{ name: string }>()
defineEmits(['remove'])
</script>
