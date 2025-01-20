<script setup lang="ts">
import { ChevronRightIcon } from '@heroicons/vue/16/solid'
import { GlobeAltIcon, PhoneIcon, EnvelopeIcon, MapPinIcon, AcademicCapIcon, ClockIcon, UserGroupIcon } from '@heroicons/vue/24/outline'
import type { StudyCenter } from '~/types/education'
import { InstitutionType } from '~/types/education'

const router = useRouter()
const route = useRoute();
const slug = route.params.slug;
const pending = ref(false);

const studyCenter = ref<StudyCenter>({
  // Post interface fields
  id: '1',
  title: 'Focus Study Space',
  description: 'A modern study center offering quiet workspaces, group study rooms, and 24/7 access for focused learning and productivity.',
  images: ['/images/study-center-main.jpg'],
  createdAt: new Date(),
  userId: '1',
  address: '123 Study Lane, Academic District, City, 12345',
  latitude: 40.7128,
  longitude: -74.0060,
  website: 'www.focusstudyspace.com',
  phone: '+1 (555) 567-8901',
  email: 'info@focusstudyspace.com',
  featuredImage: '/images/study-center-featured.jpg',

  // Educational Institution fields
  isVerified: true,
  private: true,
  type: InstitutionType.STUDY_CENTER,

  // StudyCenter specific fields
  capacity: 150,
  amenities: [
    'High-Speed WiFi',
    'Individual Desks',
    'Power Outlets',
    'Printing Services',
    'Coffee Station',
    'Lockers',
    'Air Conditioning',
    'Soundproof Rooms'
  ],
  hourlyRateRange: [10, 25], // $10-$25 per hour
  has24Access: true,
  rooms: [
    'Silent Study Room',
    'Group Study Room A',
    'Group Study Room B',
    'Conference Room',
    'Individual Cubicles'
  ]
});

const amenityIcons = {
  'High-Speed WiFi': '📶',
  'Individual Desks': '🪑',
  'Power Outlets': '🔌',
  'Printing Services': '🖨️',
  'Coffee Station': '☕',
  'Lockers': '🔐',
  'Air Conditioning': '❄️',
  'Soundproof Rooms': '🤫'
}

const roomIcons = {
  'Silent Study Room': '🤫',
  'Group Study Room A': '👥',
  'Group Study Room B': '👥',
  'Conference Room': '🤝',
  'Individual Cubicles': '💺'
}
</script>

<template>
  <main class="w-full flex flex-col items-center justify-center gap-10 mb-28 lg:my-10">
    <!-- Featured Image Section -->
    <section v-if="!pending" class="w-full">
      <div class="w-full h-[500px] relative overflow-hidden rounded-2xl">
        <img 
          :src="studyCenter.featuredImage" 
          :alt="studyCenter.title"
          class="w-full h-full object-cover bg-gray-50"
        />
      </div>
    </section>

    <div v-if="!pending" class="w-full flex flex-col lg:flex-row items-start justify-between gap-4">
      <section class="lg:max-w-2xl flex flex-col gap-10 items-start justify-center">
        <!-- Title Section -->
        <div class="w-full flex flex-col items-start justify-start gap-2">
          <div class="flex items-center gap-2">
            <AcademicCapIcon class="h-6 w-6 text-neutral-600" />
            <h2 class="first-letter:uppercase font-medium text-neutral-950 text-2xl leading-6">
              {{ studyCenter.title }}
            </h2>
          </div>
          <div class="flex items-center gap-4">
            <span class="text-normal leading-none text-neutral-800">
              <UserGroupIcon class="h-5 w-5 inline mr-1" />
              Capacity: {{ studyCenter.capacity }} People
            </span>
            <span v-if="studyCenter.isVerified" class="text-normal leading-none text-green-600">✓ Verified Institution</span>
          </div>
        </div>

        <!-- Key Information -->
        <div class="w-full grid grid-cols-2 gap-4 p-6 bg-neutral-50 rounded-lg">
          <div class="flex flex-col gap-2">
            <p class="font-medium">Access Hours</p>
            <div class="flex items-center gap-2">
              <ClockIcon class="h-5 w-5 text-neutral-600" />
              <p>{{ studyCenter.has24Access ? '24/7 Access' : 'Limited Hours' }}</p>
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <p class="font-medium">Hourly Rate</p>
            <p>${{ studyCenter.hourlyRateRange[0] }} - ${{ studyCenter.hourlyRateRange[1] }}/hour</p>
          </div>
          <div class="flex flex-col gap-2">
            <p class="font-medium">Available Rooms</p>
            <p>{{ studyCenter.rooms.length }} Rooms</p>
          </div>
          <div class="flex flex-col gap-2">
            <p class="font-medium">Total Capacity</p>
            <p>{{ studyCenter.capacity }} People</p>
          </div>
        </div>

        <!-- Contact Information -->
        <div class="w-full flex flex-col gap-4 p-6 bg-neutral-50 rounded-lg">
          <h3 class="font-medium text-lg">Contact Information</h3>
          <div class="grid grid-cols-1 gap-4">
            <div class="flex items-start gap-2">
              <MapPinIcon class="h-5 w-5 text-neutral-600 mt-0.5" />
              <p class="text-neutral-900">{{ studyCenter.address }}</p>
            </div>
            <div v-if="studyCenter.website" class="flex items-center gap-2">
              <GlobeAltIcon class="h-5 w-5 text-neutral-600" />
              <a :href="`https://${studyCenter.website}`" 
                 target="_blank" 
                 class="text-blue-600 hover:underline">
                {{ studyCenter.website }}
              </a>
            </div>
            <div v-if="studyCenter.phone" class="flex items-center gap-2">
              <PhoneIcon class="h-5 w-5 text-neutral-600" />
              <a :href="`tel:${studyCenter.phone}`" 
                 class="text-blue-600 hover:underline">
                {{ studyCenter.phone }}
              </a>
            </div>
            <div v-if="studyCenter.email" class="flex items-center gap-2">
              <EnvelopeIcon class="h-5 w-5 text-neutral-600" />
              <a :href="`mailto:${studyCenter.email}`" 
                 class="text-blue-600 hover:underline">
                {{ studyCenter.email }}
              </a>
            </div>
          </div>
        </div>

        <!-- Description -->
        <section class="w-full flex flex-col gap-6 items-start justify-center">
          <p class="text-neutral-950 font-medium text-2xl leading-6">About this Study Center</p>
          <p class="max-w-2xl w-full text-normal leading-6 text-neutral-950">
            {{ studyCenter.description }}
          </p>
        </section>

        <!-- Study Rooms -->
        <section class="w-full flex flex-col gap-6 items-start justify-center">
          <p class="text-neutral-950 font-medium text-2xl leading-6">Available Rooms</p>
          <div class="grid grid-cols-2 gap-4">
            <div v-for="room in studyCenter.rooms" 
                 :key="room"
                 class="flex items-center gap-2 p-3 bg-neutral-50 rounded-lg">
              <span class="text-2xl">{{ roomIcons[room] }}</span>
              <span>{{ room }}</span>
            </div>
          </div>
        </section>

        <!-- Amenities -->
        <section class="w-full flex flex-col gap-6 items-start justify-center">
          <p class="text-neutral-950 font-medium text-2xl leading-6">Amenities</p>
          <div class="grid grid-cols-2 gap-6">
            <div v-for="amenity in studyCenter.amenities" 
                 :key="amenity"
                 class="flex items-center justify-start gap-2">
              <span class="text-2xl">{{ amenityIcons[amenity] }}</span>
              <p class="text-normal leading-none text-neutral-950">{{ amenity }}</p>
            </div>
          </div>
        </section>
      </section>

      <!-- Right side section -->
      <div class="lg:w-[400px] w-full sticky top-4">
        <a 
          v-if="studyCenter.website"
          :href="`https://${studyCenter.website}`"
          target="_blank"
          class="w-full p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <span class="font-medium">Book a Study Space</span>
          <ChevronRightIcon class="h-5 w-5" />
        </a>
      </div>
    </div>

    <!-- Map Location -->
    <section v-if="!pending" class="w-full flex flex-col gap-6 items-start justify-center">
      <p class="text-neutral-950 font-medium text-2xl leading-6">Location</p>
      <div class="w-full bg-neutral-300 rounded-2xl h-96">
        <!-- Add map component here using studyCenter.latitude and studyCenter.longitude -->
      </div>
    </section>
  </main>
</template>
