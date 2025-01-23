<script setup lang="ts">
import { ChevronRightIcon } from '@heroicons/vue/16/solid'
import { GlobeAltIcon, PhoneIcon, EnvelopeIcon, MapPinIcon, ClockIcon, CurrencyDollarIcon, ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/outline'
import type { Hotel } from '~/types/tourism'
import { TourismType } from '~/types/tourism'

const router = useRouter()
const route = useRoute();
const config = useRuntimeConfig()
const slug = route.params.slug;
const pending = ref(true);

const hotel = ref<Hotel | null>(null);

// Fetch hotel data
async function fetchHotel() {
  try {
    pending.value = true;
    const response = await fetch(`${config.public.apiBaseUrl}/tourism/hotels/${slug}`);
    if (!response.ok) throw new Error('Failed to fetch hotel');
    
    const data = await response.json();
    
    hotel.value = {
      ...data,
      id: String(data.id),
      createdAt: new Date(),
      userId: String(data.userId),
      type: data.tourismType as TourismType,
      images: [],
      rating: Number(data.rating),
      latitude: Number(data.latitude),
      longitude: Number(data.longitude)
    };
  } catch (error) {
    console.error('Error fetching hotel:', error);
    router.push('/404');
  } finally {
    pending.value = false;
  }
}

onMounted(() => {
  fetchHotel();
});

const amenityIcons = {
  'Free Wi-Fi': '📶',
  'Swimming Pool': '🏊‍♂️',
  'Spa & Wellness Center': '💆‍♂️',
  'Restaurant & Bar': '🍽️',
  'Fitness Center': '🏋️‍♂️',
  'Conference Rooms': '🤝',
  'Room Service': '🛎️',
  'Parking': '🅿️',
  'Concierge Service': '💁‍♂️',
  'Business Center': '💼'
}
</script>

<template>
  <main class="w-full flex flex-col items-center justify-center gap-10 mb-28 lg:my-10">
    <!-- Loading State -->
    <div v-if="pending" class="w-full h-[500px] flex items-center justify-center">
      <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-neutral-900"></div>
    </div>

    <!-- Content (Only shown when data is loaded) -->
    <template v-else-if="hotel">
      <!-- Featured Image Section -->
      <section class="w-full">
        <div class="w-full h-[500px] relative overflow-hidden rounded-2xl">
          <img 
            :src="hotel.featuredImage" 
            :alt="hotel.title"
            class="w-full h-full object-cover bg-gray-50"
          />
        </div>
      </section>

      <div class="w-full flex flex-col lg:flex-row items-start justify-between gap-4">
        <section class="lg:max-w-2xl flex flex-col gap-10 items-start justify-center">
          <!-- Title Section -->
          <div class="w-full flex flex-col items-start justify-start gap-2">
            <h2 class="first-letter:uppercase font-medium text-neutral-950 text-2xl leading-6">
              {{ hotel.title }}
            </h2>
            <div class="flex items-center gap-4">
              <span class="text-normal leading-none text-neutral-800">{{ TourismType.HOTEL }}</span>
              <span class="text-normal leading-none text-neutral-800">⭐ {{ hotel.rating }}/5</span>
            </div>
          </div>

          <!-- Key Information -->
          <div class="w-full grid grid-cols-2 gap-4 p-6 bg-neutral-50 rounded-lg">
            <div class="flex flex-col gap-2">
              <p class="font-medium">Check-in Time</p>
              <div class="flex items-center gap-2">
                <ClockIcon class="h-5 w-5 text-neutral-600" />
                <p>{{ hotel.checkInTime }}</p>
              </div>
            </div>
            <div class="flex flex-col gap-2">
              <p class="font-medium">Price Range</p>
              <div class="flex items-center gap-2">
                <CurrencyDollarIcon class="h-5 w-5 text-neutral-600" />
                <p>{{ hotel.priceRanges }}</p>
              </div>
            </div>
            <div class="flex flex-col gap-2">
              <p class="font-medium">Total Rooms</p>
              <p>{{ hotel.totalRooms }} rooms</p>
            </div>
            <div class="flex flex-col gap-2">
              <p class="font-medium">Room Types</p>
              <p>{{ hotel.roomTypes }}</p>
            </div>
          </div>

          <!-- Contact Information -->
          <div class="w-full flex flex-col gap-4 p-6 bg-neutral-50 rounded-lg">
            <h3 class="font-medium text-lg">Contact Information</h3>
            <div class="grid grid-cols-1 gap-4">
              <div class="flex items-start gap-2">
                <MapPinIcon class="h-5 w-5 text-neutral-600 mt-0.5" />
                <p class="text-neutral-900">{{ hotel.address }}</p>
              </div>
              <div v-if="hotel.website" class="flex items-center gap-2">
                <GlobeAltIcon class="h-5 w-5 text-neutral-600" />
                <a :href="`https://${hotel.website}`" 
                   target="_blank" 
                   class="text-blue-600 hover:underline">
                  {{ hotel.website }}
                </a>
              </div>
              <div v-if="hotel.phone" class="flex items-center gap-2">
                <PhoneIcon class="h-5 w-5 text-neutral-600" />
                <a :href="`tel:${hotel.phone}`" 
                   class="text-blue-600 hover:underline">
                  {{ hotel.phone }}
                </a>
              </div>
              <div v-if="hotel.email" class="flex items-center gap-2">
                <EnvelopeIcon class="h-5 w-5 text-neutral-600" />
                <a :href="`mailto:${hotel.email}`" 
                   class="text-blue-600 hover:underline">
                  {{ hotel.email }}
                </a>
              </div>
            </div>
          </div>

          <!-- Description -->
          <section class="w-full flex flex-col gap-6 items-start justify-center">
            <p class="text-neutral-950 font-medium text-2xl leading-6">About this hotel</p>
            <p class="max-w-2xl w-full text-normal leading-6 text-neutral-950">
              {{ hotel.description }}
            </p>
          </section>

          <!-- Amenities -->
          <section class="w-full flex flex-col gap-6 items-start justify-center">
            <p class="text-neutral-950 font-medium text-2xl leading-6">Hotel Amenities</p>
            <div class="grid grid-cols-2 gap-6">
              <div v-for="amenity in hotel.amenities" :key="amenity"
                   class="flex items-center justify-start gap-2">
                <span class="text-2xl">{{ amenityIcons[amenity] }}</span>
                <p class="text-normal leading-none text-neutral-950">{{ amenity }}</p>
              </div>
            </div>
          </section>
        </section>

        <!-- Right side section for booking widget -->
        <div class="lg:w-[400px] w-full sticky top-4">
      
        </div>
      </div>

      <!-- Map Location -->
      <section v-if="hotel.latitude && hotel.longitude" 
               class="w-full flex flex-col gap-6 items-start justify-center">
        <p class="text-neutral-950 font-medium text-2xl leading-6">Location</p>
        <div class="w-full bg-neutral-300 rounded-2xl h-96 overflow-hidden">
          <Map 
            :latitude="Number(hotel.latitude)" 
            :longitude="Number(hotel.longitude)" 
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