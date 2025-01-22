<script setup lang="ts">
import { ref } from 'vue'
import { z } from 'zod'
import type { Restaurant } from '~/types/tourism'
import { TourismType } from '~/types/tourism'

const config = useRuntimeConfig()
const isLoading = ref(false)

// Add Zod schema for validation
const restaurantSchema = z.object({
  title: z.string().min(3, 'Restaurant name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  address: z.string().min(5, 'Address is required'),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  website: z.string().url().optional(),
  phone: z.string()
    .min(1, 'Phone number is required')
    .regex(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4}$/, 'Invalid phone number format'),
  email: z.string().email(),
  featuredImage: z.string().url(),
  rating: z.number().min(0).max(5),
  cuisine: z.string().min(2, 'Cuisine type is required'),
  priceRanges: z.string().min(1, 'Price range is required'),
  menus: z.string().min(1, 'Menus information is required'),
  openingHours: z.string().min(1, 'Opening hours are required')
})

// Add error state
const errors = ref({
  title: '',
  description: '',
  address: '',
  latitude: '',
  longitude: '',
  website: '',
  phone: '',
  email: '',
  featuredImage: '',
  rating: '',
  cuisine: '',
  priceRanges: '',
  menus: '',
  openingHours: ''
})

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
  type: TourismType.RESTAURANT,

  // Restaurant specific fields
  cuisine: '',
  priceRanges: '',
  menus: '',
  openingHours: '', // Fix the typo here (was openiningHours)
  takeout: false,
  delivery: false
})

const validateForm = () => {
  Object.keys(errors.value).forEach(key => {
    errors.value[key as keyof typeof errors.value] = ''
  })

  try {
    restaurantSchema.parse(formState.value)
    return true
  } catch (error) {
    if (error instanceof z.ZodError) {
      error.errors.forEach((err) => {
        if (err.path) {
          errors.value[err.path[0] as keyof typeof errors.value] = err.message
        }
      })
    }
    console.log('Validation errors:', errors.value) // Add this for debugging
    return false
  }
}

const handleSubmit = async () => {
  if (!validateForm()) {
    console.log('Form validation failed', errors.value)
    // Scroll to top of the form smoothly
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
    return
  }

  isLoading.value = true
  try {
    // Restructure the data to match API requirements
    const restaurantData = {
      title: formState.value.title,
      userId: 1, // Hardcoded for now, should come from auth context
      typeId: 3, // Tourism type for restaurants
      description: formState.value.description,
      address: formState.value.address,
      latitude: formState.value.latitude,
      longitude: formState.value.longitude,
      website: formState.value.website || null,
      phone: formState.value.phone,
      email: formState.value.email,
      featuredImage: formState.value.featuredImage,

      isActive: formState.value.isActive,
      rating: formState.value.rating,
      tourismType: 'RESTAURANT',

      cuisine: formState.value.cuisine,
      priceRanges: formState.value.priceRanges,
      menus: formState.value.menus,
      openingHours: formState.value.openingHours, // Fix the property name here too
      takeout: formState.value.takout,
      delivery: formState.value.delivery
    }

    const response = await fetch(`${config.public.apiBaseUrl}/tourism/restaurants`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(restaurantData)
    })

    if (!response.ok) {
      throw new Error('Failed to create restaurant')
    }

    const data = await response.json()
    console.log('Restaurant created successfully:', data)
    // Reset form
    formState.value = {
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
      isActive: true,
      rating: 0,
      type: TourismType.RESTAURANT,
      cuisine: '',
      priceRanges: '',
      menus: '',
      openingHours: '',
      takout: false,
      delivery: false
    }
  } catch (error) {
    console.error('Error creating restaurant:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-12">
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
          :error="errors.title"
        />

        <FormTextarea
          class="col-span-full"
          v-model="formState.description"
          label="Description"
          placeholder="Describe your restaurant's atmosphere and cuisine..."
          :rows="4"
          help-text="Highlight your restaurant's unique offerings, specialties, and dining experience."
          :error="errors.description"
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
          :error="errors.address"
        />

        <FormInput
          class="sm:col-span-3"
          v-model="formState.website"
          label="Website"
          placeholder="www.example.com"
          type="url"
          :error="errors.website"
        />

        <FormInput
          class="sm:col-span-3"
          v-model="formState.phone"
          label="Phone"
          placeholder="+1 (555) 000-0000"
          type="tel"
          :error="errors.phone"
        />

        <FormInput
          class="sm:col-span-4"
          v-model="formState.email"
          label="Email"
          placeholder="contact@restaurant.com"
          type="email"
          :error="errors.email"
        />

        <!-- Add Location Coordinates -->
        <FormInput
          class="sm:col-span-3"
          v-model="formState.latitude"
          label="Latitude"
          placeholder="e.g., 40.7128"
          type="number"
          :error="errors.latitude"
        />

        <FormInput
          class="sm:col-span-3"
          v-model="formState.longitude"
          label="Longitude"
          placeholder="e.g., -74.0060"
          type="number"
          :error="errors.longitude"
        />
      </div>
    </div>

    <!-- Restaurant Details -->
    <div class="border-b border-gray-900/10 pb-12">
      <h2 class="text-2xl text-neutral-900 font-medium">Restaurant Details</h2>
      <p class="text-base text-gray-600">Tell us more about your cuisine and services.</p>

      <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 max-w-3xl">
        <!-- Add Rating field at the top -->
        <FormInput
          class="sm:col-span-2"
          v-model="formState.rating"
          label="Rating"
          placeholder="e.g., 4.5"
          type="number"
          min="0"
          max="5"
          step="0.1"
          :error="errors.rating"
        />

        <!-- Active Status -->
        <div class="sm:col-span-2">
          <label class="inline-flex items-center">
            <input 
              type="checkbox" 
              v-model="formState.isActive"
              class="rounded border-gray-300 text-blue-600 focus:ring-blue-600"
            />
            <span class="ml-2 text-sm text-gray-900">Active Listing</span>
          </label>
        </div>

        <FormInput
          class="sm:col-span-3"
          v-model="formState.cuisine"
          label="Cuisine Type"
          placeholder="e.g., Italian, Japanese, Mediterranean"
          type="text"
          :error="errors.cuisine"
        />

        <FormInput
          class="sm:col-span-3"
          v-model="formState.priceRanges"
          label="Price Range"
          placeholder="e.g., $20 - $50 per person"
          type="text"
          :error="errors.priceRanges"
        />

        <FormInput
          class="sm:col-span-3"
          v-model="formState.openingHours"
          label="Opening Hours"
          placeholder="e.g., 11:00 AM - 10:00 PM"
          type="text"
          :error="errors.openingHours"
        />

        <FormInput
          class="sm:col-span-full"
          v-model="formState.menus"
          label="Available Menus"
          placeholder="e.g., Lunch, Dinner, Weekend Brunch"
          type="text"
          :error="errors.menus"
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
          :error="errors.featuredImage"
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
        {{ isLoading ? 'Creating Restaurant...' : 'Create Restaurant Listing' }}
      </button>
    </div>
  </form>
</template>
