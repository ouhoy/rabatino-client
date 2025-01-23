<script setup lang="ts">
// No props needed for skeleton
</script>

<template>
  <div class="w-full flex flex-col gap-4 animate-pulse">
    <!-- CARD TOP CONTAINER -->
    <div class="relative w-full">
      <!-- IMG CONTAINER -->
      <div style="width: 100%; padding-top: 66.66%; position: relative; overflow: hidden;">
        <div class="absolute top-0 left-0 w-full h-full rounded-xl bg-neutral-200"></div>
      </div>
    </div>

    <!-- SKELETON TITLE -->
    <div class="w-full flex items-center justify-between gap-2 min-w-80">
      <div class="h-5 bg-neutral-200 rounded w-3/4"></div>
    </div>
  </div>
</template>

<style scoped>
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}
</style>