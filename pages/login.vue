<script setup lang="ts">
import { ref } from 'vue'
import { z } from 'zod'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/composables/useAuth'

definePageMeta({
  layout: 'empty',
  auth: {
    required: false,
    unauthenticatedOnly: true
  }
})

const router = useRouter()
const authStore = useAuthStore()
const isPending = ref(false)

// Form data
const email = ref('')
const password = ref('')

// Error handling
const error = ref('')

// Validation schema
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
})

async function handleLogin() {
  try {
    isPending.value = true
    error.value = '' // Clear any previous errors

    // Validate form data
    const validatedData = loginSchema.parse({
      email: email.value,
      password: password.value
    })

    await authStore.login(validatedData.email, validatedData.password)
    if (authStore.isAuthenticated) {
      await router.push('/dashboard')
    } else {
      error.value = 'Login failed. Please check your credentials.'
    }
  } catch (e) {
    if (e instanceof z.ZodError) {
      error.value = e.errors[0].message
    } else {
      error.value = 'An error occurred during login. Please try again.'
      console.error('Login error:', e)
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
      <h2 class="mt-10 text-center text-2xl font-medium tracking-tight text-gray-900">
        Sign in to your account
      </h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form @submit.prevent="handleLogin" class="space-y-6">
        <FormInput 
          v-model="email" 
          label="Email" 
          type="email" 
          :error="error"
        />
        <FormInput 
          v-model="password" 
          label="Password" 
          type="password" 
          :error="error"
        />

        <div>
          <button type="submit"
                  class="flex w-full justify-center rounded-md bg-neutral-900 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary-dark-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-dark">
            {{ isPending ? 'Signing in...' : 'Sign in' }}
          </button>
        </div>
      </form>

      <p class="mt-10 text-center text-sm text-gray-500">
        Not a member?
        {{ ' ' }}
        <nuxt-link to="/register"
                   class="font-semibold leading-6 text-primary-dark-active hover:text-primary-dark-hover">
          Create an account
        </nuxt-link>
      </p>
    </div>
  </div>
</template>

<style scoped>

</style>