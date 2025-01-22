<script setup lang="ts">
import { ref } from 'vue'
import { z } from 'zod'
import type { Hotel } from '~/types/tourism'
import { TourismType } from '~/types/tourism'

const config = useRuntimeConfig()
const isLoading = ref(false)

// Add Zod schema for validation
const hotelSchema = z.object({
  title: z.string().min(3, 'Hotel name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  address: z.string().min(5, 'Address is required'),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  website: z.string().url().optional(),
  phone: z.string().optional(),
  email: z.string().email(),
  featuredImage: z.string().url(),
  rating: z.number().min(0).max(5),
  amenities: z.array(z.string()).min(1, 'At least one amenity is required'),
  priceRanges: z.string().min(1, 'Price range is required'),
  totalRooms: z.number().min(1, 'Must have at least one room'),
  roomTypes: z.string().min(1, 'Room types are required'),
  checkInTime: z.string().min(1, 'Check-in time is required')
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
  amenities: '',
  priceRanges: '',
  totalRooms: '',
  roomTypes: '',
  checkInTime: ''
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
  type: TourismType.HOTEL,

  // Hotel specific fields
  amenities: [] as string[],
  priceRanges: '',
  totalRooms: 0,
  roomTypes: '',
  checkInTime: '',
})

const commonAmenities = [
  'Free Wi-Fi',
  'Swimming Pool',
  'Spa & Wellness Center',
  'Restaurant & Bar',
  'Fitness Center',
  'Conference Rooms',
  'Room Service',
  'Parking',
  'Concierge Service',
  'Business Center'
]

const validateForm = () => {
  Object.keys(errors.value).forEach(key => {
    errors.value[key as keyof typeof errors.value] = ''
  })

  try {
    hotelSchema.parse(formState.value)
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

const handleSubmit = async () => {
  if (!validateForm()) {
    console.log('Form validation failed', errors.value)
    return
  }

  isLoading.value = true
  try {
    // Restructure the data to match API requirements
    const hotelData = {
      title: formState.value.title,
      userId: 1, // Hardcoded for now, should come from auth context
      typeId: 3, // Tourism type for hotels
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
      tourismType: 'HOTEL',

      amenities: formState.value.amenities,
      priceRanges: formState.value.priceRanges,
      totalRooms: Number(formState.value.totalRooms),
      roomTypes: formState.value.roomTypes,
      checkInTime: formState.value.checkInTime
    }

    const response = await fetch(`${config.public.apiBaseUrl}/tourism/hotels`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(hotelData)
    })

    if (!response.ok) {
      throw new Error('Failed to create hotel')
    }

    const data = await response.json()
    console.log('Hotel created successfully:', data)
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
      type: TourismType.HOTEL,
      amenities: [],
      priceRanges: '',
      totalRooms: 0,
      roomTypes: '',
      checkInTime: ''
    }
  } catch (error) {
    console.error('Error creating hotel:', error)
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
      <p class="text-base text-gray-600">Provide the main details about your hotel.</p>

      <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 max-w-3xl">
        <FormInput
          class="sm:col-span-4"
          v-model="formState.title"
          label="Hotel Name"
          placeholder="Enter the name of your hotel"
          type="text"
        />

        <FormTextarea
          class="col-span-full"
          v-model="formState.description"
          label="Description"
          placeholder="Describe what makes your hotel special..."
          :rows="4"
          help-text="Highlight unique features, location benefits, and special amenities."
        />
      </div>
    </div>

    <!-- Location and Contact -->
    <div class="border-b border-gray-900/10 pb-12">
      <h2 class="text-2xl text-neutral-900 font-medium">Location & Contact Information</h2>
      <p class="text-base text-gray-600">Help guests find and reach your hotel.</p>

      <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 max-w-3xl">
        <FormInput
          class="sm:col-span-full"
          v-model="formState.address"
          label="Address"
          placeholder="Full hotel address"
          type="text"
        />

        <!-- Add Location Coordinates -->
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
          placeholder="reservations@hotel.com"
          type="email"
        />
      </div>
    </div>

    <!-- Hotel Details -->
    <div class="border-b border-gray-900/10 pb-12">
      <h2 class="text-2xl text-neutral-900 font-medium">Hotel Details</h2>
      <p class="text-base text-gray-600">Provide specific information about your hotel.</p>

      <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 max-w-3xl">
        <!-- Add Rating field -->
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
          v-model="formState.checkInTime"
          label="Check-in Time"
          placeholder="e.g., 3:00 PM"
          type="text"
        />

        <FormInput
          class="sm:col-span-3"
          v-model="formState.priceRanges"
          label="Price Range"
          placeholder="e.g., $100 - $300 per night"
          type="text"
        />

        <FormInput
          class="sm:col-span-2"
          v-model="formState.totalRooms"
          label="Total Rooms"
          placeholder="Number of rooms"
          type="number"
        />

        <FormInput
          class="sm:col-span-4"
          v-model="formState.roomTypes"
          label="Room Types"
          placeholder="e.g., Standard, Deluxe, Suite"
          type="text"
        />

        <!-- Add Active Status -->
        <div class="col-span-full">
          <label class="inline-flex items-center">
            <input 
              type="checkbox" 
              v-model="formState.isActive"
              class="rounded border-gray-300 text-blue-600 focus:ring-blue-600"
            />
            <span class="ml-2 text-sm text-gray-900">Active Listing</span>
          </label>
        </div>

        <div class="col-span-full">
          <label class="text-sm font-medium text-gray-900">Amenities</label>
          <div class="mt-4 grid grid-cols-2 gap-4">
            <div v-for="amenity in commonAmenities" :key="amenity" class="flex items-center gap-2">
              <input 
                type="checkbox" 
                :id="amenity"
                v-model="formState.amenities"
                :value="amenity"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-600"
              />
              <label :for="amenity" class="text-sm text-gray-900">{{ amenity }}</label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Images -->
    <div class="border-b border-gray-900/10 pb-12">
      <h2 class="text-2xl text-neutral-900 font-medium">Hotel Images</h2>
      <p class="text-base text-gray-600">Provide image URLs for your hotel.</p>

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
      <button 
        type="submit" 
        class="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        :disabled="isLoading"
      >
        {{ isLoading ? 'Creating Hotel...' : 'Create Hotel Listing' }}
      </button>
    </div>
  </form>
</template>
