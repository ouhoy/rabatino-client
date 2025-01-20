<script setup lang="ts">
import { ref, computed } from 'vue'
import type { BusinessPost } from '~/types/business'

const formState = ref({
  title: '',
  body: '',
  featuredImg: '',
  tags: [] as string[]
})

const tagsList = computed({
  get: () => formState.value.tags.join(', '),
  set: (value: string) => {
    formState.value.tags = value.split(',').map(tag => tag.trim()).filter(Boolean)
  }
})
</script>

<template>
  <form class="space-y-12">
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
        />

        <FormTextarea
          class="col-span-full"
          v-model="formState.body"
          label="Post Content"
          placeholder="Write your post content..."
          :rows="6"
          help-text="Share your business news, updates, or insights"
        />

        <!-- Tags -->
        <FormTextarea
          class="col-span-full"
          v-model="tagsList"
          label="Tags"
          placeholder="Enter tags separated by commas (e.g., business, startup, technology)"
          :rows="2"
          help-text="Add relevant tags to help others find your post"
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
        />
      </div>
    </div>

    <!-- Submit Button -->
    <div class="mt-6 flex items-center justify-end gap-x-6">
      <button type="submit" class="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        Publish Post
      </button>
    </div>
  </form>
</template>
