<script setup lang="ts">
import { ChevronRightIcon } from '@heroicons/vue/16/solid'
import { GlobeAltIcon, PhoneIcon, EnvelopeIcon, MapPinIcon, BookOpenIcon, ClockIcon } from '@heroicons/vue/24/outline'
import type { Library } from '~/types/education'
import { InstitutionType } from '~/types/education'

const router = useRouter()
const route = useRoute();
const config = useRuntimeConfig()
const slug = route.params.slug;
const pending = ref(true);

const library = ref<Library | null>(null);

// Fetch library data
async function fetchLibrary() {
  try {
    pending.value = true;
    const response = await fetch(`${config.public.apiBaseUrl}/education/libraries/${slug}`);
    if (!response.ok) throw new Error('Failed to fetch library');
    
    const data = await response.json();
    
    library.value = {
      ...data,
      id: String(data.id),
      createdAt: new Date(),
      userId: String(data.userId),
      type: data.institutionType as InstitutionType,
      images: [],
      latitude: Number(data.latitude),
      longitude: Number(data.longitude)
    };
  } catch (error) {
    console.error('Error fetching library:', error);
    router.push('/404');
  } finally {
    pending.value = false;
  }
}

onMounted(() => {
  fetchLibrary();
});

const sectionIcons = {
  'Fiction': '📚',
  'Non-Fiction': '📖',
  'Reference': '📗',
  'Periodicals': '📰',
  'Children\'s Literature': '🎨',
  'Digital Media': '💻',
  'Research Materials': '🔍'
}

const features = computed(() => {
  if (!library.value) return [];
  return [
    { 
      name: 'Digital Access',
      available: library.value.hasDigitalAccess,
      icon: '💻'
    },
    {
      name: 'Printing Services',
      available: library.value.hasPrinting,
      icon: '🖨️'
    },
    {
      name: 'Study Rooms',
      available: library.value.hasStudyRooms,
      icon: '🎓'
    }
  ];
});
</script>

<template>
  <main class="w-full flex flex-col items-center justify-center gap-10 mb-28 lg:my-10">
    <!-- Loading State -->
    <div v-if="pending" class="w-full h-[500px] flex items-center justify-center">
      <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-neutral-900"></div>
    </div>

    <!-- Content (Only shown when data is loaded) -->
    <template v-else-if="library">
      <!-- Featured Image Section -->
      <section class="w-full">
        <div class="w-full h-[500px] relative overflow-hidden rounded-2xl">
          <img 
            :src="library.featuredImage" 
            :alt="library.title"
            class="w-full h-full object-cover bg-gray-50"
          />
        </div>
      </section>

      <div class="w-full flex flex-col lg:flex-row items-start justify-between gap-4">
        <section class="lg:max-w-2xl flex flex-col gap-10 items-start justify-center">
          <!-- Title Section -->
          <div class="w-full flex flex-col items-start justify-start gap-2">
            <div class="flex items-center gap-2">
              <BookOpenIcon class="h-6 w-6 text-neutral-600" />
              <h2 class="first-letter:uppercase font-medium text-neutral-950 text-2xl leading-6">
                {{ library.title }}
              </h2>
            </div>
            <div class="flex items-center gap-4">
              <span class="text-normal leading-none text-neutral-800">{{ library.bookCount.toLocaleString() }} Books</span>
              <span v-if="library.isVerified" class="text-normal leading-none text-green-600">✓ Verified Institution</span>
            </div>
          </div>

          <!-- Key Information -->
          <div class="w-full grid grid-cols-2 gap-4 p-6 bg-neutral-50 rounded-lg">
            <div class="flex flex-col gap-2">
              <p class="font-medium">Operation Hours</p>
              <div class="flex items-center gap-2">
                <ClockIcon class="h-5 w-5 text-neutral-600" />
                <p>{{ library.operationHours }}</p>
              </div>
            </div>
            <div class="flex flex-col gap-2">
              <p class="font-medium">Type</p>
              <p>{{ library.private ? 'Private' : 'Public' }} Library</p>
            </div>
            <div class="flex flex-col gap-2">
              <p class="font-medium">Book Collection</p>
              <p>{{ library.bookCount.toLocaleString() }} Volumes</p>
            </div>
            <div class="flex flex-col gap-2">
              <p class="font-medium">Number of Sections</p>
              <p>{{ library.sections.length }} Sections</p>
            </div>
          </div>

          <!-- Contact Information -->
          <div class="w-full flex flex-col gap-4 p-6 bg-neutral-50 rounded-lg">
            <h3 class="font-medium text-lg">Contact Information</h3>
            <div class="grid grid-cols-1 gap-4">
              <div class="flex items-start gap-2">
                <MapPinIcon class="h-5 w-5 text-neutral-600 mt-0.5" />
                <p class="text-neutral-900">{{ library.address }}</p>
              </div>
              <div v-if="library.website" class="flex items-center gap-2">
                <GlobeAltIcon class="h-5 w-5 text-neutral-600" />
                <a :href="`https://${library.website}`" 
                   target="_blank" 
                   class="text-blue-600 hover:underline">
                  {{ library.website }}
                </a>
              </div>
              <div v-if="library.phone" class="flex items-center gap-2">
                <PhoneIcon class="h-5 w-5 text-neutral-600" />
                <a :href="`tel:${library.phone}`" 
                   class="text-blue-600 hover:underline">
                  {{ library.phone }}
                </a>
              </div>
              <div v-if="library.email" class="flex items-center gap-2">
                <EnvelopeIcon class="h-5 w-5 text-neutral-600" />
                <a :href="`mailto:${library.email}`" 
                   class="text-blue-600 hover:underline">
                  {{ library.email }}
                </a>
              </div>
            </div>
          </div>

          <!-- Description -->
          <section class="w-full flex flex-col gap-6 items-start justify-center">
            <p class="text-neutral-950 font-medium text-2xl leading-6">About this Library</p>
            <p class="max-w-2xl w-full text-normal leading-6 text-neutral-950">
              {{ library.description }}
            </p>
          </section>

          <!-- Library Features -->
          <section class="w-full flex flex-col gap-6 items-start justify-center">
            <p class="text-neutral-950 font-medium text-2xl leading-6">Library Features</p>
            <div class="grid grid-cols-2 gap-4">
              <div v-for="feature in features" 
                   :key="feature.name"
                   class="flex items-center gap-2 p-3 bg-neutral-50 rounded-lg">
                <span class="text-2xl">{{ feature.icon }}</span>
                <div class="flex flex-col">
                  <span>{{ feature.name }}</span>
                  <span class="text-sm text-neutral-600">{{ feature.available ? 'Available' : 'Not Available' }}</span>
                </div>
              </div>
            </div>
          </section>

          <!-- Library Sections -->
          <section class="w-full flex flex-col gap-6 items-start justify-center">
            <p class="text-neutral-950 font-medium text-2xl leading-6">Library Sections</p>
            <div class="grid grid-cols-2 gap-6">
              <div v-for="section in library.sections" 
                   :key="section"
                   class="flex items-center justify-start gap-2">
                <span class="text-2xl">{{ sectionIcons[section] }}</span>
                <p class="text-normal leading-none text-neutral-950">{{ section }}</p>
              </div>
            </div>
          </section>
        </section>

        <!-- Right side section -->
        <div class="lg:w-[400px] w-full sticky top-4">
          <a 
            v-if="library.website"
            :href="`https://${library.website}`"
            target="_blank"
            class="w-full p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <span class="font-medium">Visit Library Website</span>
            <ChevronRightIcon class="h-5 w-5" />
          </a>
        </div>
      </div>

      <!-- Map Location -->
      <section v-if="library.latitude && library.longitude" 
               class="w-full flex flex-col gap-6 items-start justify-center">
        <p class="text-neutral-950 font-medium text-2xl leading-6">Location</p>
        <div class="w-full bg-neutral-300 rounded-2xl h-96 overflow-hidden">
          <Map 
            :latitude="Number(library.latitude)" 
            :longitude="Number(library.longitude)" 
          />
        </div>
      </section>
    </template>
  </main>
</template>
