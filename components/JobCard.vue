<script setup lang="ts">
defineProps<{
  title: string,
  logo: string,

}>()


</script>

<template>
  <div class="w-full flex flex-col gap-4 cursor-pointer group">
    <!-- CARD TOP CONTAINER -->
    <div class="relative w-full">
      <!-- CARD TOP BUTTONS -->
      <div class="absolute p-2 w-full flex items-center justify-between z-10">
        <div></div>
      </div>

      <!-- IMG CONTAINER -->
      <div style="width: 100%; padding-top: 66.66%; position: relative; overflow: hidden;">
        <div class="absolute top-0 left-0 w-full h-full rounded-xl 
                    bg-gradient-to-tr from-pink-200 via-indigo-200 to-sky-200
                    flex items-center justify-center transform transition-transform duration-300 group-hover:scale-[1.02]">
          <img 
            :src="logo" 
            :alt="'Company Logo'"
            class="w-12 h-12 object-contain bg-white rounded-lg p-1 shadow-sm"
          />
         
        </div>
      </div>
    </div>

    <!-- CARD DESCRIPTION -->
    <div class="w-full flex items-center justify-between gap-2 min-w-80">
      <h2 class="truncate font-medium text-base text-neutral-900 first-letter:uppercase">
        {{ title }}
      </h2>
    </div>
  </div>
</template>
