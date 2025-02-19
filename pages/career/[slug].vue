<script setup lang="ts">
import {ChevronRightIcon} from '@heroicons/vue/16/solid'
import {
  GlobeAltIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  ClockIcon,
  BriefcaseIcon,
  ComputerDesktopIcon,
  ClipboardDocumentListIcon
} from '@heroicons/vue/24/outline'
import type {JobPost} from '~/types/jobs'
import {JobType, WorkLocation} from '~/types/jobs'

const router = useRouter()
const route = useRoute();
const config = useRuntimeConfig()
const slug = route.params.slug;
const pending = ref(true);

const job = ref<JobPost | null>(null);

// Fetch job post data
async function fetchJobPost() {
  try {
    pending.value = true;
    const response = await fetch(`${config.public.apiBaseUrl}/jobs/${slug}`);
    if (!response.ok) throw new Error('Failed to fetch job post');
    const data = await response.json();
    
    // Transform the API response to match JobPost type
    job.value = {
      ...data,
      createdAt: new Date(data.createdAt || new Date()),
      images: data.images || [],
      // Ensure workLocation and jobType are correctly formatted as enums
      workLocation: data.workLocation as WorkLocation,
      jobType: data.jobType as JobType,
      // Parse expiry date
      expiryDate: new Date(data.expiryDate)
    };
  } catch (error) {
    console.error('Error fetching job post:', error);
    router.push('/404');
  } finally {
    pending.value = false;
  }
}

onMounted(() => {
  fetchJobPost();
});

const getWorkLocationIcon = (location: WorkLocation) => {
  switch (location) {
    case WorkLocation.REMOTE:
      return ComputerDesktopIcon;
    case WorkLocation.HYBRID:
      return BuildingOfficeIcon;
    default:
      return BuildingOfficeIcon;
  }
};
</script>

<template>
  <main class="w-full flex flex-col items-center justify-center gap-10 mb-28 lg:my-10">
    <!-- Loading State -->
    <div v-if="pending" class="w-full h-[500px] flex items-center justify-center">
      <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-neutral-900"></div>
    </div>

    <!-- Content (Only shown when data is loaded) -->
    <template v-else-if="job">
      <!-- Job Header -->
      <section class="w-full flex flex-col lg:flex-row items-start justify-between gap-8">
        <div class="flex-1">
          <div class="flex flex-col gap-4">
            <h1 class="text-3xl font-semibold text-neutral-900">{{ job.title }}</h1>
            <div class="flex items-center gap-2 text-neutral-600">
              <BuildingOfficeIcon class="h-5 w-5"/>
              <span>{{ job.company }}</span>
            </div>
          </div>
        </div>
      </section>

      <div class="w-full flex flex-col lg:flex-row items-start justify-between gap-8">
        <section class="lg:max-w-2xl flex flex-col gap-10 items-start justify-center">
          <!-- Description -->
          <section class="w-full flex flex-col gap-6 items-start justify-center">
            <p class="text-neutral-950 font-medium text-2xl leading-6">Job Description</p>
            <p class="max-w-2xl w-full text-normal leading-6 text-neutral-950">
              {{ job.description }}
            </p>
          </section>

          <!-- Key Information -->
          <div class="w-full grid grid-cols-2 gap-4 p-6 bg-neutral-50 rounded-lg">
            <div class="flex items-center gap-2">
              <BriefcaseIcon class="h-5 w-5 text-neutral-600"/>
              <div class="flex flex-col">
                <p class="font-medium">Job Type</p>
                <p>{{ job.jobType.replace('_', ' ').toLowerCase() }}</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <component :is="getWorkLocationIcon(job.workLocation)" class="h-5 w-5 text-neutral-600"/>
              <div class="flex flex-col">
                <p class="font-medium">Work Location</p>
                <p>{{ job.workLocation.toLowerCase() }}</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <CurrencyDollarIcon class="h-5 w-5 text-neutral-600"/>
              <div class="flex flex-col">
                <p class="font-medium">Salary Range</p>
                <p>{{ job.salary }}</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <CalendarIcon class="h-5 w-5 text-neutral-600"/>
              <div class="flex flex-col">
                <p class="font-medium">Valid Until</p>
                <p>{{ new Date(job.expiryDate).toLocaleDateString() }}</p>
              </div>
            </div>
          </div>

          <!-- Contact Information -->
          <div class="w-full flex flex-col gap-4 p-6 bg-neutral-50 rounded-lg">
            <h3 class="font-medium text-lg">Contact Information</h3>
            <div class="grid grid-cols-1 gap-4">
              <div class="flex items-start gap-2">
                <MapPinIcon class="h-5 w-5 text-neutral-600 mt-0.5"/>
                <p class="text-neutral-900">{{ job.address }}</p>
              </div>
              <div v-if="job.website" class="flex items-center gap-2">
                <GlobeAltIcon class="h-5 w-5 text-neutral-600"/>
                <a :href="`https://${job.website}`"
                   target="_blank"
                   class="text-blue-600 hover:underline">
                  {{ job.website }}
                </a>
              </div>
              <div v-if="job.phone" class="flex items-center gap-2">
                <PhoneIcon class="h-5 w-5 text-neutral-600"/>
                <a :href="`tel:${job.phone}`"
                   class="text-blue-600 hover:underline">
                  {{ job.phone }}
                </a>
              </div>
              <div v-if="job.email" class="flex items-center gap-2">
                <EnvelopeIcon class="h-5 w-5 text-neutral-600"/>
                <a :href="`mailto:${job.email}`"
                   class="text-blue-600 hover:underline">
                  {{ job.email }}
                </a>
              </div>
            </div>
          </div>

          <!-- Requirements -->
          <section class="w-full flex flex-col gap-6 items-start justify-center">
            <p class="text-neutral-950 font-medium text-2xl leading-6">Requirements</p>
            <div class="w-full flex flex-col gap-4">
              <div v-for="requirement in job.requirements"
                   :key="requirement"
                   class="flex items-start gap-2">
                <ClipboardDocumentListIcon class="h-5 w-5 text-neutral-600 mt-1"/>
                <p class="text-normal text-neutral-950">{{ requirement }}</p>
              </div>
            </div>
          </section>
        </section>

        <!-- Right side section -->
        <div class="lg:w-[400px] w-full sticky top-4">
          <div class="w-full p-6 bg-neutral-50 rounded-lg flex flex-col gap-4">
            <h3 class="font-medium text-lg">Company Overview</h3>
            <img v-if="job.logo" :src="job.logo" :alt="job.company" class="bg-neutral-100 w-12 h-12 object-contain"/>
            <p class="text-neutral-600">{{ job.company }}</p>
            <a v-if="job.applicationLink"
               :href="job.applicationLink"
               target="_blank"
               class="w-full p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <span class="font-medium">Apply for this position</span>
              <ChevronRightIcon class="h-5 w-5"/>
            </a>
          </div>
        </div>
      </div>

      <!-- Map Location -->
      <section v-if="job.latitude && job.longitude" class="w-full flex flex-col gap-6 items-start justify-center">
        <p class="text-neutral-950 font-medium text-2xl leading-6">Location</p>
        <div class="w-full bg-neutral-300 rounded-2xl h-96 overflow-hidden">
          <Map 
            :latitude="Number(job.latitude)" 
            :longitude="Number(job.longitude)" 
          />
        </div>
      </section>
    </template>
  </main>
</template>

<style scoped>

</style>