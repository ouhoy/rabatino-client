<script setup lang="ts">
import Card from "./card.vue";
import {ref, onMounted, onUnmounted} from 'vue';
import {ChevronRightIcon, ChevronLeftIcon} from '@heroicons/vue/16/solid';
import JobCard from "./JobCard.vue";

interface postCard {
  id: number,
  title: string,
  logo: string,
  company: string,
}

defineProps<{
  title: string,
  description: string,
  posts: postCard[],
  viewAllRoute?: string // Add this prop
}>()

const scrollContainer = ref<HTMLElement | null>(null);
const showLeftGradient = ref(false);
const showRightGradient = ref(true);

const scrollAmount = 800; // Approximately 3 cards width

const scrollLeft = () => {
  if (!scrollContainer.value) return;
  scrollContainer.value.scrollBy({
    left: -scrollAmount,
    behavior: 'smooth'
  });
};

const scrollRight = () => {
  if (!scrollContainer.value) return;
  scrollContainer.value.scrollBy({
    left: scrollAmount,
    behavior: 'smooth'
  });
};

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
      <nuxt-link 
        :to="viewAllRoute || '/'" 
        class="text-neutral-900 text-base font-medium flex items-center justify-center"
      >
        More {{ title.toLowerCase() }} posts
        <ChevronRightIcon class="size-5"/>
      </nuxt-link>

    </div>

    <!-- Left scroll button and gradient -->
    <div class="absolute left-0 top-0 h-full z-[100] flex items-center">
      <div v-show="showLeftGradient"
           class="w-16 h-full bg-gradient-to-r from-white to-transparent transition-opacity duration-300 ease-in-out"
           :class="showLeftGradient ? 'opacity-100' : 'opacity-0'">
      </div>
      <button v-show="showLeftGradient"
              @click="scrollLeft"
              class="absolute left-0 p-2 rounded-full bg-white shadow-sm border border-1 border-neutral-200 hover:bg-gray-50 transition-all">
        <ChevronLeftIcon class="size-5 text-neutral-900"/>
      </button>
    </div>

    <div ref="scrollContainer"
         class="w-full flex items-center justify-start gap-8 overflow-x-scroll no-scrollbar ">
         <SkeletonCard  v-for="item in Array.from({length: 7})" v-if="!posts.length"/>

      <nuxt-link 
        v-for="post in posts" 
        :key="post.id"
        :to="`/career/${post.id}`"
      >
        <JobCard
          :title="post.title"
          :logo="post.logo"
          :company="post.company"
        />
      </nuxt-link>
    </div>

    <!-- Right scroll button and gradient -->
    <div class="absolute right-0 top-0 h-full z-[100] flex items-center">
      <div v-show="showRightGradient"
           class="w-16 h-full bg-gradient-to-l from-white to-transparent transition-opacity duration-300 ease-in-out"
           :class="showRightGradient ? 'opacity-100' : 'opacity-0'">
      </div>
      <button v-show="showRightGradient"
              @click="scrollRight"
              class="absolute right-0 p-2 rounded-full bg-white shadow-sm border border-1 border-neutral-200 hover:bg-gray-50 transition-all">
        <ChevronRightIcon class="size-5 text-neutral-900"/>
      </button>
    </div>

  </div>
</template>


<style scoped>

</style>
<style scoped>

</style>