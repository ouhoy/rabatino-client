<script setup lang="ts">
import { ChevronRightIcon } from '@heroicons/vue/16/solid'
import { GlobeAltIcon, PhoneIcon, EnvelopeIcon, MapPinIcon, ClockIcon, CurrencyDollarIcon, TruckIcon, ShoppingBagIcon } from '@heroicons/vue/24/outline'
import type { Restaurant } from '~/types/tourism'
import { TourismType } from '~/types/tourism'

const router = useRouter()
const route = useRoute();
const slug = route.params.slug;
const pending = ref(false);

const restaurant = ref<Restaurant>({
  // Post interface fields
  id: '1',
  title: 'La Maison Bistro',
  description: 'Experience authentic French cuisine in a cozy atmosphere. Our chef brings traditional recipes with a modern twist, using locally sourced ingredients.',
  images: ['/images/restaurant-main.jpg'],
  createdAt: new Date(),
  userId: '1',
  address: '456 Culinary Street, Restaurant District, City, 12345',
  latitude: 40.7128,
  longitude: -74.0060,
  website: 'www.lamaisonbistro.com',
  phone: '+1 (555) 234-5678',
  email: 'reservations@lamaisonbistro.com',
  featuredImage: '/images/restaurant-featured.jpg',

  // Tourism interface fields
  isActive: true,
  rating: 4.7,
  type: TourismType.RESTAURANT,

  // Restaurant specific fields
  cuisine: 'French, European',
  priceRanges: '$30 - $80 per person',
  menus: 'Breakfast, Lunch, Dinner, Wine List',
  openiningHours: '11:00 AM - 11:00 PM',
  takout: true,
  delivery: true
});

</script>

<template>
  <main class="w-full flex flex-col items-center justify-center gap-10 mb-28 lg:my-10">
    <!-- Featured Image Section -->
    <section v-if="!pending" class="w-full">
      <div class="w-full h-[500px] relative overflow-hidden rounded-2xl">
        <img 
          :src="restaurant.featuredImage" 
          :alt="restaurant.title"
          class="w-full h-full object-cover bg-gray-50"
        />
      </div>
    </section>

    <div v-if="!pending" class="w-full flex flex-col lg:flex-row items-start justify-between gap-4">
      <section class="lg:max-w-2xl flex flex-col gap-10 items-start justify-center">
        <!-- Title Section -->
        <div class="w-full flex flex-col items-start justify-start gap-2">
          <h2 class="first-letter:uppercase font-medium text-neutral-950 text-2xl leading-6">
            {{ restaurant.title }}
          </h2>
          <div class="flex items-center gap-4">
            <span class="text-normal leading-none text-neutral-800">{{ restaurant.cuisine }}</span>
            <span class="text-normal leading-none text-neutral-800">⭐ {{ restaurant.rating }}/5</span>
          </div>
        </div>

        <!-- Key Information -->
        <div class="w-full grid grid-cols-2 gap-4 p-6 bg-neutral-50 rounded-lg">
          <div class="flex flex-col gap-2">
            <p class="font-medium">Opening Hours</p>
            <div class="flex items-center gap-2">
              <ClockIcon class="h-5 w-5 text-neutral-600" />
              <p>{{ restaurant.openiningHours }}</p>
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <p class="font-medium">Price Range</p>
            <div class="flex items-center gap-2">
              <CurrencyDollarIcon class="h-5 w-5 text-neutral-600" />
              <p>{{ restaurant.priceRanges }}</p>
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <p class="font-medium">Takeout</p>
            <div class="flex items-center gap-2">
              <ShoppingBagIcon class="h-5 w-5 text-neutral-600" />
              <p>{{ restaurant.takout ? 'Available' : 'Not Available' }}</p>
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <p class="font-medium">Delivery</p>
            <div class="flex items-center gap-2">
              <TruckIcon class="h-5 w-5 text-neutral-600" />
              <p>{{ restaurant.delivery ? 'Available' : 'Not Available' }}</p>
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <p class="font-medium">Available Menus</p>
            <p>{{ restaurant.menus }}</p>
          </div>
        </div>

        <!-- Contact Information -->
        <div class="w-full flex flex-col gap-4 p-6 bg-neutral-50 rounded-lg">
          <h3 class="font-medium text-lg">Contact Information</h3>
          <div class="grid grid-cols-1 gap-4">
            <div class="flex items-start gap-2">
              <MapPinIcon class="h-5 w-5 text-neutral-600 mt-0.5" />
              <p class="text-neutral-900">{{ restaurant.address }}</p>
            </div>
            <div v-if="restaurant.website" class="flex items-center gap-2">
              <GlobeAltIcon class="h-5 w-5 text-neutral-600" />
              <a :href="`https://${restaurant.website}`" 
                 target="_blank" 
                 class="text-blue-600 hover:underline">
                {{ restaurant.website }}
              </a>
            </div>
            <div v-if="restaurant.phone" class="flex items-center gap-2">
              <PhoneIcon class="h-5 w-5 text-neutral-600" />
              <a :href="`tel:${restaurant.phone}`" 
                 class="text-blue-600 hover:underline">
                {{ restaurant.phone }}
              </a>
            </div>
            <div v-if="restaurant.email" class="flex items-center gap-2">
              <EnvelopeIcon class="h-5 w-5 text-neutral-600" />
              <a :href="`mailto:${restaurant.email}`" 
                 class="text-blue-600 hover:underline">
                {{ restaurant.email }}
              </a>
            </div>
          </div>
        </div>

        <!-- Description -->
        <section class="w-full flex flex-col gap-6 items-start justify-center">
          <p class="text-neutral-950 font-medium text-2xl leading-6">About this restaurant</p>
          <p class="max-w-2xl w-full text-normal leading-6 text-neutral-950">
            {{ restaurant.description }}
          </p>
        </section>

      </section>

      <!-- Right side section for reservations -->
      <div class="lg:w-[400px] w-full sticky top-4">

      </div>
    </div>

    <!-- Map Location -->
    <section v-if="!pending" class="w-full flex flex-col gap-6 items-start justify-center">
      <p class="text-neutral-950 font-medium text-2xl leading-6">Location</p>
      <div class="w-full bg-neutral-300 rounded-2xl h-96">
        <!-- Add map component here using restaurant.latitude and restaurant.longitude -->
      </div>
    </section>
  </main>
</template>

<style scoped>
[data-radix-popper-content-wrapper] {
  @apply !top-2 !right-0;
}
</style>