<script setup lang="ts">
import { ChevronRightIcon } from '@heroicons/vue/16/solid'
import { ClockIcon, TagIcon } from '@heroicons/vue/24/outline'
import type { BusinessPost } from '~/types/business'

const router = useRouter()
const route = useRoute();
const slug = route.params.slug;
const pending = ref(false);

const business = ref<BusinessPost>({
  id: '1',
  title: 'Local Business Growth Strategy for 2024',
  body: `In today's dynamic market, local businesses face unique challenges and opportunities. This comprehensive guide explores effective strategies for sustainable growth, customer retention, and digital transformation in the local business landscape.

Our analysis covers key areas including:
- Digital presence optimization
- Customer engagement strategies
- Local market analysis
- Community partnership opportunities
- Sustainable business practices

These insights are based on successful case studies and market research specific to our city's business environment.`,
  featuredImg: '/images/business-strategy.jpg',
  tags: [
    'Business Strategy',
    'Local Market',
    'Digital Marketing',
    'Growth',
    'Community Development'
  ],
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-15')
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
    <!-- Featured Image Section -->
    <section v-if="!pending" class="w-full">
      <div class="w-full h-[500px] relative overflow-hidden rounded-2xl">
        <img 
          :src="business.featuredImg" 
          :alt="business.title"
          class="w-full h-full object-cover bg-gray-50"
        />
      </div>
    </section>

    <div v-if="!pending" class="w-full flex flex-col lg:flex-row items-start justify-between gap-4">
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
               class="flex items-center gap-1 px-3 py-1 bg-neutral-50 rounded-full">
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

  </main>
</template>

<style scoped>
[data-radix-popper-content-wrapper] {
  @apply !top-2 !right-0;
}
</style>