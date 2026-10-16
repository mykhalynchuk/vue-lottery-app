<template>
  <button
    :type="type"
    class="btn text-white"
    :class="variantClass"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  type: { type: String as () => 'button' | 'submit' | 'reset', default: 'button' },
  variant: { type: String, default: 'info' }, // info, danger, primary
  disabled: { type: Boolean, default: false },
})

defineEmits(['click'])

const variantClass = computed(() => `btn-${props.variant}`)
</script>
