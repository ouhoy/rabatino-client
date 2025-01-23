<script setup lang="ts">
import { ref } from 'vue'
import { z } from 'zod'
import { useRouter } from 'vue-router'

definePageMeta({
  layout: 'empty'
})

const router = useRouter()
const isPending = ref(false)

// Form data
const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')

// Error handling
const errors = ref({
  firstname: '',
  lastname: '',
  email: '',
  password: ''
})

const config = useRuntimeConfig()


// Validation schema
const registerSchema = z.object({
  firstname: z.string().min(2, 'First name must be at least 2 characters'),
  lastname: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
})

const handleSubmit = async () => {
  // Reset errors
  errors.value = {
    firstname: '',
    lastname: '',
    email: '',
    password: ''
  }

  try {
    const validatedData = registerSchema.parse({
      firstname: firstName.value,
      lastname: lastName.value,
      email: email.value,
      password: password.value
    })

    isPending.value = true

    const response = await fetch(`${config.public.apiBaseUrl}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fullName: firstName.value + " " + lastName.value,
        email: email.value,
        password: password.value
      })
    })

    const data = await response.json()
    console.log(data)

    if (response.ok) {
      router.push('/login')
    } else {
      throw new Error(data.message || 'Registration failed')
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      error.errors.forEach((err) => {
        if (err.path) {
          errors.value[err.path[0] as keyof typeof errors.value] = err.message
        }
      })
    } else if (error instanceof Error) {
      errors.value.email = error.message
    }
  } finally {
    isPending.value = false
  }
}
</script>

<template>
  <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm flex flex-col items-center justify-center">
      <nuxt-link class="mx-auto" to="/">
        <logo/>
      </nuxt-link>
      <h2 class="mt-10 text-center text-2xl font-medium  tracking-tight text-gray-900">
        Create your account
      </h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="flex gap-3">
          <FormInput v-model="firstName" label="First name" placeholder="" type="text" :error="errors.firstname"/>
          <FormInput v-model="lastName" label="Last name" placeholder="" type="text" :error="errors.lastname"/>
        </div>
        <FormInput v-model="email" label="Email" placeholder="" type="email" :error="errors.email"/>
        <FormInput v-model="password" label="Password" placeholder="" type="password" :error="errors.password"/>

        <div>
          <button type="submit"
                  class="flex w-full justify-center rounded-md bg-neutral-900 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary-dark-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-dark">
            {{ isPending ? 'Signing Up' : 'Sign Up' }}
          </button>
        </div>
      </form>
      <p class="mt-10 text-center text-sm text-gray-500">
        Already a member?
        {{ ' ' }}
        <nuxt-link to="/login"
                     class="font-semibold leading-6 text-primary-dark-active hover:text-primary-dark-hover">
          Login to your account
        </nuxt-link>
      </p>
    </div>
  </div>
</template>

<style scoped>

</style>