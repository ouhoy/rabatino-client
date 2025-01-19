<script setup lang="ts">


const searchInputValue = ref('');


</script>

<template>
  <main class="-w-full">
    <section class="w-full flex flex-col items-center justify-center gap-4 py-36">
      <div class="flex text-center flex-col items-center justify-center gap-4 max-w-xl mx-auto">
        <h1 class="text-7xl text-neutral-900 leading-[80px] font-medium">Discover Rabat<br/>the City of Light</h1>
        <p class="text-lg text-neutral-800">Explore the perfect blend of timeless heritage and cutting-edge innovation in Morocco’s capital.</p>
      </div>
      <div class="w-full py-2 h-14 border border-1 rounded-full border-neutral-300 bg-neutral-50/50 mx-auto  max-w-2xl">

        <input


            v-model="searchInputValue"

            type="text"
            class="bg-neutral-50 p-2 w-full max-w-[95%] mx-auto block outline-none border-0 text-neutral-900 placeholder:text-neutral-500 placeholder:text-sm"
            placeholder="What are you looking for?">
      </div>
    </section>
  </main>
</template>

<style scoped>
h1 {
  font-family: Alegreya;
}
</style>