<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { EllipsisVerticalIcon } from '@heroicons/vue/20/solid'
definePageMeta({
  layout: 'dashboard',


})

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
  data: Post[]
}

interface Post {
  id: number
  title: string
  typeId: number
  description: string
  userId: number
  address: string
  latitude: string
  longitude: string
  website: string | null
  phone: string | null
  views: number
  email: string | null
  featuredImage: string
  createdAt: string
  updatedAt: string
}

// Categories based on PostType enum
const categories = [
  { id: 0, name: 'All Posts' },
  { id: 1, name: 'Jobs' },
  { id: 2, name: 'Education' },
  { id: 3, name: 'Business' },
  { id: 4, name: 'Tourism' }
]

const selectedCategory = ref(0)
const posts = ref<Post[]>([])
const filteredPosts = ref<Post[]>([])
const pagination = ref<PaginatedResponse['meta'] | null>(null)
const currentPage = ref(1)
const dangerDialogOpen = ref(false)
const selectedPostId = ref<number | null>(null)
const config = useRuntimeConfig()
const isLoading = ref(true)
const error = ref<string | null>(null)

// Fetch posts on mount
onMounted(async () => {
  await fetchPosts()
})

async function fetchPosts(page = 1) {
  try {
    isLoading.value = true
    error.value = null
    
    const response = await fetch(`${config.public.apiBaseUrl}/posts?limit=150`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data: PaginatedResponse = await response.json()
    posts.value = data.data
    filteredPosts.value = data.data
    pagination.value = data.meta
    currentPage.value = data.meta.currentPage
  } catch (err) {
    console.error('Error fetching posts:', err)
    error.value = 'Failed to load posts. Please try again later.'
  } finally {
    isLoading.value = false
  }
}

// Handle category filter
function handleCategoryClick(categoryId: number) {
  selectedCategory.value = categoryId
  if (categoryId === 0) {
    filteredPosts.value = posts.value
  } else {
    filteredPosts.value = posts.value.filter(post => post.typeId === categoryId)
  }
}

// Dialog handlers
function updateDialogOpenState(isOpen: boolean) {
  dangerDialogOpen.value = isOpen
}

function handleDeleteClick(id: number) {
  selectedPostId.value = id
  dangerDialogOpen.value = true
}

const getEndpointByType = (typeId: number, postId: number) => {
  switch (typeId) {
    case 3: // Business type
      return `${config.public.apiBaseUrl}/business/${postId}`
    default:
      return `${config.public.apiBaseUrl}/posts/${postId}`
  }
}

async function handleDelete() {
  if (!selectedPostId.value) return

  try {
    const postToDelete = posts.value.find(post => post.id === selectedPostId.value)
    if (!postToDelete) return

    const endpoint = getEndpointByType(postToDelete.typeId, selectedPostId.value)
    const response = await fetch(endpoint, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    if (result === true) {
      // Remove post from both lists
      posts.value = posts.value.filter(post => post.id !== selectedPostId.value)
      filteredPosts.value = filteredPosts.value.filter(post => post.id !== selectedPostId.value)
      dangerDialogOpen.value = false
    } else {
      throw new Error('Delete operation failed')
    }
  } catch (err) {
    console.error('Error deleting post:', err)
    error.value = 'Failed to delete post. Please try again.'
  }
}

const getPostTypeName = (typeId: number) => {
  const category = categories.find(cat => cat.id === typeId)
  return category?.name || 'Unknown'
}

// Add pagination handlers
async function handlePageChange(page: number) {
  if (page < 1 || (pagination.value && page > pagination.value.lastPage)) return
  await fetchPosts(page)
}

enum InstitutionType {
  UNIVERSITY = 'UNIVERSITY',
  COLLEGE = 'COLLEGE',
  LIBRARY = 'LIBRARY',
  COACHING_CENTER = 'COACHING_CENTER',
  STUDY_CENTER = 'STUDY_CENTER'
}

enum TourismType {
  HOTEL = 'HOTEL',
  RESTAURANT = 'RESTAURANT',
  ATTRACTION = 'ATTRACTION',
  THEATER = 'THEATER',
  BANK = 'BANK'
}

// Add this function to generate the correct edit URL
function getEditUrl(post: Post): string {
  switch (post.typeId) {
    case 1: // Jobs
      return `/dashboard/edit/jobs/${post.id}`
    case 2: // Education
      if ('institutionType' in post) {
        const type = (post as any).institutionType.toLowerCase().replace('_', '-')
        return `/dashboard/edit/education/${type}/${post.id}`
      }
      return `/dashboard/edit/${post.id}`
    case 3: // Business
      return `/dashboard/edit/business/${post.id}`
    case 4: // Tourism
      if ('tourismType' in post) {
        const type = (post as any).tourismType.toLowerCase()
        return `/dashboard/edit/tourism/${type}/${post.id}`
      }
      return `/dashboard/edit/${post.id}`
    default:
      return `/dashboard/edit/${post.id}`
  }
}

// Add this function to generate the correct view URL
function getViewUrl(post: Post): string {
  switch (post.typeId) {
    case 1: // Jobs
      return `/career/${post.id}`
    case 2: // Education
      if ('institutionType' in post) {
        const type = (post as any).institutionType.toLowerCase().replace('_', '-')
        return `/education/${type}/${post.id}`
      }
      return `/education/${post.id}`
    case 3: // Business
      return `/business/${post.id}`
    case 4: // Tourism
      if ('tourismType' in post) {
        const type = (post as any).tourismType.toLowerCase()
        return `/tourism/${type}/${post.id}`
      }
      return `/tourism/${post.id}`
    default:
      return `/${post.id}`
  }
}
</script>

<template>
  <div class="w-full mb-20">
    <!-- Delete Confirmation Dialog -->
    <DangerDialog 
      @takeAction="handleDelete" 
      @toggle="updateDialogOpenState" 
      title="Delete Post"
      :is-open="dangerDialogOpen" 
      action="Delete"
    >
      Are you sure you want to delete this post? This action cannot be undone.
    </DangerDialog>
    
    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="p-4 bg-red-50 border border-red-200 rounded-lg my-4">
      <p class="text-red-600">{{ error }}</p>
    </div>

    <!-- Content -->
    <div v-else>
      <div class="flex mb-12 justify-between items-center">
        <h3 class="text-2xl font-semibold whitespace-nowrap leading-none tracking-tight">Posts</h3>
        <nuxt-link to="/dashboard/create" class="">
          <button type="submit" class="rounded-md bg-blue-600 px-3 flex justify-center items-center py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">New Post</button>
        </nuxt-link>
      </div>

      <!-- Categories Filter -->
      <section class="w-full mb-8 overflow-x-auto flex gap-2 items-center justify-start">
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

      <!-- Empty State -->
      <div v-if="filteredPosts.length === 0" class="text-center py-12">
        <p class="text-gray-500">No posts found.</p>
      </div>

      <!-- Posts Table -->
      <div v-else class="space-y-6">
        <div class="relative w-full overflow-auto">
          <table class="w-full caption-bottom text-sm">
            <thead class="[&_tr]:border-b">
              <tr class="border-b transition-colors hover:bg-muted/50">
                <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Title</th>
                <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Type</th>
                <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>

            <tbody class="[&_tr:last-child]:border-0">
              <tr v-for="post in filteredPosts" :key="post.id" class="border-b transition-colors hover:bg-muted/50">
                <td class="p-4 align-middle font-medium">
                  {{ post.title }}
                </td>
                <td class="p-4 align-middle">
                  {{ getPostTypeName(post.typeId) }}
                </td>
                <td class="p-4 align-middle">
                  <Menu as="div" class="relative inline-block text-left">
                    <MenuButton class="inline-flex items-center p-2 rounded-md hover:bg-gray-100">
                      <EllipsisVerticalIcon class="h-5 w-5 text-gray-400" />
                    </MenuButton>

                    <MenuItems class="absolute right-0 z-10 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <MenuItem v-slot="{ active }">
                        <NuxtLink :to="getViewUrl(post)" 
                                  :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700']">
                          View
                        </NuxtLink>
                      </MenuItem>
                      <MenuItem v-slot="{ active }">
                        <NuxtLink :to="getEditUrl(post)" 
                                  :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700']">
                          Edit
                        </NuxtLink>
                      </MenuItem>
                      <MenuItem v-slot="{ active }">
                        <button 
                          @click="handleDeleteClick(post.id)"
                          :class="[active ? 'bg-red-50' : '', 'w-full text-left px-4 py-2 text-sm text-red-600']"
                        >
                          Delete
                        </button>
                      </MenuItem>
                    </MenuItems>
                  </Menu>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="pagination" class="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6">
          <div class="flex flex-1 justify-between sm:hidden">
            <button
              :disabled="!pagination.previousPageUrl"
              @click="handlePageChange(currentPage - 1)"
              class="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              :disabled="!pagination.nextPageUrl"
              @click="handlePageChange(currentPage + 1)"
              class="relative ml-3 inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Showing <span class="font-medium">{{ ((currentPage - 1) * pagination.perPage) + 1 }}</span> to <span class="font-medium">{{ Math.min(currentPage * pagination.perPage, pagination.total) }}</span> of <span class="font-medium">{{ pagination.total }}</span> results
              </p>
            </div>
            <div>
              <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button
                  v-for="page in pagination.lastPage"
                  :key="page"
                  @click="handlePageChange(page)"
                  :class="[
                    page === currentPage 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white text-gray-900 hover:bg-gray-50',
                    'relative inline-flex items-center px-4 py-2 text-sm font-medium focus:z-20'
                  ]"
                >
                  {{ page }}
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>