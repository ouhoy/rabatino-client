<script setup lang="ts">


import Card from "./card.vue";

interface postCard {
  title: string,
  imgUrl: string,
}

defineProps<{
  title: string,
  description: string,
  posts: postCard[],
}>()


</script>

<template>
  <div class="w-full flex flex-col items-start justify-start gap-8">

    <!-- EVENTS_HEADER -->
    <div class="w-full flex items-start justify-between">

      <div class="flex  flex-col items-start justify-start gap-2">
        <h3 class="text-neutral-900 text-2xl font-semibold leading-none first-letter:uppercase">{{title}}</h3>
        <p class="text-neutral-700 text-base font-normal leading-none first-letter:uppercase">{{description}}</p>
      </div>
      <nuxt-link to="/" class="text-neutral-900 text-base font-medium">More {{ title.toLowerCase()}} posts</nuxt-link>

    </div>

    <div class="w-full pl-24 flex items-center justify-center gap-8 overflow-x-scroll no-scrollbar">
      <card v-for="post in posts" :title="post.title"  :imgUrl="post.imgUrl"/>
    </div>

  </div>
</template>

<style scoped>

</style>