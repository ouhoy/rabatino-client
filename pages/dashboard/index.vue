<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { EllipsisVerticalIcon } from '@heroicons/vue/20/solid'

interface Post {
  id: number
  title: string
  typeId: number
  description: string
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
const dangerDialogOpen = ref(false)
const selectedPostId = ref<number | null>(null)
const config = useRuntimeConfig()

// Fetch posts on mount
onMounted(async () => {
  try {
    // TODO: Replace with actual API endpoint
    const response = await fetch(`${config.public.apiBaseUrl}/posts`)
    const data = await response.json()
    posts.value = data
    filteredPosts.value = data
  } catch (error) {
    console.error('Error fetching posts:', error)
  }
})

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

async function handleDelete() {
  if (!selectedPostId.value) return

  try {
    await fetch(`${config.public.apiBaseUrl}/posts/${selectedPostId.value}`, {
      method: 'DELETE',
    })
    posts.value = posts.value.filter(post => post.id !== selectedPostId.value)
    filteredPosts.value = filteredPosts.value.filter(post => post.id !== selectedPostId.value)
  } catch (error) {
    console.error('Error deleting post:', error)
  }
}

const getPostTypeName = (typeId: number) => {
  const category = categories.find(cat => cat.id === typeId)
  return category?.name || 'Unknown'
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

    <!-- Posts Table -->
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
                    <NuxtLink :to="`/dashboard/edit/${post.id}`" :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700']">
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
  </div>
</template>

<style scoped>

</style>