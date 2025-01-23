<script setup lang="ts">
import { useAuthStore } from '~/composables/useAuth'

async function handleLogout() {
  try {
    const authStore = useAuthStore()
    await authStore.logout()
  } catch (error) {
    console.error('Logout failed:', error)
  }
}
</script>

<template>

  <nav class="w-full mb-24">
    <div class="flex justify-between items-center py-4 max-w-7xl mx-auto">
      <nuxt-link to="/" class="flex justify-start items-center gap-2 w-[265.55px]">
        <logo/>
        <h2 class="text-neutral-900 text-2xl font-semibold leading-none">rabatino</h2>
      </nuxt-link>

      <div class="flex items-center justify-center gap-2">
        <button @click="handleLogout" class="bg-red-600 text-white p-3 px-6 text-base font-medium rounded-full">Logout
        </button>
      </div>
    </div>
  </nav>

  <div class="max-w-7xl mx-auto w-[95%]">
    <slot/>
  </div>
  <footerbar/>
</template>

<style scoped>

</style>