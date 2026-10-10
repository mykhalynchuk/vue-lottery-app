<template>
  <nav class="nav nav-pills">
    <RouterLink to="/" class="nav-link" exact-active-class="active">Home</RouterLink>
    <RouterLink to="/about" class="nav-link" exact-active-class="active">About author</RouterLink>
    <RouterLink
      v-if="authStore.isAuthenticated"
      to="/users"
      class="nav-link"
      exact-active-class="active"
      >Users</RouterLink
    >

    <button
      v-if="authStore.isAuthenticated"
      @click="authStore.logout"
      class="nav-link btn btn-link text-danger"
    >
      Logout
    </button>
    <RouterLink v-else to="/login" class="nav-link" exact-active-class="active">Login</RouterLink>
  </nav>
</template>

<script setup lang="ts">
import { useAuthStore } from '../stores/auth'
const authStore = useAuthStore()
</script>
