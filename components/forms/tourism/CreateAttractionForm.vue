<script setup lang="ts">
import { ref } from 'vue'
import type { TouristAttraction } from '~/types/tourism'
import { TourismType } from '~/types/tourism'

const formState = ref({
  // Post interface fields
  title: '',
  description: '',
  createdAt: new Date(),
  userId: '1',
  address: '',
  latitude: 0,
  longitude: 0,
  website: '',
  phone: '',
  email: '',
  featuredImage: '',

  // Tourism interface fields
  isActive: true,
  rating: 0,
  type: TourismType.ATTRACTION,

  // Tourist Attraction specific fields
  attractionType: '',
  bestVisitTime: '',
  entryFee: 0,
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
      <p class="text-base text-gray-600">Provide the main details about your tourist attraction.</p>

      <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 max-w-3xl">
        <FormInput
          class="sm:col-span-4"
          v-model="formState.title"
          label="Attraction Name"
          placeholder="Enter the name of your attraction"
          type="text"
        />

        <FormTextarea
          class="col-span-full"
          v-model="formState.description"
          label="Description"
          placeholder="Describe what makes this attraction special..."
          :rows="4"
          help-text="Highlight unique features and visitor experience."
        />
      </div>
    </div>

    <!-- Location and Contact -->
    <div class="border-b border-gray-900/10 pb-12">
      <h2 class="text-2xl text-neutral-900 font-medium">Location & Contact Information</h2>
      <p class="text-base text-gray-600">Help visitors find and reach your attraction.</p>

      <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 max-w-3xl">
        <FormInput
          class="sm:col-span-full"
          v-model="formState.address"
          label="Address"
          placeholder="Full address"
          type="text"
        />

        <FormInput
          class="sm:col-span-3"
          v-model="formState.latitude"
          label="Latitude"
          placeholder="e.g., 40.7128"
          type="number"
        />

        <FormInput
          class="sm:col-span-3"
          v-model="formState.longitude"
          label="Longitude"
          placeholder="e.g., -74.0060"
          type="number"
        />

        <!-- Contact fields -->
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
          placeholder="contact@attraction.com"
          type="email"
        />
      </div>
    </div>

    <!-- Attraction Details -->
    <div class="border-b border-gray-900/10 pb-12">
      <h2 class="text-2xl text-neutral-900 font-medium">Attraction Details</h2>
      <p class="text-base text-gray-600">Specific information about your attraction.</p>

      <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 max-w-3xl">
        <FormInput
          class="sm:col-span-2"
          v-model="formState.rating"
          label="Rating"
          placeholder="e.g., 4.5"
          type="number"
          min="0"
          max="5"
          step="0.1"
        />

        <FormInput
          class="sm:col-span-3"
          v-model="formState.attractionType"
          label="Attraction Type"
          placeholder="e.g., Museum, Park, Historical Site"
          type="text"
        />

        <FormInput
          class="sm:col-span-3"
          v-model="formState.openingHours"
          label="Opening Hours"
          placeholder="e.g., 9:00 AM - 5:00 PM"
          type="text"
        />

        <FormInput
          class="sm:col-span-3"
          v-model="formState.bestVisitTime"
          label="Best Time to Visit"
          placeholder="e.g., Morning, Spring Season"
          type="text"
        />

        <FormInput
          class="sm:col-span-3"
          v-model="formState.entryFee"
          label="Entry Fee"
          placeholder="Enter amount in dollars"
          type="number"
          min="0"
        />

        <!-- Checkboxes -->
        <div class="col-span-full space-y-4">
          <div class="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="isActive"
              v-model="formState.isActive"
              class="rounded border-gray-300 text-blue-600 focus:ring-blue-600"
            />
            <label for="isActive" class="text-sm text-gray-900">Active Listing</label>
          </div>

          <div class="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="guideTours"
              v-model="formState.guideTours"
              class="rounded border-gray-300 text-blue-600 focus:ring-blue-600"
            />
            <label for="guideTours" class="text-sm text-gray-900">Guided Tours Available</label>
          </div>
        </div>
      </div>
    </div>

    <!-- Featured Image -->
    <div class="border-b border-gray-900/10 pb-12">
      <h2 class="text-2xl text-neutral-900 font-medium">Featured Image</h2>
      <p class="text-base text-gray-600">Add a featured image for your attraction.</p>

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