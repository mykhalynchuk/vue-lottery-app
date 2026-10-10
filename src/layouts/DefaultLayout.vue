<template>
  <div class="container">
    <AppHeader />
    <main>
      <slot></slot>
    </main>
  </div>
</template>

<script setup lang="ts">
import AppHeader from '../components/AppHeader.vue'
</script>
