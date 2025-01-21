<script setup lang="ts">
import { ref, computed } from 'vue'
import { z } from 'zod'
import type { BusinessPost } from '~/types/business'

const config = useRuntimeConfig()
const isLoading = ref(false)

// Zod schema based on BusinessPost interface
const businessPostSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title is too long'),
  body: z.string().min(10, 'Content must be at least 10 characters'),
  featuredImg: z.string().url('Must be a valid URL'),
  tags: z.array(z.string()).min(1, 'At least one tag is required'),
})

const formState = ref({
  title: '',
  body: '',
  featuredImg: '',
  tags: [] as string[]
})

// Form errors state
const errors = ref({
  title: '',
  body: '',
  featuredImg: '',
  tags: ''
})

const tagsList = computed({
  get: () => formState.value.tags.join(', '),
  set: (value: string) => {
    formState.value.tags = value.split(',').map(tag => tag.trim()).filter(Boolean)
  }
})

const validateForm = () => {
  // Reset errors
  errors.value = {
    title: '',
    body: '',
    featuredImg: '',
    tags: ''
  }

  try {
    businessPostSchema.parse(formState.value)
    return true
  } catch (error) {
    if (error instanceof z.ZodError) {
      error.errors.forEach((err) => {
        if (err.path) {
          // Set error message for the specific field
          errors.value[err.path[0] as keyof typeof errors.value] = err.message
        }
      })
    }
    return false
  }
}

const handleSubmit = async () => {
  if (!validateForm()) {
    console.log('Form validation failed', errors.value)
    return
  }

  isLoading.value = true
  try {
    const response = await fetch(`${config.public.apiBaseUrl}/business/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formState.value)
    })

    if (!response.ok) {
      throw new Error('Failed to create post')
    }

    const data = await response.json()
    console.log('Post created successfully:', data)
    // Reset form
    formState.value = {
      title: '',
      body: '',
      featuredImg: '',
      tags: []
    }
  } catch (error) {
    console.error('Error creating post:', error)
    // Handle error (you might want to show an error message to the user)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-12">
    <!-- Basic Information -->
    <div class="border-b border-gray-900/10 pb-12">
      <h2 class="text-2xl text-neutral-900 font-medium">Post Information</h2>
      <p class="text-base text-gray-600">Create your business news or update post.</p>

      <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 max-w-3xl">
        <FormInput
          class="sm:col-span-4"
          v-model="formState.title"
          label="Post Title"
          placeholder="Enter the title of your post"
          type="text"
          :error="errors.title"
        />

        <FormTextarea
          class="col-span-full"
          v-model="formState.body"
          label="Post Content"
          placeholder="Write your post content..."
          :rows="6"
          help-text="Share your business news, updates, or insights"
          :error="errors.body"
        />

        <!-- Tags -->
        <FormTextarea
          class="col-span-full"
          v-model="tagsList"
          label="Tags"
          placeholder="Enter tags separated by commas (e.g., business, startup, technology)"
          :rows="2"
          help-text="Add relevant tags to help others find your post"
          :error="errors.tags"
        />
      </div>
    </div>

    <!-- Featured Image -->
    <div class="border-b border-gray-900/10 pb-12">
      <h2 class="text-2xl text-neutral-900 font-medium">Featured Image</h2>
      <p class="text-base text-gray-600">Add a featured image for your post.</p>

      <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 max-w-3xl">
        <FormInput
          class="sm:col-span-full"
          v-model="formState.featuredImg"
          label="Featured Image URL"
          placeholder="https://example.com/image.jpg"
          type="url"
          :error="errors.featuredImg"
        />
      </div>
    </div>

    <!-- Submit Button -->
    <div class="mt-6 flex items-center justify-end gap-x-6">
      <button 
        type="submit" 
        class="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        :disabled="isLoading"
      >
        {{ isLoading ? 'Publishing...' : 'Publish Post' }}
      </button>
    </div>
  </form>
</template>
