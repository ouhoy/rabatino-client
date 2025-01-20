<script setup lang="ts">
import { ChevronRightIcon } from '@heroicons/vue/16/solid'
import { GlobeAltIcon, PhoneIcon, EnvelopeIcon, MapPinIcon, AcademicCapIcon, BuildingLibraryIcon } from '@heroicons/vue/24/outline'
import type { University } from '~/types/education'
import { InstitutionType } from '~/types/education'

const router = useRouter()
const route = useRoute();
const slug = route.params.slug;
const pending = ref(false);

const university = ref<University>({
  // Post interface fields
  id: '1',
  title: 'International University of Technology',
  description: 'A leading institution in technology and innovation, offering comprehensive programs across multiple disciplines with state-of-the-art facilities and research opportunities.',
  images: ['/images/university-main.jpg'],
  createdAt: new Date(),
  userId: '1',
  address: '123 University Avenue, Education District, City, 12345',
  latitude: 40.7128,
  longitude: -74.0060,
  website: 'www.iut.edu',
  phone: '+1 (555) 234-5678',
  email: 'admissions@iut.edu',
  featuredImage: '/images/university-featured.jpg',

  // EducationalInstitution fields
  isVerified: true,
  private: false,
  type: InstitutionType.UNIVERSITY,

  // University specific fields
  faculties: [
    'Engineering',
    'Computer Science',
    'Business',
    'Arts & Sciences',
    'Medicine'
  ],
  ranking: 'Top 100 Global Universities',
  accreditation: 'National Education Board',
  hasHousing: true,
  researchCenters: [
    'AI & Robotics Center',
    'Biotech Research Lab',
    'Climate Studies Institute'
  ],
  facilities: [
    'Modern Library',
    'Sports Complex',
    'Student Center',
    'Research Labs',
    'Campus Housing',
    'Health Center',
    'Cafeteria'
  ]
});

const facilityIcons = {
  'Modern Library': '📚',
  'Sports Complex': '🏃‍♂️',
  'Student Center': '🎓',
  'Research Labs': '🔬',
  'Campus Housing': '🏢',
  'Health Center': '🏥',
  'Cafeteria': '🍽️'
}
</script>

<template>
  <main class="w-full flex flex-col items-center justify-center gap-10 mb-28 lg:my-10">
    <!-- Featured Image Section -->
    <section v-if="!pending" class="w-full">
      <div class="w-full h-[500px] relative overflow-hidden rounded-2xl">
        <img 
          :src="university.featuredImage" 
          :alt="university.title"
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
              {{ university.title }}
            </h2>
          </div>
          <div class="flex items-center gap-4">
            <span class="text-normal leading-none text-neutral-800">{{ university.ranking }}</span>
            <span v-if="university.isVerified" class="text-normal leading-none text-green-600">✓ Verified Institution</span>
          </div>
        </div>

        <!-- Key Information -->
        <div class="w-full grid grid-cols-2 gap-4 p-6 bg-neutral-50 rounded-lg">
          <div class="flex flex-col gap-2">
            <p class="font-medium">Type</p>
            <p>{{ university.private ? 'Private' : 'Public' }} University</p>
          </div>
          <div class="flex flex-col gap-2">
            <p class="font-medium">Accreditation</p>
            <p>{{ university.accreditation }}</p>
          </div>
          <div class="flex flex-col gap-2">
            <p class="font-medium">Campus Housing</p>
            <p>{{ university.hasHousing ? 'Available' : 'Not Available' }}</p>
          </div>
          <div class="flex flex-col gap-2">
            <p class="font-medium">Number of Faculties</p>
            <p>{{ university.faculties.length }}</p>
          </div>
        </div>

        <!-- Contact Information -->
        <div class="w-full flex flex-col gap-4 p-6 bg-neutral-50 rounded-lg">
          <h3 class="font-medium text-lg">Contact Information</h3>
          <div class="grid grid-cols-1 gap-4">
            <div class="flex items-start gap-2">
              <MapPinIcon class="h-5 w-5 text-neutral-600 mt-0.5" />
              <p class="text-neutral-900">{{ university.address }}</p>
            </div>
            <div v-if="university.website" class="flex items-center gap-2">
              <GlobeAltIcon class="h-5 w-5 text-neutral-600" />
              <a :href="`https://${university.website}`" 
                 target="_blank" 
                 class="text-blue-600 hover:underline">
                {{ university.website }}
              </a>
            </div>
            <div v-if="university.phone" class="flex items-center gap-2">
              <PhoneIcon class="h-5 w-5 text-neutral-600" />
              <a :href="`tel:${university.phone}`" 
                 class="text-blue-600 hover:underline">
                {{ university.phone }}
              </a>
            </div>
            <div v-if="university.email" class="flex items-center gap-2">
              <EnvelopeIcon class="h-5 w-5 text-neutral-600" />
              <a :href="`mailto:${university.email}`" 
                 class="text-blue-600 hover:underline">
                {{ university.email }}
              </a>
            </div>
          </div>
        </div>

        <!-- Description -->
        <section class="w-full flex flex-col gap-6 items-start justify-center">
          <p class="text-neutral-950 font-medium text-2xl leading-6">About this University</p>
          <p class="max-w-2xl w-full text-normal leading-6 text-neutral-950">
            {{ university.description }}
          </p>
        </section>

        <!-- Faculties -->
        <section class="w-full flex flex-col gap-6 items-start justify-center">
          <p class="text-neutral-950 font-medium text-2xl leading-6">Faculties</p>
          <div class="grid grid-cols-2 gap-4">
            <div v-for="faculty in university.faculties" 
                 :key="faculty"
                 class="flex items-center gap-2 p-3 bg-neutral-50 rounded-lg">
              <BuildingLibraryIcon class="h-5 w-5 text-neutral-600" />
              <span>{{ faculty }}</span>
            </div>
          </div>
        </section>

        <!-- Research Centers -->
        <section class="w-full flex flex-col gap-6 items-start justify-center">
          <p class="text-neutral-950 font-medium text-2xl leading-6">Research Centers</p>
          <div class="grid grid-cols-1 gap-4">
            <div v-for="center in university.researchCenters" 
                 :key="center"
                 class="flex items-center gap-2">
              <span class="text-2xl">🔬</span>
              <p class="text-normal leading-none text-neutral-950">{{ center }}</p>
            </div>
          </div>
        </section>

        <!-- Facilities -->
        <section class="w-full flex flex-col gap-6 items-start justify-center">
          <p class="text-neutral-950 font-medium text-2xl leading-6">Campus Facilities</p>
          <div class="grid grid-cols-2 gap-6">
            <div v-for="facility in university.facilities" 
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
          v-if="university.website"
          :href="`https://${university.website}`"
          target="_blank"
          class="w-full p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <span class="font-medium">Visit University Website</span>
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
