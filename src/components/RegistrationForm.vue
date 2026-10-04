<template>
  <div class="card-block">
    <h5 class="fw-bold mb-0">REGISTER FORM</h5>
    <p class="text-muted small mb-4">Please fill in all the fields.</p>

    <form @submit.prevent="submitForm">
      <BaseInput
        label="Name"
        placeholder="Enter user name"
        v-model="form.name"
        :error="errors.name"
        :isValid="isValid.name"
        @enter="submitForm"
      />
      <BaseInput
        type="date"
        label="Date of Birth"
        v-model="form.dob"
        :error="errors.dob"
        :isValid="isValid.dob"
        @enter="submitForm"
      />
      <BaseInput
        label="Email"
        placeholder="Enter email"
        v-model="form.email"
        :error="errors.email"
        :isValid="isValid.email"
        @enter="submitForm"
      />
      <BaseInput
        label="Phone number"
        placeholder="Enter Phone number"
        v-model="form.phone"
        :error="errors.phone"
        :isValid="isValid.phone"
        @enter="submitForm"
      />

      <div class="d-flex justify-content-end mt-4">
        <BaseButton type="submit" variant="info">Save</BaseButton>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import type { Participant } from '../types'
import BaseInput from './ui/BaseInput.vue'
import BaseButton from './ui/BaseButton.vue'

const props = defineProps<{ existingEmails: string[] }>()
const emit = defineEmits<{ (e: 'save', participant: Omit<Participant, 'id'>): void }>()

const defaultForm = { name: '', dob: '', email: '', phone: '' }
const form = reactive({ ...defaultForm })
const errors = reactive({ name: '', dob: '', email: '', phone: '' })
const isValid = reactive({ name: false, dob: false, email: false, phone: false })

const validate = () => {
  let valid = true
  Object.keys(errors).forEach((k) => {
    errors[k as keyof typeof errors] = ''
    isValid[k as keyof typeof isValid] = false
  })

  if (!form.name.trim()) {
    errors.name = 'This value is required.'
    valid = false
  } else {
    isValid.name = true
  }

  if (!form.dob) {
    errors.dob = 'This value is required.'
    valid = false
  } else if (new Date(form.dob) > new Date()) {
    errors.dob = 'Date of birth cannot be in the future.'
    valid = false
  } else {
    isValid.dob = true
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!form.email.trim()) {
    errors.email = 'This value is required.'
    valid = false
  } else if (!emailRegex.test(form.email)) {
    errors.email = 'Invalid email format.'
    valid = false
  } else if (props.existingEmails.map((e) => e.toLowerCase()).includes(form.email.toLowerCase())) {
    errors.email = 'This email is already registered.'
    valid = false
  } else {
    isValid.email = true
  }

  const phoneRegex = /^\+380\d{9}$/
  if (!form.phone.trim()) {
    errors.phone = 'This value is required.'
    valid = false
  } else if (!phoneRegex.test(form.phone)) {
    errors.phone = 'Format must be +380XXXXXXXXX.'
    valid = false
  } else {
    isValid.phone = true
  }

  return valid
}

const submitForm = () => {
  if (validate()) {
    emit('save', { ...form })
    // Reset form without triggering validation
    Object.assign(form, defaultForm)
    Object.keys(errors).forEach((k) => {
      errors[k as keyof typeof errors] = ''
      isValid[k as keyof typeof isValid] = false
    })
  }
}
</script>
