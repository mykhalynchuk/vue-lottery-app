<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import DefaultLayout from './layouts/DefaultLayout.vue'
import AuthLayout from './layouts/AuthLayout.vue'
import Toast from 'primevue/toast'

const route = useRoute()
const layout = computed(() => {
  return route.meta.layout === 'AuthLayout' ? AuthLayout : DefaultLayout
})
</script>

<template>
  <Toast />
  <component :is="layout">
    <RouterView />
  </component>
</template>
