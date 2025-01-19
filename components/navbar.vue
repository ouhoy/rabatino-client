<script setup lang="ts">

</script>

<template>
<nav class="w-full">
  <div class="flex justify-between items-center py-4 max-w-7xl mx-auto">
      <nuxt-link to="/" class="flex justify-start items-center gap-2 w-[265.55px]">
        <logo/>
        <h2 class="text-neutral-900 text-2xl font-semibold leading-none" >rabatino</h2>
      </nuxt-link>

    <div class="flex items-center justify-center gap-6">
      <nuxt-link to="/" class="text-neutral-900 text-base font-medium">Home</nuxt-link>
      <nuxt-link to="/" class="text-neutral-900 text-base font-medium">Education</nuxt-link>
      <nuxt-link to="/" class="text-neutral-900 text-base font-medium">Tourism</nuxt-link>
      <nuxt-link to="/" class="text-neutral-900 text-base font-medium">Business</nuxt-link>
      <nuxt-link to="/" class="text-neutral-900 text-base font-medium">Career</nuxt-link>
    </div>
    <div class="flex items-center justify-center gap-2">
      <nuxt-link to="/" class="text-neutral-900 p-3 px-6 text-base font-medium" >Login</nuxt-link>
      <nuxt-link to="/" class="bg-neutral-900 text-white p-3 px-6 text-base font-medium rounded-full" >Create Account</nuxt-link>
    </div>
  </div>
</nav>
</template>

<style scoped>

</style>