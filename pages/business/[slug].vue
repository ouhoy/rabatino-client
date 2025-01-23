<script setup lang="ts">
import { ChevronRightIcon } from '@heroicons/vue/16/solid'
import { ClockIcon, TagIcon } from '@heroicons/vue/24/outline'
import type { BusinessPost } from '~/types/business'

const router = useRouter()
const route = useRoute();
const config = useRuntimeConfig()
const slug = route.params.slug;
const pending = ref(true);

const business = ref<BusinessPost | null>(null);

// Fetch business post data
async function fetchBusinessPost() {
  try {
    pending.value = true;
    const response = await fetch(`${config.public.apiBaseUrl}/business/${slug}`);
    if (!response.ok) throw new Error('Failed to fetch business post');
    const data = await response.json();
    business.value = {
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt)
    };
  } catch (error) {
    console.error('Error fetching business post:', error);
    router.push('/404');
  } finally {
    pending.value = false;
  }
}

onMounted(() => {
  fetchBusinessPost();
});

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}
</script>

<template>
  <main class="w-full flex flex-col items-center justify-center gap-10 mb-28 lg:my-10">
    <!-- Loading State -->
    <div v-if="pending" class="w-full h-[500px] flex items-center justify-center">
      <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-neutral-900"></div>
    </div>

    <!-- Content (Only shown when data is loaded) -->
    <template v-else-if="business">
      <!-- Featured Image Section -->
      <section class="w-full">
        <div class="w-full h-[500px] relative overflow-hidden rounded-2xl">
          <img 
            :src="business.featuredImg" 
            :alt="business.title"
            class="w-full h-full object-cover bg-gray-50"
          />
        </div>
      </section>

      <div class="w-full flex flex-col lg:flex-row items-start justify-between gap-4">
        <section class="lg:max-w-2xl flex flex-col gap-10 items-start justify-center">
          <!-- Title Section -->
          <div class="w-full flex flex-col items-start justify-start gap-4">
            <h1 class="first-letter:uppercase font-medium text-neutral-950 text-3xl leading-tight">
              {{ business.title }}
            </h1>
            <div class="flex items-center gap-4 text-neutral-600">
              <div class="flex items-center gap-2">
                <ClockIcon class="h-5 w-5" />
                <span class="text-sm">Published {{ formatDate(business.createdAt) }}</span>
              </div>
            </div>
          </div>

          <!-- Tags Section -->
          <div class="w-full flex flex-wrap gap-2">
            <div v-for="tag in business.tags" 
                 :key="tag"
                 class="flex items-center gap-2 px-3 py-1 bg-neutral-50 rounded-full whitespace-nowrap">
              <TagIcon class="h-4 w-4 text-neutral-600" />
              <span class="text-sm text-neutral-600">{{ tag }}</span>
            </div>
          </div>

          <!-- Content Section -->
          <article class="w-full prose prose-neutral max-w-none">
            <p class="whitespace-pre-line text-neutral-800">
              {{ business.body }}
            </p>
          </article>

        </section>

      </div>
    </template>
  </main>
</template>

<style scoped>
[data-radix-popper-content-wrapper] {
  @apply !top-2 !right-0;
}
</style>