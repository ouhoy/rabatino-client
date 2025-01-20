<script setup lang="ts">
import { ChevronRightIcon } from '@heroicons/vue/16/solid'
import { GlobeAltIcon, PhoneIcon, EnvelopeIcon, MapPinIcon, AcademicCapIcon, ClockIcon, BookOpenIcon } from '@heroicons/vue/24/outline'
import type { CoachingCenter } from '~/types/education'
import { InstitutionType } from '~/types/education'

const router = useRouter()
const route = useRoute();
const slug = route.params.slug;
const pending = ref(false);

const coachingCenter = ref<CoachingCenter>({
  // Post interface fields
  id: '1',
  title: 'Excel Academy Coaching',
  description: 'Premier coaching center specializing in test preparation and academic excellence, offering comprehensive courses with experienced instructors.',
  images: ['/images/coaching-main.jpg'],
  createdAt: new Date(),
  userId: '1',
  address: '789 Education Avenue, Coaching District, City, 12345',
  latitude: 40.7128,
  longitude: -74.0060,
  website: 'www.excelacademy.edu',
  phone: '+1 (555) 789-0123',
  email: 'info@excelacademy.edu',
  featuredImage: '/images/coaching-featured.jpg',

  // Educational Institution fields
  isVerified: true,
  private: true,
  type: InstitutionType.COACHING_CENTER,

  // CoachingCenter specific fields
  specialty: 'Test Preparation & Academic Excellence',
  courses: [
    'SAT Preparation',
    'ACT Preparation',
    'AP Courses Support',
    'Mathematics Excellence',
    'Science Mastery',
    'Language Arts',
    'College Application Prep'
  ],
  schedule: 'Monday to Saturday, 9:00 AM - 8:00 PM'
});

</script>

<template>
  <main class="w-full flex flex-col items-center justify-center gap-10 mb-28 lg:my-10">
    <!-- Featured Image Section -->
    <section v-if="!pending" class="w-full">
      <div class="w-full h-[500px] relative overflow-hidden rounded-2xl">
        <img 
          :src="coachingCenter.featuredImage" 
          :alt="coachingCenter.title"
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
              {{ coachingCenter.title }}
            </h2>
          </div>
          <div class="flex items-center gap-4">
            <span class="text-normal leading-none text-neutral-800">{{ coachingCenter.specialty }}</span>
            <span v-if="coachingCenter.isVerified" class="text-normal leading-none text-green-600">✓ Verified Institution</span>
          </div>
        </div>

        <!-- Key Information -->
        <div class="w-full grid grid-cols-2 gap-4 p-6 bg-neutral-50 rounded-lg">
          <div class="flex flex-col gap-2">
            <p class="font-medium">Schedule</p>
            <div class="flex items-center gap-2">
              <ClockIcon class="h-5 w-5 text-neutral-600" />
              <p>{{ coachingCenter.schedule }}</p>
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <p class="font-medium">Type</p>
            <p>{{ coachingCenter.private ? 'Private' : 'Public' }} Institution</p>
          </div>
          <div class="flex flex-col gap-2">
            <p class="font-medium">Specialty</p>
            <p>{{ coachingCenter.specialty }}</p>
          </div>
          <div class="flex flex-col gap-2">
            <p class="font-medium">Available Courses</p>
            <p>{{ coachingCenter.courses.length }} Courses</p>
          </div>
        </div>

        <!-- Contact Information -->
        <div class="w-full flex flex-col gap-4 p-6 bg-neutral-50 rounded-lg">
          <h3 class="font-medium text-lg">Contact Information</h3>
          <div class="grid grid-cols-1 gap-4">
            <div class="flex items-start gap-2">
              <MapPinIcon class="h-5 w-5 text-neutral-600 mt-0.5" />
              <p class="text-neutral-900">{{ coachingCenter.address }}</p>
            </div>
            <div v-if="coachingCenter.website" class="flex items-center gap-2">
              <GlobeAltIcon class="h-5 w-5 text-neutral-600" />
              <a :href="`https://${coachingCenter.website}`" 
                 target="_blank" 
                 class="text-blue-600 hover:underline">
                {{ coachingCenter.website }}
              </a>
            </div>
            <div v-if="coachingCenter.phone" class="flex items-center gap-2">
              <PhoneIcon class="h-5 w-5 text-neutral-600" />
              <a :href="`tel:${coachingCenter.phone}`" 
                 class="text-blue-600 hover:underline">
                {{ coachingCenter.phone }}
              </a>
            </div>
            <div v-if="coachingCenter.email" class="flex items-center gap-2">
              <EnvelopeIcon class="h-5 w-5 text-neutral-600" />
              <a :href="`mailto:${coachingCenter.email}`" 
                 class="text-blue-600 hover:underline">
                {{ coachingCenter.email }}
              </a>
            </div>
          </div>
        </div>

        <!-- Description -->
        <section class="w-full flex flex-col gap-6 items-start justify-center">
          <p class="text-neutral-950 font-medium text-2xl leading-6">About this Coaching Center</p>
          <p class="max-w-2xl w-full text-normal leading-6 text-neutral-950">
            {{ coachingCenter.description }}
          </p>
        </section>

        <!-- Available Courses -->
        <section class="w-full flex flex-col gap-6 items-start justify-center">
          <p class="text-neutral-950 font-medium text-2xl leading-6">Available Courses</p>
          <div class="grid grid-cols-2 gap-4">
            <div v-for="course in coachingCenter.courses" 
                 :key="course"
                 class="flex items-center gap-2 p-3 bg-neutral-50 rounded-lg">
              <BookOpenIcon class="h-5 w-5 text-neutral-600" />
              <span>{{ course }}</span>
            </div>
          </div>
        </section>
      </section>

      <!-- Right side section -->
      <div class="lg:w-[400px] w-full sticky top-4">
        <a 
          v-if="coachingCenter.website"
          :href="`https://${coachingCenter.website}`"
          target="_blank"
          class="w-full p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <span class="font-medium">Enroll Now</span>
          <ChevronRightIcon class="h-5 w-5" />
        </a>
      </div>
    </div>

    <!-- Map Location -->
    <section v-if="!pending" class="w-full flex flex-col gap-6 items-start justify-center">
      <p class="text-neutral-950 font-medium text-2xl leading-6">Location</p>
      <div class="w-full bg-neutral-300 rounded-2xl h-96">
        <!-- Add map component here using coachingCenter.latitude and coachingCenter.longitude -->
      </div>
    </section>
  </main>
</template>
