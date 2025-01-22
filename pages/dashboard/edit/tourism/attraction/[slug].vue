<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { z } from 'zod'
import type { TouristAttraction } from '~/types/tourism'
import { TourismType } from '~/types/tourism'
import { useRoute, useRouter } from 'vue-router'

const config = useRuntimeConfig()
const isLoading = ref(false)

const route = useRoute()
const slug = route.params.slug
const router = useRouter()

// Add loading state for initial fetch
const isFetchingData = ref(false)
const fetchError = ref<string | null>(null)

// Fetch attraction data on mount
onMounted(async () => {
  await fetchAttractionData()
})

async function fetchAttractionData() {
  try {
    isFetchingData.value = true
    fetchError.value = null

    const response = await fetch(`${config.public.apiBaseUrl}/tourism/attractions/${slug}`)
    if (!response.ok) {
      throw new Error('Failed to fetch attraction data')
    }

    const data = await response.json()
    
    // Populate form state with fetched data
    formState.value = {
      title: data.title,
      description: data.description,
      createdAt: new Date(data.createdAt),
      userId: data.userId.toString(),
      address: data.address,
      latitude: parseFloat(data.latitude),
      longitude: parseFloat(data.longitude),
      website: data.website || '',
      phone: data.phone || '',
      email: data.email || '',
      featuredImage: data.featuredImage,
      isActive: data.isActive,
      rating: parseFloat(data.rating),
      type: TourismType.ATTRACTION,
      attractionType: data.attractionType,
      bestVisitTime: data.bestVisitTime,
      entryFee: parseFloat(data.entryFee),
      openingHours: data.openingHours,
      guideTours: data.guideTours,
    }
  } catch (error) {
    console.error('Error fetching attraction:', error)
    fetchError.value = 'Failed to load attraction data. Please try again.'
  } finally {
    isFetchingData.value = false
  }
}

// Add Zod schema for validation
const attractionSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  address: z.string().min(5, 'Address is required'),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  website: z.string().url().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  featuredImage: z.string().url(),
  attractionType: z.string().min(2),
  bestVisitTime: z.string().min(2),
  entryFee: z.number().min(0),
  openingHours: z.string().min(2),
  guideTours: z.boolean(),
  rating: z.number().min(0).max(5),
  isActive: z.boolean()
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
  attractionType: '',
  bestVisitTime: '',
  entryFee: '',
  openingHours: '',
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

const validateForm = () => {
  // Reset errors
  Object.keys(errors.value).forEach(key => {
    errors.value[key as keyof typeof errors.value] = ''
  })

  try {
    attractionSchema.parse(formState.value)
    return true
  } catch (error) {
    if (error instanceof z.ZodError) {
      error.errors.forEach((err) => {
        if (err.path) {
          errors.value[err.path[0] as keyof typeof errors.value] = err.message
        }
      })
    }
    return false
  }
}

// Modify handleSubmit to use PUT method for updates
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
    const attractionData = {
      title: formState.value.title,
      userId: 1, // Hardcoded for now, should come from auth context
      typeId: 4, // Tourism type
      description: formState.value.description,
      address: formState.value.address,
      latitude: formState.value.latitude,
      longitude: formState.value.longitude,
      website: formState.value.website || null,
      phone: formState.value.phone || null,
      email: formState.value.email || null,
      featuredImage: formState.value.featuredImage,

      isActive: formState.value.isActive,
      rating: formState.value.rating,
      tourismType: 'ATTRACTION',

      attractionType: formState.value.attractionType,
      bestVisitTime: formState.value.bestVisitTime,
      entryFee: Number(formState.value.entryFee),
      openingHours: formState.value.openingHours,
      guideTours: formState.value.guideTours
    }

    const response = await fetch(`${config.public.apiBaseUrl}/tourism/attractions/${slug}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(attractionData)
    })

    if (!response.ok) {
      throw new Error('Failed to update attraction')
    }

    const data = await response.json()
    console.log('Attraction updated successfully:', data)
    
    // Redirect to dashboard or show success message
    router.push('/dashboard')
  } catch (error) {
    console.error('Error updating attraction:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Loading State -->
    <div v-if="isFetchingData" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="fetchError" class="p-4 bg-red-50 border border-red-200 rounded-lg">
      <p class="text-red-600">{{ fetchError }}</p>
    </div>

    <!-- Form -->
    <form v-else @submit.prevent="handleSubmit" class="space-y-12">
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
              :error="errors.title"
          />

          <FormTextarea
              class="col-span-full"
              v-model="formState.description"
              label="Description"
              placeholder="Describe what makes this attraction special..."
              :rows="4"
              help-text="Highlight unique features and visitor experience."
              :error="errors.description"
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
              :error="errors.address"
          />

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

          <!-- Contact fields -->
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
              placeholder="contact@attraction.com"
              type="email"
              :error="errors.email"
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
              :error="errors.attractionType"
          />

          <FormInput
              class="sm:col-span-3"
              v-model="formState.openingHours"
              label="Opening Hours"
              placeholder="e.g., 9:00 AM - 5:00 PM"
              type="text"
              :error="errors.openingHours"
          />

          <FormInput
              class="sm:col-span-3"
              v-model="formState.bestVisitTime"
              label="Best Time to Visit"
              placeholder="e.g., Morning, Spring Season"
              type="text"
              :error="errors.bestVisitTime"
          />

          <FormInput
              class="sm:col-span-3"
              v-model="formState.entryFee"
              label="Entry Fee"
              placeholder="Enter amount in dollars"
              type="number"
              min="0"
              :error="errors.entryFee"
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
              :error="errors.featuredImage"
          />
        </div>
      </div>

      <!-- Error Summary -->
      <div v-if="Object.values(errors).some(error => error !== '')"
           class="p-4 bg-red-50 border border-red-200 rounded-lg">
        <h3 class="text-red-800 font-medium mb-2">Please correct the following errors:</h3>
        <ul class="list-disc list-inside">
          <li v-for="(error, field) in errors"
              :key="field"
              v-if="error"
              class="text-red-600 text-sm">
            {{ error }}
          </li>
        </ul>
      </div>

      <!-- Modify submit button text -->
      <div class="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="submit"
          class="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          :disabled="isLoading"
        >
          {{ isLoading ? 'Updating Attraction...' : 'Update Attraction' }}
        </button>
      </div>
    </form>
  </div>
</template>