<script setup lang="ts">
import Card from "./card.vue";
import {ref, onMounted, onUnmounted} from 'vue';

interface postCard {
  title: string,
  imgUrl: string,
}

defineProps<{
  title: string,
  description: string,
  posts: postCard[],
}>()

const scrollContainer = ref<HTMLElement | null>(null);
const showLeftGradient = ref(false);
const showRightGradient = ref(true);

const checkScroll = () => {
  if (!scrollContainer.value) return;
  const {scrollLeft, scrollWidth, clientWidth} = scrollContainer.value;
  showLeftGradient.value = scrollLeft > 0;
  showRightGradient.value = scrollLeft < (scrollWidth - clientWidth - 1);
};

onMounted(() => {
  if (scrollContainer.value) {
    scrollContainer.value.addEventListener('scroll', checkScroll);
  }
});

onUnmounted(() => {
  if (scrollContainer.value) {
    scrollContainer.value.removeEventListener('scroll', checkScroll);
  }
});
</script>

<template>
  <div class="w-full flex flex-col items-start justify-start gap-8 relative">

    <!-- EVENTS_HEADER -->
    <div class="w-full flex items-start justify-between relative z-[120]">

      <div class="flex  flex-col items-start justify-start gap-2">
        <h3 class="text-neutral-900 text-2xl font-semibold leading-none first-letter:uppercase">{{ title }}</h3>
        <p class="text-neutral-700 text-base font-normal leading-none first-letter:uppercase">{{ description }}</p>
      </div>
      <nuxt-link to="/" class="text-neutral-900 text-base font-medium">More {{ title.toLowerCase() }} posts</nuxt-link>

    </div>

    <div v-if="showLeftGradient"
         class="absolute left-0 top-0 w-16 h-full bg-gradient-to-r from-white to-transparent z-[100]"></div>
    <div ref="scrollContainer"
         class="w-full pl-24 flex items-center justify-center gap-8 overflow-x-scroll no-scrollbar ">
      <card v-for="post in posts" :title="post.title" :imgUrl="post.imgUrl"/>
    </div>
    <div v-if="showRightGradient"
         class="absolute right-0 top-0 w-16 h-full bg-gradient-to-l from-white to-transparent z-[100]"></div>

  </div>
</template>

<style scoped>

</style>