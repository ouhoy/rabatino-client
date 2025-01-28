<script setup lang="ts">
import { ref } from 'vue'
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'

const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}
</script>

<template>
  <nav class="w-full">
    <div class="flex justify-between items-center py-4 px-4 max-w-7xl mx-auto">
      <nuxt-link to="/" class="flex justify-start items-center gap-2">
        <logo />
        <h2 class="text-neutral-900 text-2xl font-semibold leading-none">rabatino</h2>
      </nuxt-link>

      <!-- Mobile menu button -->
      <button @click="toggleMenu" class="lg:hidden">
        <Bars3Icon v-if="!isMenuOpen" class="h-6 w-6" />
        <XMarkIcon v-else class="h-6 w-6" />
      </button>

      <!-- Desktop Navigation -->
      <div class="hidden lg:flex items-center justify-center gap-6">
        <nuxt-link to="/" class="text-neutral-900 text-base font-medium">Home</nuxt-link>
        <nuxt-link to="/education" class="text-neutral-900 text-base font-medium">Education</nuxt-link>
        <nuxt-link to="/tourism" class="text-neutral-900 text-base font-medium">Tourism</nuxt-link>
        <nuxt-link to="/business" class="text-neutral-900 text-base font-medium">Business</nuxt-link>
        <nuxt-link to="/career" class="text-neutral-900 text-base font-medium">Career</nuxt-link>
        <nuxt-link to="/dashboard" class="text-neutral-900 text-base font-medium">Dashboard</nuxt-link>
      </div>

      <div class="hidden lg:flex items-center justify-center gap-2">
        <nuxt-link to="/login" class="text-neutral-900 p-3 px-6 text-base font-medium">Login</nuxt-link>
        <nuxt-link to="/register" class="bg-neutral-900 text-white p-3 px-6 text-base font-medium rounded-full">Create Account</nuxt-link>
      </div>

      <!-- Mobile Navigation -->
      <div 
        :class="[
          'fixed inset-0 bg-white z-[150] transition-transform duration-300 ease-in-out lg:hidden',
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        ]"
      >
        <!-- Close button -->
        <div class="flex justify-end p-4">
          <button @click="toggleMenu" class="p-2">
            <XMarkIcon class="h-8 w-8 text-neutral-900" />
          </button>
        </div>

        <div class="flex flex-col items-center justify-center h-[calc(100%-5rem)] gap-8">
          <nuxt-link @click="toggleMenu" to="/" class="text-neutral-900 text-xl font-medium">Home</nuxt-link>
          <nuxt-link @click="toggleMenu" to="/education" class="text-neutral-900 text-xl font-medium">Education</nuxt-link>
          <nuxt-link @click="toggleMenu" to="/tourism" class="text-neutral-900 text-xl font-medium">Tourism</nuxt-link>
          <nuxt-link @click="toggleMenu" to="/business" class="text-neutral-900 text-xl font-medium">Business</nuxt-link>
          <nuxt-link @click="toggleMenu" to="/career" class="text-neutral-900 text-xl font-medium">Career</nuxt-link>
          <nuxt-link @click="toggleMenu" to="/dashboard" class="text-neutral-900 text-xl font-medium">Dashboard</nuxt-link>
          
          <div class="flex flex-col gap-4 mt-8 w-full px-8">
            <nuxt-link @click="toggleMenu" to="/login" class="text-neutral-900 p-4 text-xl font-medium text-center border border-neutral-900 rounded-full">Login</nuxt-link>
            <nuxt-link @click="toggleMenu" to="/register" class="bg-neutral-900 text-white p-4 text-xl font-medium rounded-full text-center">Create Account</nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>

</style>