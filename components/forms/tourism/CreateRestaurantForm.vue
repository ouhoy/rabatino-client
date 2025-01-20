<script setup lang="ts">
import { ref } from 'vue'
import type { Restaurant } from '~/types/tourism'

const formState = ref({
  title: '',
  description: '',
  images: [],
  featuredImage: '',
  address: '',
  website: '',
  phone: '',
  email: '',
  cuisine: '',
  priceRanges: '',
  menus: '',
  openiningHours: '',
  takout: false,
  delivery: false
})
</script>

<template>
  <form class="space-y-12">
    <!-- Basic Information -->
    <div class="border-b border-gray-900/10 pb-12">
      <h2 class="text-2xl text-neutral-900 font-medium">Basic Information</h2>
      <p class="text-base text-gray-600">Provide the main details about your restaurant.</p>

      <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 max-w-3xl">
        <FormInput
          class="sm:col-span-4"
          v-model="formState.title"
          label="Restaurant Name"
          placeholder="Enter the name of your restaurant"
          type="text"
        />

        <FormTextarea
          class="col-span-full"
          v-model="formState.description"
          label="Description"
          placeholder="Describe your restaurant's atmosphere and cuisine..."
          :rows="4"
          help-text="Highlight your restaurant's unique offerings, specialties, and dining experience."
        />
      </div>
    </div>

    <!-- Location and Contact -->
    <div class="border-b border-gray-900/10 pb-12">
      <h2 class="text-2xl text-neutral-900 font-medium">Location & Contact Information</h2>
      <p class="text-base text-gray-600">Help customers find and reach your restaurant.</p>

      <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 max-w-3xl">
        <FormInput
          class="sm:col-span-full"
          v-model="formState.address"
          label="Address"
          placeholder="Full restaurant address"
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
          placeholder="contact@restaurant.com"
          type="email"
        />
      </div>
    </div>

    <!-- Restaurant Details -->
    <div class="border-b border-gray-900/10 pb-12">
      <h2 class="text-2xl text-neutral-900 font-medium">Restaurant Details</h2>
      <p class="text-base text-gray-600">Tell us more about your cuisine and services.</p>

      <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 max-w-3xl">
        <FormInput
          class="sm:col-span-3"
          v-model="formState.cuisine"
          label="Cuisine Type"
          placeholder="e.g., Italian, Japanese, Mediterranean"
          type="text"
        />

        <FormInput
          class="sm:col-span-3"
          v-model="formState.priceRanges"
          label="Price Range"
          placeholder="e.g., $20 - $50 per person"
          type="text"
        />

        <FormInput
          class="sm:col-span-3"
          v-model="formState.openiningHours"
          label="Opening Hours"
          placeholder="e.g., 11:00 AM - 10:00 PM"
          type="text"
        />

        <FormInput
          class="sm:col-span-full"
          v-model="formState.menus"
          label="Available Menus"
          placeholder="e.g., Lunch, Dinner, Weekend Brunch"
          type="text"
        />

        <div class="col-span-full">
          <label class="text-sm font-medium text-gray-900">Services</label>
          <div class="mt-4 space-y-3">
            <div class="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="takeout"
                v-model="formState.takout"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-600"
              />
              <label for="takeout" class="text-sm text-gray-900">Takeout Available</label>
            </div>
            <div class="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="delivery"
                v-model="formState.delivery"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-600"
              />
              <label for="delivery" class="text-sm text-gray-900">Delivery Available</label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Images -->
    <div class="border-b border-gray-900/10 pb-12">
      <h2 class="text-2xl text-neutral-900 font-medium">Restaurant Images</h2>
      <p class="text-base text-gray-600">Provide image URLs for your restaurant.</p>

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
        Create Restaurant Listing
      </button>
    </div>
  </form>
</template>
