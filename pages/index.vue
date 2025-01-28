<script setup lang="ts">

import {MagnifyingGlassIcon, ChevronRightIcon} from '@heroicons/vue/16/solid';
import SliderSection from "../components/SliderSection.vue";
import CareerSliderSection from "../components/CareerSliderSection.vue";

const router = useRouter();
const searchInputValue = ref('');

const handleSearch = () => {
  if (searchInputValue.value.trim()) {
    router.push(`/search/${encodeURIComponent(searchInputValue.value.trim())}`);
  }
};


interface BusinessPost {
  id: number
  title: string
  body: string
  featuredImg: string
  tags: string[]
  createdAt: string
  updatedAt: string
}

interface PaginatedResponse {
  meta: {
    total: number
    perPage: number
    currentPage: number
    lastPage: number
    firstPage: number
    firstPageUrl: string
    lastPageUrl: string
    nextPageUrl: string | null
    previousPageUrl: string | null
  }
  data: BusinessPost[]
}

interface JobPost {
  id: number
  title: string
  company: string
  logo: string
  jobType: string
  workLocation: string
  salary: string
  description: string
  // ...other fields we don't need for the slider
}

interface JobsResponse {
  meta: {
    // ...same meta structure as BusinessResponse
  }
  data: JobPost[]
}

interface EducationPost {
  id: number
  title: string
  description: string
  userId: number
  typeId: number
  address: string
  latitude: string
  longitude: string
  website: string | null
  phone: string | null
  email: string | null
  views: number
  featuredImage: string
  createdAt: string
  updatedAt: string
  institutionType?: 'UNIVERSITY' | 'COLLEGE' | 'LIBRARY' | 'COACHING_CENTER' | 'STUDY_CENTER'
}

interface EducationResponse {
  meta: {
    // ...same meta structure as other responses...
  }
  data: EducationPost[]
}

interface TourismPost {
  id: number
  title: string
  description: string
  userId: number
  typeId: number
  address: string
  latitude: string
  longitude: string
  website: string | null
  phone: string | null
  email: string | null
  views: number
  featuredImage: string
  createdAt: string
  updatedAt: string
  tourismType?: 'HOTEL' | 'RESTAURANT' | 'ATTRACTION' | 'THEATER' | 'BANK'
}

interface TourismResponse {
  meta: {
    // ...same meta structure as other responses
  }
  data: TourismPost[]
}

const config = useRuntimeConfig()
const businessPosts = ref<BusinessPost[]>([])
const isLoading = ref(true)

// Fetch business posts
async function fetchBusinessPosts() {
  try {
    const response = await fetch(`${config.public.apiBaseUrl}/business/`)
    if (!response.ok) throw new Error('Failed to fetch business posts')
    
    const data: PaginatedResponse = await response.json()
    businessPosts.value = data.data
  } catch (error) {
    console.error('Error fetching business posts:', error)
  } finally {
    isLoading.value = false
  }
}

// Jobs fetching
const jobPosts = ref<JobPost[]>([])

async function fetchJobPosts() {
  try {
    const response = await fetch(`${config.public.apiBaseUrl}/posts/jobs/`)
    if (!response.ok) throw new Error('Failed to fetch job posts')
    
    const data: JobsResponse = await response.json()
    jobPosts.value = data.data
  } catch (error) {
    console.error('Error fetching job posts:', error)
  }
}

// Add education posts ref
const educationPosts = ref<EducationPost[]>([])

// Add education posts fetching
async function fetchEducationPosts() {
  try {
    const response = await fetch(`${config.public.apiBaseUrl}/posts/education/`)
    if (!response.ok) throw new Error('Failed to fetch education posts')
    
    const data: EducationResponse = await response.json()
    educationPosts.value = data.data
  } catch (error) {
    console.error('Error fetching education posts:', error)
  }
}

// Add tourism posts state
const tourismPosts = ref<TourismPost[]>([])

// Add tourism posts fetching
async function fetchTourismPosts() {
  try {
    const response = await fetch(`${config.public.apiBaseUrl}/posts/tourism/`)
    if (!response.ok) throw new Error('Failed to fetch tourism posts')
    
    const data: TourismResponse = await response.json()
    tourismPosts.value = data.data
  } catch (error) {
    console.error('Error fetching tourism posts:', error)
  }
}

onMounted(() => {
  fetchBusinessPosts()
  fetchJobPosts()
  fetchEducationPosts()
  fetchTourismPosts()
})

// Transform business posts to match slider format
const formattedBusinessPosts = computed(() => {
  return businessPosts.value.map(post => ({
    id: post.id,
    title: post.title,
    imgUrl: post.featuredImg
  }))
})

// Transform job posts to match career slider format
const formattedJobPosts = computed(() => {
  return jobPosts.value.map(post => ({
    id: post.id,
    title: post.title,
    company: post.company,
    logo: post.logo
  }))
})

// Transform education posts to match slider format and handle routing
const formattedEducationPosts = computed(() => {
  return educationPosts.value.map(post => ({
    id: post.id,
    title: post.title,
    imgUrl: post.featuredImage,
    // Add institution type for routing
    institutionType: post.institutionType
  }))
})

// Transform tourism posts to match slider format
const formattedTourismPosts = computed(() => {
  return tourismPosts.value.map(post => ({
    id: post.id,
    title: post.title,
    imgUrl: post.featuredImage,
    tourismType: post.tourismType // Include for routing
  }))
})
</script>

<template>
  <main class="-w-full">

    <!-- HERO_SECTION -->
    <header class="w-full flex flex-col items-center justify-center gap-4 pb-44 pt-28">
      <div class="flex text-center flex-col items-center justify-center gap-4 max-w-xl mx-auto">
        <h1 class="text-5xl lg:text-7xl lg:leading-[80px] text-neutral-900  font-medium">Discover Rabat<br/>the City of Light</h1>
        <p class="text-base md:text-lg text-neutral-700">Explore the perfect blend of timeless heritage and cutting-edge innovation
          in Morocco’s capital.</p>
      </div>
      <div
          class="w-full flex items-center justify-between p-2 h-14 border border-1 rounded-full border-neutral-300 bg-neutral-50/50 mx-auto  max-w-2xl">

        <input


            v-model="searchInputValue"
            @keyup.enter="handleSearch"
            type="text"
            class="bg-neutral-50 p-2 w-full max-w-[95%] mx-auto block  outline-none focus:outline-none border-0 text-neutral-900 placeholder:text-neutral-500 placeholder:text-sm"
            placeholder="What are you looking for?">

        <button
            @click="handleSearch"
            class="p-3 bg-blue-600 flex items-center justify-center rounded-full ">
          <MagnifyingGlassIcon class="w-4 h-4 text-white"/>
        </button>
      </div>
    </header>

    <section class="w-full flex flex-col items-start justify-start gap-12">

      <SliderSection 
        title="Education" 
        description="Browse educational institutions and resources" 
        :posts="formattedEducationPosts"
        :getViewUrl="(post) => `/education/${post.institutionType?.toLowerCase().replace('_', '-')}/${post.id}`"
        viewAllRoute="/education"
      />
      <SliderSection 
        title="Tourism" 
        description="Discover local attractions and experiences" 
        :posts="formattedTourismPosts"
        :getViewUrl="(post) => `/tourism/${post.tourismType?.toLowerCase()}/${post.id}`"
        viewAllRoute="/tourism"
      />
      <SliderSection 
        title="Business" 
        description="Latest updates and news from local businesses" 
        :posts="formattedBusinessPosts"
        viewAllRoute="/business"
      />
      <CareerSliderSection 
        title="Career" 
        description="Latest job opportunities and career news" 
        :posts="formattedJobPosts"
        viewAllRoute="/career"
      />
    </section>
  </main>
</template>

<style scoped>
h1 {
  font-family: Alegreya;
}

</style>