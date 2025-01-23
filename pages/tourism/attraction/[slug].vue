<script setup lang="ts">
import { ChevronRightIcon } from '@heroicons/vue/16/solid'
import { GlobeAltIcon, PhoneIcon, EnvelopeIcon, MapPinIcon } from '@heroicons/vue/24/outline'
import type { TouristAttraction } from '~/types/tourism'
import { TourismType } from '~/types/tourism'

const router = useRouter()
const route = useRoute();
const config = useRuntimeConfig()
const slug = route.params.slug;
const pending = ref(true);

const attraction = ref<TouristAttraction | null>(null);

// Fetch attraction data
async function fetchAttraction() {
  try {
    pending.value = true;
    const response = await fetch(`${config.public.apiBaseUrl}/tourism/attractions/${slug}`);
    if (!response.ok) throw new Error('Failed to fetch attraction');
    
    const data = await response.json();
    
    attraction.value = {
      ...data,
      id: String(data.id),
      createdAt: new Date(),
      userId: String(data.userId),
      type: data.tourismType as TourismType,
      images: [],
      rating: Number(data.rating),
      entryFee: Number(data.entryFee),
      latitude: Number(data.latitude),
      longitude: Number(data.longitude)
    };
  } catch (error) {
    console.error('Error fetching attraction:', error);
    router.push('/404');
  } finally {
    pending.value = false;
  }
}

onMounted(() => {
  fetchAttraction();
});
</script>

<template>
  <main class="w-full flex flex-col items-center justify-center gap-10 mb-28 lg:my-10">
    <!-- Loading State -->
    <div v-if="pending" class="w-full h-[500px] flex items-center justify-center">
      <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-neutral-900"></div>
    </div>

    <!-- Content (Only shown when data is loaded) -->
    <template v-else-if="attraction">
      <!-- Featured Image Section -->
      <section class="w-full">
        <div class="w-full h-[500px] relative overflow-hidden rounded-2xl">
          <img
              :src="attraction.featuredImage"
              :alt="attraction.title"
              class="w-full h-full object-cover bg-gray-50"
          />
        </div>
      </section>

      <div class="w-full flex flex-col lg:flex-row items-start justify-between gap-4">
        <section class="lg:max-w-2xl flex flex-col gap-10 items-start justify-center">
          <!-- Title Section -->
          <div class="w-full flex flex-col items-start justify-start gap-2">
            <h2 class="first-letter:uppercase font-medium text-neutral-950 text-2xl leading-6">
              {{ attraction.title }}
            </h2>
            <div class="flex items-center gap-4">
              <span class="text-normal leading-none text-neutral-800">{{ attraction.attractionType }}</span>
              <span class="text-normal leading-none text-neutral-800">⭐ {{ attraction.rating }}/5</span>
            </div>
          </div>

          <!-- Key Information -->
          <div class="w-full grid grid-cols-2 gap-4 p-6 bg-neutral-50 rounded-lg">
            <div class="flex flex-col gap-2">
              <p class="font-medium">Opening Hours</p>
              <p>{{ attraction.openingHours }}</p>
            </div>
            <div class="flex flex-col gap-2">
              <p class="font-medium">Entry Fee</p>
              <p>${{ attraction.entryFee.toFixed(2) }}</p>
            </div>
            <div class="flex flex-col gap-2">
              <p class="font-medium">Best Time to Visit</p>
              <p>{{ attraction.bestVisitTime }}</p>
            </div>
            <div class="flex flex-col gap-2">
              <p class="font-medium">Guided Tours</p>
              <p>{{ attraction.guideTours ? 'Available' : 'Not Available' }}</p>
            </div>
          </div>

          <!-- Contact Information with Heroicons -->
          <div class="w-full flex flex-col gap-4 p-6 bg-neutral-50 rounded-lg">
            <h3 class="font-medium text-lg">Contact Information</h3>
            <div class="grid grid-cols-1 gap-4">
              <div class="flex items-start gap-2">
                <MapPinIcon class="h-5 w-5 text-neutral-600 mt-0.5" />
                <p class="text-neutral-900">{{ attraction.address }}</p>
              </div>
              <div v-if="attraction.website" class="flex items-center gap-2">
                <GlobeAltIcon class="h-5 w-5 text-neutral-600" />
                <a :href="`https://${attraction.website}`"
                   target="_blank"
                   class="text-blue-600 hover:underline">
                  {{ attraction.website }}
                </a>
              </div>
              <div v-if="attraction.phone" class="flex items-center gap-2">
                <PhoneIcon class="h-5 w-5 text-neutral-600" />
                <a :href="`tel:${attraction.phone}`"
                   class="text-blue-600 hover:underline">
                  {{ attraction.phone }}
                </a>
              </div>
              <div v-if="attraction.email" class="flex items-center gap-2">
                <EnvelopeIcon class="h-5 w-5 text-neutral-600" />
                <a :href="`mailto:${attraction.email}`"
                   class="text-blue-600 hover:underline">
                  {{ attraction.email }}
                </a>
              </div>
            </div>
          </div>

          <!-- Description -->
          <section class="w-full flex flex-col gap-6 items-start justify-center">
            <p class="text-neutral-950 font-medium text-2xl leading-6">About this attraction</p>
            <p class="max-w-2xl line-clamp-6 w-full text-normal leading-6 text-neutral-950 text-ellipsis">
              {{ attraction.description }}
            </p>
          </section>


        </section>

        <!-- Right side section for booking/contact information if needed -->
        <div class="lg:w-[400px] w-full">
          <!-- Add booking or additional information components here -->
        </div>
      </div>

      <!-- Map Location -->
      <section v-if="attraction.latitude && attraction.longitude" 
               class="w-full flex flex-col gap-6 items-start justify-center">
        <p class="text-neutral-950 font-medium text-2xl leading-6">Where will you be</p>
        <div class="w-full bg-neutral-300 rounded-2xl h-96 overflow-hidden">
          <Map 
            :latitude="Number(attraction.latitude)" 
            :longitude="Number(attraction.longitude)" 
          />
        </div>
      </section>
    </template>
  </main>
</template>

<style scoped>
[data-radix-popper-content-wrapper] {
  @apply !top-2 !right-0;
}
</style>