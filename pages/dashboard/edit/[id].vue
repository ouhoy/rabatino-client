<script setup lang="ts">
const route = useRoute()
const config = useRuntimeConfig()
const isLoading = ref(true)
const error = ref<string | null>(null)
const postData = ref(null)
const postType = ref<string | null>(null)

// Map typeId to form components and endpoints
const typeToComponent = {
  1: 'forms-jobs-create-job-form',
  2: 'forms-education-create-college-form',
  3: 'forms-business-create-business-post-form',
  4: 'forms-tourism-create-hotel-form'
}

const typeToEndpoint = {
  1: 'jobs',
  2: 'education/colleges',
  3: 'business',
  4: 'tourism/hotels'
}

// Fetch post data on mount
onMounted(async () => {
  try {
    const response = await fetch(`${config.public.apiBaseUrl}/posts/${route.params.id}`)
    if (!response.ok) throw new Error('Failed to fetch post')
    
    const data = await response.json()
    postData.value = data
    postType.value = typeToComponent[data.typeId as keyof typeof typeToComponent]
  } catch (err) {
    console.error('Error fetching post:', err)
    error.value = 'Failed to load post data'
  } finally {
    isLoading.value = false
  }
})

// Handle form submission from child component
const handleUpdate = async (formData: any) => {
  try {
    const endpoint = typeToEndpoint[postData.value.typeId as keyof typeof typeToEndpoint]
    const response = await fetch(`${config.public.apiBaseUrl}/${endpoint}/${route.params.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    })

    if (!response.ok) throw new Error('Failed to update post')
    
    // Navigate back to dashboard on success
    navigateTo('/dashboard')
  } catch (err) {
    console.error('Error updating post:', err)
    error.value = 'Failed to update post'
  }
}
</script>

<template>
  <div class="w-full max-w-5xl mx-auto py-8">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="p-4 bg-red-50 border border-red-200 rounded-lg">
      <p class="text-red-600">{{ error }}</p>
    </div>

    <!-- Dynamic Form -->
    <div v-else>
      <h1 class="text-2xl font-bold mb-8">Edit Post</h1>
      <component 
        :is="postType" 
        v-if="postType && postData"
        :initial-data="postData"
        :is-editing="true"
        @submit="handleUpdate"
      />
    </div>
  </div>
</template>
