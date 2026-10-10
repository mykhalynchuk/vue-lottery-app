<template>
  <div class="container d-flex justify-content-center align-items-center vh-100 bg-light">
    <div class="card p-4 shadow-sm" style="width: 100%; max-width: 400px">
      <div class="text-center mb-4">
        <Logo />
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import Logo from '../components/Logo.vue'
</script>
