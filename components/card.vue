<script setup lang="ts">
const props = defineProps<{
  title: string,
  imgUrl: string,
}>()

const truncatedTitle = computed(() => {
  return props.title.length > 32 ? props.title.slice(0, 32) + '...' : props.title
})
</script>

<template>
  <div class="w-full  flex flex-col gap-4 cursor-pointer ">

    <!-- CARD TOP CONTAINER -->
    <div class="relative w-full">

      <!-- CARD TOP BUTTONS -->
      <div class="absolute p-2 w-full flex items-center justify-between">
        <div></div>
      </div>

      <!-- IMG CONTAINER -->
      <div style="width: 100%; padding-top: 66.66%; position: relative; overflow: hidden;">
        <img loading="lazy" class="rounded-xl object-cover bg-neutral-100"
             style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" :src="imgUrl" :alt="title"/>
      </div>

    </div>

    <!-- CARD DESCRIPTION -->
    <div class="w-full flex items-center justify-between gap-2 min-w-80">
      <h2 class="truncate  font-medium text-base text-neutral-900 first-letter:uppercase">{{ truncatedTitle }}</h2>
<!--      <p v-if="price" class="text-normal text-neutral-900 whitespace-nowrap"><span class="font-medium">{{ Math.floor(price) }}MAD</span> night</p>-->
    </div>

  </div>
</template>

