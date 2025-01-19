<script setup lang="ts">

import Logo from "./logo.vue";
</script>

<template>
  <footer class="w-full py-16 mt-8">
    <div class="flex flex-col items-center justify-center gap-6 max-w-7xl mx-auto">

      <nuxt-link to="/" class="flex flex-col items-center justify-center gap-4">
        <logo></logo>
        <p class="text-2xl text-neutral-900 font-bold leading-none">Rabatino</p>
      </nuxt-link>

      <div class="flex items-center justify-center gap-6">
        <nuxt-link to="/" class="text-neutral-700 text-base font-normal">About</nuxt-link>
        <nuxt-link to="/" class="text-neutral-700 text-base font-normal">Education</nuxt-link>
        <nuxt-link to="/" class="text-neutral-700 text-base font-normal">Tourism</nuxt-link>
        <nuxt-link to="/" class="text-neutral-700 text-base font-normal">Business</nuxt-link>
        <nuxt-link to="/" class="text-neutral-700 text-base font-normal">Career</nuxt-link>
      </div>

      <p class="text-neutral-700 text-base font-normal">© 2025 Rabatino. All rights reserved.</p>

    </div>
  </footer>
</template>

<style scoped>

</style>