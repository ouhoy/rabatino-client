<script setup lang="ts">

import {MagnifyingGlassIcon} from '@heroicons/vue/16/solid';

const searchInputValue = ref('');


</script>

<template>
  <main class="-w-full">

    <!-- HERO_SECTION -->
    <section class="w-full flex flex-col items-center justify-center gap-4 py-36">
      <div class="flex text-center flex-col items-center justify-center gap-4 max-w-xl mx-auto">
        <h1 class="text-7xl text-neutral-900 leading-[80px] font-medium">Discover Rabat<br/>the City of Light</h1>
        <p class="text-lg text-neutral-800">Explore the perfect blend of timeless heritage and cutting-edge innovation
          in Morocco’s capital.</p>
      </div>
      <div class="w-full flex items-center justify-between p-2 h-14 border border-1 rounded-full border-neutral-300 bg-neutral-50/50 mx-auto  max-w-2xl">

        <input


            v-model="searchInputValue"

            type="text"
            class="bg-neutral-50 p-2 w-full max-w-[95%] mx-auto block outline-none border-0 text-neutral-900 placeholder:text-neutral-500 placeholder:text-sm"
            placeholder="What are you looking for?">

        <button
                class="p-3 bg-blue-600 flex items-center justify-center rounded-full ">
          <MagnifyingGlassIcon class="w-4 h-4 text-white"/>
        </button>
      </div>
    </section>

    <section class="w-full">
      <div class="w-full flex flex-col items-start justify-start gap-8">

        <!-- EVENTS_HEADER -->
        <div class="w-full flex items-start justify-between">

          <div class="flex  flex-col items-start justify-start gap-2">
            <h3 class="text-neutral-900 text-2xl font-semibold leading-none">Education</h3>
            <p class="text-neutral-700 text-base font-normal leading-none">Anything related to education and studying</p>
          </div>
          <nuxt-link to="/" class="text-neutral-900 text-base font-medium">More education posts</nuxt-link>

        </div>

        <div class="w-full pl-28 flex items-center justify-center gap-8 overflow-x-scroll no-scrollbar">
          <card v-for="item in Array.from({length:4})" title="The Ultimate Guide to Rabat" :price="0" imgUrl="https://images.unsplash.com/photo-1612838320302-3b3b3b3b3b3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyMjIwNzV8MHwxfGFsbHwxf"/>
        </div>

      </div>
    </section>
  </main>
</template>

<style scoped>
h1 {
  font-family: Alegreya;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>