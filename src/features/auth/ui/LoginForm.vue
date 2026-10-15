<script setup lang="ts">
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { useSessionStore } from '@/entities/session'
import { AppInput, AppButton } from '@/shared/ui'
import { useToast } from 'primevue/usetoast'
import { useRouter, useRoute } from 'vue-router'

const store = useSessionStore()
const toast = useToast()
const router = useRouter()
const route = useRoute()

const schema = yup.object({
  username: yup.string().required("Логін є обов'язковим"),
  password: yup.string().required("Пароль є обов'язковим"),
})

const { defineField, handleSubmit, errors, isSubmitting } = useForm({
  validationSchema: schema,
})

const [username] = defineField('username')
const [password] = defineField('password')

const onSubmit = handleSubmit(async (values) => {
  try {
    await store.login(values)
    toast.add({ severity: 'success', summary: 'Успіх', detail: 'Ви увійшли в систему', life: 3000 })
    const redirect = (route.query.redirect as string) || '/'
    router.push(redirect)
  } catch  {
    toast.add({
      severity: 'error',
      summary: 'Помилка',
      detail: 'Невірний логін або пароль',
      life: 3000,
    })
  }
})
</script>

<template>
  <form @submit.prevent="onSubmit" class="d-flex flex-column gap-3 w-100">
    <AppInput id="username" label="Логін" v-model="username" :error="errors.username" />
    <AppInput
      id="password"
      type="password"
      label="Пароль"
      v-model="password"
      :error="errors.password"
    />

    <AppButton label="Увійти" type="submit" :loading="isSubmitting" />
  </form>
</template>
