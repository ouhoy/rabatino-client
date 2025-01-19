<script setup lang="ts">
defineProps<{
  title: string,
  description: string,
}>()
</script>

<template>
  <header class="w-full flex flex-col items-center justify-center text-center gap-6 max-w-3xl mx-auto">
    <h2 class="text-neutral-900 text-[32px] leading-none font-bold  first-letter:uppercase">{{title}}</h2>
    <p class="text-neutral-700 text-base text-normal first-letter:uppercase">{{description}}</p>
  </header>
</template>

<style scoped>

</style>