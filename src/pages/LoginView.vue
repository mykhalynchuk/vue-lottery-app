<template>
  <div>
    <h4 class="text-center mb-3">Вхід у систему</h4>
    <div v-if="errorMsg" class="alert alert-danger">{{ errorMsg }}</div>

    <form @submit="onSubmit">
      <div class="mb-3">
        <label class="form-label">Username</label>
        <input
          v-model="username"
          type="text"
          class="form-control"
          :class="{ 'is-invalid': errors.username }"
        />
        <div class="invalid-feedback">{{ errors.username }}</div>
      </div>

      <div class="mb-3">
        <label class="form-label">Password</label>
        <input
          v-model="password"
          type="password"
          class="form-control"
          :class="{ 'is-invalid': errors.password }"
        />
        <div class="invalid-feedback">{{ errors.password }}</div>
      </div>

      <button type="submit" class="btn btn-primary w-100" :disabled="isLoading">
        <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
        Login
      </button>
    </form>
    <div class="mt-3 text-muted small text-center">Підказка: emilys / emilyspass</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { useAuthStore } from '../stores/auth'
import { useRouter, useRoute } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const isLoading = ref(false)
const errorMsg = ref('')

const schema = yup.object({
  username: yup.string().required("Username є обов'язковим"),
  password: yup
    .string()
    .min(6, 'Пароль має містити мінімум 6 символів')
    .required("Password є обов'язковим"),
})

const { handleSubmit, errors } = useForm({ validationSchema: schema })
const { value: username } = useField('username')
const { value: password } = useField('password')

const onSubmit = handleSubmit(async (values) => {
  isLoading.value = true
  errorMsg.value = ''
  try {
    await authStore.login(values)
    const redirectPath = route.query.redirect?.toString() || '/users'
    router.push(redirectPath)
  } catch (e) {
    errorMsg.value = (e as Error).message || 'Помилка авторизації'
  } finally {
    isLoading.value = false
  }
})
</script>
