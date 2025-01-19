<script setup lang="ts">

import {MagnifyingGlassIcon, ChevronRightIcon} from '@heroicons/vue/16/solid';
import SliderSection from "../components/SliderSection.vue";

const searchInputValue = ref('');

const fakePosts = [
  {
    title: "The Ultimate Guide to Rabat",
    imgUrl: "https://images.unsplash.com/photo-1612838320302-3b3b3b3b3b3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyMjIwNzV8MHwxfGFsbHwxf"
  },
  {
    title: "The Ultimate Guide to Rabat",
    imgUrl: "https://images.unsplash.com/photo-1612838320302-3b3b3b3b3b3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyMjIwNzV8MHwxfGFsbHwxf"
  },
  {
    title: "The Ultimate Guide to Rabat",
    imgUrl: "https://images.unsplash.com/photo-1612838320302-3b3b3b3b3b3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyMjIwNzV8MHwxfGFsbHwxf"
  },
  {
    title: "The Ultimate Guide to Rabat",
    imgUrl: "https://images.unsplash.com/photo-1612838320302-3b3b3b3b3b3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyMjIwNzV8MHwxfGFsbHwxf"
  },
  {
    title: "The Ultimate Guide to Rabat",
    imgUrl: "https://images.unsplash.com/photo-1612838320302-3b3b3b3b3b3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyMjIwNzV8MHwxfGFsbHwxf"
  },
  {
    title: "The Ultimate Guide to Rabat",
    imgUrl: "https://images.unsplash.com/photo-1612838320302-3b3b3b3b3b3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyMjIwNzV8MHwxfGFsbHwxf"
  },
  {
    title: "Exploring Rabat's Medina",
    imgUrl: "https://images.unsplash.com/photo-1612838320302-3b3b3b3b3b3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyMjIwNzV8MHwxfGFsbHwxf"
  },
  {
    title: "Top 10 Restaurants in Rabat",
    imgUrl: "https://images.unsplash.com/photo-1612838320302-3b3b3b3b3b3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyMjIwNzV8MHwxfGFsbHwxf"
  },
  {
    title: "Rabat's Historical Sites",
    imgUrl: "https://images.unsplash.com/photo-1612838320302-3b3b3b3b3b3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyMjIwNzV8MHwxfGFsbHwxf"
  },
  {
    title: "A Day in Rabat",
    imgUrl: "https://images.unsplash.com/photo-1612838320302-3b3b3b3b3b3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyMjIwNzV8MHwxfGFsbHwxf"
  },
  {
    title: "Rabat's Nightlife",
    imgUrl: "https://images.unsplash.com/photo-1612838320302-3b3b3b3b3b3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyMjIwNzV8MHwxfGFsbHwxf"
  },
  {
    title: "Shopping in Rabat",
    imgUrl: "https://images.unsplash.com/photo-1612838320302-3b3b3b3b3b3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyMjIwNzV8MHwxfGFsbHwxf"
  },
  {
    title: "Rabat's Best Parks",
    imgUrl: "https://images.unsplash.com/photo-1612838320302-3b3b3b3b3b3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyMjIwNzV8MHwxfGFsbHwxf"
  }
];

</script>

<template>
  <main class="-w-full">

    <!-- HERO_SECTION -->
    <section class="w-full flex flex-col items-center justify-center gap-4 py-36">
      <div class="flex text-center flex-col items-center justify-center gap-4 max-w-xl mx-auto">
        <h1 class="text-7xl text-neutral-900 leading-[80px] font-medium">Discover Rabat<br/>the City of Light</h1>
        <p class="text-lg text-neutral-700">Explore the perfect blend of timeless heritage and cutting-edge innovation
          in Morocco’s capital.</p>
      </div>
      <div
          class="w-full flex items-center justify-between p-2 h-14 border border-1 rounded-full border-neutral-300 bg-neutral-50/50 mx-auto  max-w-2xl">

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

    <section class="w-full flex flex-col items-start justify-start gap-12">

      <SliderSection title="Education" description="Anything related to education and studying" :posts="fakePosts"/>
      <SliderSection title="Tourism" description="Anything related to education and studying" :posts="fakePosts"/>
      <SliderSection title="Career" description="Anything related to education and studying" :posts="fakePosts"/>
      <SliderSection title="Business" description="Anything related to education and studying" :posts="fakePosts"/>
    </section>
  </main>
</template>

<style scoped>
h1 {
  font-family: Alegreya;
}

</style>