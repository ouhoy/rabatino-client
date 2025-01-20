<script setup lang="ts">
import { ChevronRightIcon } from '@heroicons/vue/16/solid'
import { GlobeAltIcon, PhoneIcon, EnvelopeIcon, MapPinIcon, AcademicCapIcon, BookOpenIcon } from '@heroicons/vue/24/outline'
import type { College } from '~/types/education'
import { InstitutionType } from '~/types/education'

const router = useRouter()
const route = useRoute();
const slug = route.params.slug;
const pending = ref(false);

const college = ref<College>({
  // Post interface fields
  id: '1',
  title: 'City Technical College',
  description: 'A specialized technical college offering practical education in various technical fields with modern facilities and industry connections.',
  images: ['/images/college-main.jpg'],
  createdAt: new Date(),
  userId: '1',
  address: '456 College Road, Education District, City, 12345',
  latitude: 40.7128,
  longitude: -74.0060,
  website: 'www.citytechcollege.edu',
  phone: '+1 (555) 345-6789',
  email: 'info@citytechcollege.edu',
  featuredImage: '/images/college-featured.jpg',

  // Educational Institution fields
  isVerified: true,
  private: true,
  type: InstitutionType.COLLEGE,

  // College specific fields
  departments: [
    'Mechanical Engineering',
    'Electrical Technology',
    'Computer Science',
    'Digital Media',
    'Business Administration'
  ],
  specialization: 'Technical and Applied Sciences',
  affiliation: 'National Technical Education Board',
  hasNote: true,
  facilities: [
    'Computer Labs',
    'Workshop Facilities',
    'Student Lounge',
    'Career Center',
    'Library',
    'Cafeteria'
  ]
});

const facilityIcons = {
  'Computer Labs': '💻',
  'Workshop Facilities': '🔧',
  'Student Lounge': '🛋️',
  'Career Center': '💼',
  'Library': '📚',
  'Cafeteria': '🍽️'
}
</script>

<template>
  <main class="w-full flex flex-col items-center justify-center gap-10 mb-28 lg:my-10">
    <!-- Featured Image Section -->
    <section v-if="!pending" class="w-full">
      <div class="w-full h-[500px] relative overflow-hidden rounded-2xl">
        <img 
          :src="college.featuredImage" 
          :alt="college.title"
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
              {{ college.title }}
            </h2>
          </div>
          <div class="flex items-center gap-4">
            <span class="text-normal leading-none text-neutral-800">{{ college.specialization }}</span>
            <span v-if="college.isVerified" class="text-normal leading-none text-green-600">✓ Verified Institution</span>
          </div>
        </div>

        <!-- Key Information -->
        <div class="w-full grid grid-cols-2 gap-4 p-6 bg-neutral-50 rounded-lg">
          <div class="flex flex-col gap-2">
            <p class="font-medium">Type</p>
            <p>{{ college.private ? 'Private' : 'Public' }} College</p>
          </div>
          <div class="flex flex-col gap-2">
            <p class="font-medium">Specialization</p>
            <p>{{ college.specialization }}</p>
          </div>
          <div class="flex flex-col gap-2">
            <p class="font-medium">Affiliation</p>
            <p>{{ college.affiliation }}</p>
          </div>
          <div class="flex flex-col gap-2">
            <p class="font-medium">Study Notes</p>
            <p>{{ college.hasNote ? 'Available' : 'Not Available' }}</p>
          </div>
          <div class="flex flex-col gap-2">
            <p class="font-medium">Departments</p>
            <p>{{ college.departments.length }}</p>
          </div>
        </div>

        <!-- Contact Information -->
        <div class="w-full flex flex-col gap-4 p-6 bg-neutral-50 rounded-lg">
          <h3 class="font-medium text-lg">Contact Information</h3>
          <div class="grid grid-cols-1 gap-4">
            <div class="flex items-start gap-2">
              <MapPinIcon class="h-5 w-5 text-neutral-600 mt-0.5" />
              <p class="text-neutral-900">{{ college.address }}</p>
            </div>
            <div v-if="college.website" class="flex items-center gap-2">
              <GlobeAltIcon class="h-5 w-5 text-neutral-600" />
              <a :href="`https://${college.website}`" 
                 target="_blank" 
                 class="text-blue-600 hover:underline">
                {{ college.website }}
              </a>
            </div>
            <div v-if="college.phone" class="flex items-center gap-2">
              <PhoneIcon class="h-5 w-5 text-neutral-600" />
              <a :href="`tel:${college.phone}`" 
                 class="text-blue-600 hover:underline">
                {{ college.phone }}
              </a>
            </div>
            <div v-if="college.email" class="flex items-center gap-2">
              <EnvelopeIcon class="h-5 w-5 text-neutral-600" />
              <a :href="`mailto:${college.email}`" 
                 class="text-blue-600 hover:underline">
                {{ college.email }}
              </a>
            </div>
          </div>
        </div>

        <!-- Description -->
        <section class="w-full flex flex-col gap-6 items-start justify-center">
          <p class="text-neutral-950 font-medium text-2xl leading-6">About this College</p>
          <p class="max-w-2xl w-full text-normal leading-6 text-neutral-950">
            {{ college.description }}
          </p>
        </section>

        <!-- Departments -->
        <section class="w-full flex flex-col gap-6 items-start justify-center">
          <p class="text-neutral-950 font-medium text-2xl leading-6">Departments</p>
          <div class="grid grid-cols-2 gap-4">
            <div v-for="department in college.departments" 
                 :key="department"
                 class="flex items-center gap-2 p-3 bg-neutral-50 rounded-lg">
              <BookOpenIcon class="h-5 w-5 text-neutral-600" />
              <span>{{ department }}</span>
            </div>
          </div>
        </section>

        <!-- Facilities -->
        <section class="w-full flex flex-col gap-6 items-start justify-center">
          <p class="text-neutral-950 font-medium text-2xl leading-6">College Facilities</p>
          <div class="grid grid-cols-2 gap-6">
            <div v-for="facility in college.facilities" 
                 :key="facility"
                 class="flex items-center justify-start gap-2">
              <span class="text-2xl">{{ facilityIcons[facility] }}</span>
              <p class="text-normal leading-none text-neutral-950">{{ facility }}</p>
            </div>
          </div>
        </section>
      </section>

      <!-- Right side section -->
      <div class="lg:w-[400px] w-full sticky top-4">
        <a 
          v-if="college.website"
          :href="`https://${college.website}`"
          target="_blank"
          class="w-full p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <span class="font-medium">Visit College Website</span>
          <ChevronRightIcon class="h-5 w-5" />
        </a>
      </div>
    </div>

    <!-- Map Location -->
    <section v-if="!pending" class="w-full flex flex-col gap-6 items-start justify-center">
      <p class="text-neutral-950 font-medium text-2xl leading-6">Location</p>
      <div class="w-full bg-neutral-300 rounded-2xl h-96">
        <!-- Add map component here -->
      </div>
    </section>
  </main>
</template>
