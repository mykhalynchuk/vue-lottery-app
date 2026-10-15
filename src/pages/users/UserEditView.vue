<template>
  <div v-if="isLoading" class="text-center py-5"><span class="spinner-border"></span></div>
  <div v-else class="card p-4">
    <h4>Edit User #{{ id }}</h4>
    <form @submit="onSubmit">
      <div class="row">
        <div class="col-md-6 mb-3">
          <label>First Name</label>
          <input
            v-model="firstName"
            type="text"
            class="form-control"
            :class="{ 'is-invalid': errors.firstName }"
          />
          <div class="invalid-feedback">{{ errors.firstName }}</div>
        </div>
        <div class="col-md-6 mb-3">
          <label>Last Name</label>
          <input
            v-model="lastName"
            type="text"
            class="form-control"
            :class="{ 'is-invalid': errors.lastName }"
          />
          <div class="invalid-feedback">{{ errors.lastName }}</div>
        </div>
        <div class="col-md-6 mb-3">
          <label>Email</label>
          <input
            v-model="email"
            type="email"
            class="form-control"
            :class="{ 'is-invalid': errors.email }"
          />
          <div class="invalid-feedback">{{ errors.email }}</div>
        </div>
        <div class="col-md-6 mb-3">
          <label>Age</label>
          <input
            v-model="age"
            type="number"
            class="form-control"
            :class="{ 'is-invalid': errors.age }"
          />
          <div class="invalid-feedback">{{ errors.age }}</div>
        </div>
      </div>
      <button type="submit" class="btn btn-primary" :disabled="isSaving">
        <span v-if="isSaving" class="spinner-border spinner-border-sm me-2"></span> Save
      </button>
      <button type="button" class="btn btn-secondary ms-2" @click="$router.push('/users')">
        Cancel
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { ServiceProvider } from '../../services/service-provider'
import { useUsersStore } from '../../stores/users'

const props = defineProps<{ id: string }>()
const router = useRouter()
const usersStore = useUsersStore()
const isLoading = ref(true)
const isSaving = ref(false)

const schema = yup.object({
  firstName: yup.string().required("Поле обов'язкове"),
  lastName: yup.string().required("Поле обов'язкове"),
  email: yup.string().email('Невірний формат').required("Поле обов'язкове"),
  age: yup.number().min(1, 'Мінімум 1').required("Поле обов'язкове"),
})

const { handleSubmit, errors, setValues } = useForm({ validationSchema: schema })
const { value: firstName } = useField('firstName')
const { value: lastName } = useField('lastName')
const { value: email } = useField('email')
const { value: age } = useField('age')

onMounted(async () => {
  const localUser = usersStore.users.find((u) => u.id === Number(props.id))
  let userData = localUser

  if (!userData) {
    try {
      userData = await ServiceProvider.users.getById(Number(props.id))
    } catch {
      alert('Помилка завантаження')
      router.push('/users')
      return
    }
  }

  setValues({
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    age: userData.age,
  })
  isLoading.value = false
})

const onSubmit = handleSubmit(async (values) => {
  isSaving.value = true
  try {
    const updatedUser = await ServiceProvider.users.update(Number(props.id), values)
    usersStore.updateUserLocal(Number(props.id), updatedUser)
    router.push('/users')
  } catch (e) {
    alert((e as Error).message)
  } finally {
    isSaving.value = false
  }
})
</script>
