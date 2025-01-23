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
  data: EducationPost[]
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

const config = useRuntimeConfig()
const isLoading = ref(true)
const posts = ref<EducationPost[]>([])
const filteredPosts = ref<EducationPost[]>([])
const pagination = ref<PaginatedResponse['meta'] | null>(null)
const currentPage = ref(1)

const categories = [
  { id: 0, name: 'All' },
  { id: 1, name: 'Universities', type: 'UNIVERSITY' },
  { id: 2, name: 'Colleges', type: 'COLLEGE' },
  { id: 3, name: 'Libraries', type: 'LIBRARY' },
  { id: 4, name: 'Coaching Centers', type: 'COACHING_CENTER' },
  { id: 5, name: 'Study Centers', type: 'STUDY_CENTER' }
]

const selectedCategory = ref<number>(0)

// Updated fetch function to handle pagination
async function fetchEducationPosts(page = 1) {
  try {
    isLoading.value = true
    const response = await fetch(`${config.public.apiBaseUrl}/posts/education/?page=${page}`)
    if (!response.ok) throw new Error('Failed to fetch education posts')
    
    const data: PaginatedResponse = await response.json()
    posts.value = data.data
    filteredPosts.value = data.data
    pagination.value = data.meta
    currentPage.value = data.meta.current_page
  } catch (error) {
    console.error('Error fetching education posts:', error)
  } finally {
    isLoading.value = false
  }
}

// Generate the correct view URL based on institution type
function getViewUrl(post: EducationPost): string {
  if (!post.institutionType) {
    console.warn(`No institution type found for post ${post.id}`)
    return '/education'
  }
  
  try {
    const type = post.institutionType.toLowerCase().replace('_', '-')
    return `/education/${type}/${post.id}`
  } catch (error) {
    console.error('Error generating view URL:', error)
    return '/education'
  }
}

// Filter posts by category
function handleCategoryClick(categoryId: number) {
  selectedCategory.value = categoryId
  
  if (categoryId === 0) {
    filteredPosts.value = posts.value
  } else {
    const category = categories[categoryId]
    filteredPosts.value = posts.value.filter(post => 
      post.institutionType && post.institutionType === category.type
    )
  }
}

// Add pagination handler
async function handlePageChange(page: number) {
  if (page < 1 || (pagination.value && page > pagination.value.last_page)) return
  await fetchEducationPosts(page)
}

onMounted(() => {
  fetchEducationPosts()
})
</script>

<template>
  <main class="w-full">
    <div class="py-12 flex flex-col items-center justify-center gap-6">
      <page-header 
        title="Education"
        description="This module helps students to move around the city. It provides students with all academic information, such as the locations of the outstanding educational establishments, libraries, coaching centers, colleges, universities, and so on."
      />

      <section class="w-full overflow-x-auto flex gap-2 items-center justify-center">
        <button 
          v-for="category in categories"
          :key="category.id"
          @click="handleCategoryClick(category.id)"
          :class="{ 'bg-neutral-950 border-neutral-950 !bg-opacity-100 text-white': selectedCategory === category.id }"
          class="select-none py-2 px-4 text-sm font-medium bg-neutral-50 bg-opacity-20 text-neutral-950 rounded-full border border-neutral-300"
        >
          {{ category.name }}
        </button>
      </section>
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
          <card 
            :title="post.title" 
            :imgUrl="post.featuredImage"
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