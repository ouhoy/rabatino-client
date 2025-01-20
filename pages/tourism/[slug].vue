<script setup lang="ts">
import { ChevronRightIcon } from '@heroicons/vue/16/solid'
import { GlobeAltIcon, PhoneIcon, EnvelopeIcon, MapPinIcon } from '@heroicons/vue/24/outline'
import type { TouristAttraction } from '~/types/tourism'
import { TourismType } from '~/types/tourism'

const router = useRouter()
const route = useRoute();
const slug = route.params.slug;
const pending = ref(false);

const attraction = ref<TouristAttraction>({
  id: '1',
  title: 'Historical Museum of Art',
  description: 'A beautiful museum showcasing local and international art pieces spanning several centuries. The museum features rotating exhibitions, permanent collections, and interactive displays.',
  images: ['/images/museum-main.jpg'],
  createdAt: new Date(),
  userId: '1',
  isActive: true,
  rating: 4.5,
  type: TourismType.ATTRACTION,
  attractionType: 'Museum',
  bestVisitTime: 'Morning to Early Afternoon',
  entryFee: 15.00,
  openingHours: '9:00 AM - 6:00 PM',
  guideTours: true,
  website: 'www.museum-of-art.com',
  phone: '+1 (555) 123-4567',
  email: 'info@museum-of-art.com',
  address: '123 Museum Street, Art District, City, 12345',
  featuredImage: '/images/museum-featured.jpg',
});

const amenities = [
  { icon: '🎫', name: 'Ticket Required' },
  { icon: '🚻', name: 'Restrooms' },
  { icon: '🦽', name: 'Wheelchair Accessible' },
  { icon: '📸', name: 'Photography Allowed' },
  { icon: '🅿️', name: 'Parking Available' },
  { icon: '👤', name: 'Guide Tours Available' },
  { icon: '🍽️', name: 'Café' },
  { icon: '🎁', name: 'Gift Shop' },
]
</script>

<template>
  <main class="w-full flex flex-col items-center justify-center gap-10 mb-28 lg:my-10">
    <!-- Featured Image Section -->
    <section v-if="!pending" class="w-full">
      <div class="w-full h-[500px] relative overflow-hidden rounded-2xl">
        <img 
          :src="attraction.featuredImage" 
          :alt="attraction.title"
          class="w-full h-full object-cover bg-gray-50"
        />
      </div>
    </section>

    <div v-if="!pending" class="w-full flex flex-col lg:flex-row items-start justify-between gap-4">
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

        <!-- Amenities -->
        <section class="w-full flex flex-col gap-6 items-start justify-center">
          <p class="text-neutral-950 font-medium text-2xl leading-6">Amenities</p>
          <div class="grid grid-cols-2 gap-6">
            <div v-for="amenity in amenities" :key="amenity.name"
                 class="flex items-center justify-start gap-2">
              <span class="text-2xl">{{ amenity.icon }}</span>
              <p class="text-normal leading-none text-neutral-950">{{ amenity.name }}</p>
            </div>
          </div>
        </section>
      </section>

      <!-- Right side section for booking/contact information if needed -->
      <div class="lg:w-[400px] w-full">
        <!-- Add booking or additional information components here -->
      </div>
    </div>

    <!-- SPACE MAP LOCATION -->
    <section v-if="!pending" class="w-full flex flex-col gap-6 items-start justify-center">
      <p class="text-neutral-950 font-medium text-2xl leading-6">Where will you be</p>

      <div class="w-full bg-neutral-300 rounded-2xl h-96"></div>

    </section>
  </main>
</template>

<style scoped>
[data-radix-popper-content-wrapper] {
  @apply !top-2 !right-0;
}
</style>