<script setup lang="ts">
import { ref } from 'vue'
import type { TouristAttraction } from '~/types/tourism'

const formState = ref({
  title: '',
  description: '',
  images: [],
  featuredImage: '',
  address: '',
  website: '',
  phone: '',
  email: '',
  attractionType: '',
  bestVisitTime: '',
  entryFee: '',
  openingHours: '',
  guideTours: false,
})

const commonAttractionTypes = [
  'Museum',
  'Park',
  'Historical Site',
  'Amusement Park',
  'Zoo',
  'Aquarium',
  'Beach',
  'Landmark',
  'Nature Reserve',
  'Cultural Center'
]
</script>

<template>
  <form class="space-y-12">
    <!-- Basic Information -->
    <div class="border-b border-gray-900/10 pb-12">
      <h2 class="text-2xl text-neutral-900 font-medium">Basic Information</h2>
      <p class="text-base text-gray-600">Provide the main details about the tourist attraction.</p>

      <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 max-w-3xl">
        <FormInput
          class="sm:col-span-4"
          v-model="formState.title"
          label="Attraction Name"
          placeholder="Enter the name of the attraction"
          type="text"
        />

        <FormTextarea
          class="col-span-full"
          v-model="formState.description"
          label="Description"
          placeholder="Describe what makes this attraction special..."
          :rows="4"
          help-text="Highlight unique features, historical significance, and special amenities."
        />
      </div>
    </div>

    <!-- Location and Contact -->
    <div class="border-b border-gray-900/10 pb-12">
      <h2 class="text-2xl text-neutral-900 font-medium">Location & Contact Information</h2>
      <p class="text-base text-gray-600">Help visitors find and reach the attraction.</p>

      <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 max-w-3xl">
        <FormInput
          class="sm:col-span-full"
          v-model="formState.address"
          label="Address"
          placeholder="Full attraction address"
          type="text"
        />

        <FormInput
          class="sm:col-span-3"
          v-model="formState.website"
          label="Website"
          placeholder="www.example.com"
          type="url"
        />

        <FormInput
          class="sm:col-span-3"
          v-model="formState.phone"
          label="Phone"
          placeholder="+1 (555) 000-0000"
          type="tel"
        />

        <FormInput
          class="sm:col-span-4"
          v-model="formState.email"
          label="Email"
          placeholder="info@attraction.com"
          type="email"
        />
      </div>
    </div>

    <!-- Attraction Details -->
    <div class="border-b border-gray-900/10 pb-12">
      <h2 class="text-2xl text-neutral-900 font-medium">Attraction Details</h2>
      <p class="text-base text-gray-600">Provide specific information about the attraction.</p>

      <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 max-w-3xl">
        <FormInput
          class="sm:col-span-3"
          v-model="formState.attractionType"
          label="Attraction Type"
          placeholder="e.g., Museum, Park, Historical Site"
          type="text"
        />

        <FormInput
          class="sm:col-span-3"
          v-model="formState.bestVisitTime"
          label="Best Time to Visit"
          placeholder="e.g., Spring, Summer, Morning"
          type="text"
        />

        <FormInput
          class="sm:col-span-2"
          v-model="formState.entryFee"
          label="Entry Fee"
          placeholder="e.g., $10, Free"
          type="text"
        />

        <FormInput
          class="sm:col-span-4"
          v-model="formState.openingHours"
          label="Opening Hours"
          placeholder="e.g., 9:00 AM - 5:00 PM"
          type="text"
        />

        <div class="col-span-full">
          <label class="text-sm font-medium text-gray-900">Guided Tours Available</label>
          <div class="mt-4 flex items-center gap-2">
            <input 
              type="checkbox" 
              id="guideTours"
              v-model="formState.guideTours"
              class="rounded border-gray-300 text-blue-600 focus:ring-blue-600"
            />
            <label for="guideTours" class="text-sm text-gray-900">Yes</label>
          </div>
        </div>
      </div>
    </div>

    <!-- Images -->
    <div class="border-b border-gray-900/10 pb-12">
      <h2 class="text-2xl text-neutral-900 font-medium">Attraction Images</h2>
      <p class="text-base text-gray-600">Provide image URLs for your attraction.</p>

      <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 max-w-3xl">
        <FormInput
          class="sm:col-span-full"
          v-model="formState.featuredImage"
          label="Featured Image URL"
          placeholder="https://example.com/image.jpg"
          type="url"
        />
      </div>
    </div>

    <!-- Submit Button -->
    <div class="mt-6 flex items-center justify-end gap-x-6">
      <button type="submit" class="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        Create Attraction Listing
      </button>
    </div>
  </form>
</template>