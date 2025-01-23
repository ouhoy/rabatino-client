<script setup lang="ts">

import PageHeader from "../../components/pageHeader.vue";
import Card from "../../components/card.vue";

interface PaginatedResponse {
  meta: {
    total: number
    per_page: number
    current_page: number
    last_page: number
    first_page: number
  }
  data: BusinessPost[]
}

interface BusinessPost {
  id: number
  title: string
  body: string
  userId: number
  typeId: number
  address: string
  latitude: string
  longitude: string
  website: string | null
  phone: string | null
  email: string | null
  views: number
  featuredImg: string
  createdAt: string
  updatedAt: string
  tags: string[]
}

const config = useRuntimeConfig()
const isLoading = ref(true)
const posts = ref<BusinessPost[]>([])
const filteredPosts = ref<BusinessPost[]>([])
const pagination = ref<PaginatedResponse['meta'] | null>(null)
const currentPage = ref(1)

// Fetch business posts with pagination
async function fetchBusinessPosts(page = 1) {
  try {
    isLoading.value = true
    const response = await fetch(`${config.public.apiBaseUrl}/business/?page=${page}`)
    if (!response.ok) throw new Error('Failed to fetch business posts')
    
    const data: PaginatedResponse = await response.json()
    posts.value = data.data
    filteredPosts.value = data.data
    pagination.value = data.meta
    currentPage.value = data.meta.current_page
  } catch (error) {
    console.error('Error fetching business posts:', error)
  } finally {
    isLoading.value = false
  }
}

// Generate view URL for business posts
function getViewUrl(post: BusinessPost): string {
  return `/business/${post.id}`
}

// Pagination handler
async function handlePageChange(page: number) {
  if (page < 1 || (pagination.value && page > pagination.value.last_page)) return
  await fetchBusinessPosts(page)
}

onMounted(() => {
  fetchBusinessPosts()
})

</script>

<template>
  <main class="w-full">
    <div class="py-12 flex flex-col items-center justify-center gap-6">
      <page-header 
        title="Business"
        description="This module focuses on providing news, information, and opportunities in the city connected to the business. People can get information on the city's business centers and industries."></page-header>

    
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>

    <!-- Posts Grid -->
    <div v-else>
      <div class="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5 gap-8 md:gap-4">
        <nuxt-link 
          v-for="post in filteredPosts" 
          :key="post.id"
          :to="getViewUrl(post)"
        >
          <Card 
            :title="post.title" 
            :imgUrl="post.featuredImg"
          />
        </nuxt-link>
      </div>

      <!-- Pagination -->
      <div v-if="pagination" class="mt-8 flex justify-center">
        <nav class="inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
          <button
            v-for="page in pagination.last_page"
            :key="page"
            @click="handlePageChange(page)"
            :class="[
              page === currentPage 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-900 hover:bg-gray-50',
              'relative inline-flex items-center px-4 py-2 text-sm font-medium focus:z-20 rounded-full'
            ]"
          >
            {{ page }}
          </button>
        </nav>
      </div>
    </div>
  </main>
</template>

<style scoped>

</style>