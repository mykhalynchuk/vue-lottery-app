<script setup lang="ts">
import { LoginForm } from '@/features/auth'
</script>

<template>
  <div class="d-flex justify-content-center align-items-center" style="min-height: 80vh">
    <div class="card p-4 shadow-sm" style="width: 100%; max-width: 400px">
      <h3 class="text-center mb-4">Вхід у систему</h3>

      <LoginForm />

      <RouterLink to="/" class="d-block text-center mt-3 text-decoration-none">
        🏠 Повернутися на головну
      </RouterLink>
    </div>
  </div>
</template>
