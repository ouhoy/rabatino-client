<script setup lang="ts">
import { ref, computed } from 'vue'
import { z } from 'zod'
import type { StudyCenter } from '~/types/education'
import { InstitutionType } from '~/types/education'
const config = useRuntimeConfig()
const isLoading = ref(false)

// Zod schema based on StudyCenter interface
const studyCenterSchema = z.object({
  // Post interface fields
  title: z.string().min(3, 'Center name must be at least 3 characters').max(100, 'Name is too long'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  address: z.string().min(5, 'Address is required'),
  latitude: z.number({ invalid_type_error: 'Latitude is required' }),
  longitude: z.number({ invalid_type_error: 'Longitude is required' }),
  website: z.string().url('Must be a valid URL').optional(),
  phone: z.string().optional(),
  email: z.string().email('Must be a valid email').optional(),
  featuredImage: z.string().url('Must be a valid image URL'),

  // Educational Institution fields
  isVerified: z.boolean(),
  private: z.boolean(),
  type: z.nativeEnum(InstitutionType),

  // StudyCenter specific fields
  capacity: z.number().min(1, 'Capacity must be at least 1'),
  amenities: z.array(z.string()).min(1, 'At least one amenity is required'),
  hourlyRateRange: z.array(z.number()).length(2, 'Must specify minimum and maximum rates'),
  has24Access: z.boolean(),
  rooms: z.array(z.string()).min(1, 'At least one room is required')
})

// Form errors state
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
  capacity: '',
  amenities: '',
  hourlyRateRange: '',
  rooms: ''
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

  // Educational Institution fields
  isVerified: false,
  private: false,
  type: InstitutionType.STUDY_CENTER,

  // StudyCenter specific fields
  capacity: 0,
  amenities: [] as string[],
  hourlyRateRange: [0, 0],
  has24Access: false,
  rooms: [] as string[]
})

const commonAmenities = [
  'High-Speed WiFi',
  'Individual Desks',
  'Power Outlets',
  'Printing Services',
  'Coffee Station',
  'Lockers',
  'Air Conditioning',
  'Soundproof Rooms'
]

const roomsList = computed({
  get: () => formState.value.rooms.join(', '),
  set: (value: string) => {
    formState.value.rooms = value.split(',').map(item => item.trim()).filter(Boolean)
  }
})

const validateForm = () => {
  // Reset errors
  Object.keys(errors.value).forEach(key => {
    errors.value[key as keyof typeof errors.value] = ''
  })

  try {
    studyCenterSchema.parse(formState.value)
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
    const studyCenterData = {
      title: formState.value.title,
      userId: 1, // Hardcoded for now, should come from auth context
      typeId: 2, // Education type
      description: formState.value.description,
      address: formState.value.address,
      latitude: formState.value.latitude,
      longitude: formState.value.longitude,
      website: formState.value.website || null,
      phone: formState.value.phone || null,
      email: formState.value.email || null,
      featuredImage: formState.value.featuredImage,

      isVerified: formState.value.isVerified,
      private: formState.value.private,
      institutionType: 'STUDY_CENTER',

      capacity: Number(formState.value.capacity),
      amenities: formState.value.amenities,
      hourlyRateRange: formState.value.hourlyRateRange,
      hasAccess: formState.value.has24Access, // Map has24Access to hasAccess
      rooms: formState.value.rooms
    }

    const response = await fetch(`${config.public.apiBaseUrl}/education/study-centers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(studyCenterData)
    })

    if (!response.ok) {
      throw new Error('Failed to create study center')
    }

    const data = await response.json()
    console.log('Study center created successfully:', data)
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
      isVerified: false,
      private: false,
      type: InstitutionType.STUDY_CENTER,
      capacity: 0,
      amenities: [],
      hourlyRateRange: [0, 0],
      has24Access: false,
      rooms: []
    }
  } catch (error) {
    console.error('Error creating study center:', error)
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
      <p class="text-base text-gray-600">Provide details about your study center.</p>

      <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 max-w-3xl">
        <FormInput
          class="sm:col-span-4"
          v-model="formState.title"
          label="Study Center Name"
          placeholder="Enter study center name"
          type="text"
          :error="errors.title"
        />

        <FormTextarea
          class="col-span-full"
          v-model="formState.description"
          label="Description"
          placeholder="Describe your study center..."
          :rows="4"
          help-text="Highlight your facilities, environment, and special features."
        />

        <div class="col-span-full flex gap-4">
          <label class="inline-flex items-center">
            <input type="checkbox" v-model="formState.private" class="rounded border-gray-300" />
            <span class="ml-2">Private Center</span>
          </label>
          <label class="inline-flex items-center">
            <input type="checkbox" v-model="formState.has24Access" class="rounded border-gray-300" />
            <span class="ml-2">24/7 Access</span>
          </label>
        </div>
      </div>
    </div>

    <!-- Location and Contact -->
    <div class="border-b border-gray-900/10 pb-12">
      <h2 class="text-2xl text-neutral-900 font-medium">Location & Contact</h2>
      <p class="text-base text-gray-600">Help visitors find and reach your study center.</p>

      <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 max-w-3xl">
        <FormInput
          class="sm:col-span-full"
          v-model="formState.address"
          label="Address"
          placeholder="Full address"
          type="text"
        />

        <!-- Location Coordinates -->
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

        <!-- Verification Status -->
        <div class="col-span-full">
          <label class="inline-flex items-center">
            <input 
              type="checkbox" 
              v-model="formState.isVerified"
              class="rounded border-gray-300 text-blue-600 focus:ring-blue-600"
            />
            <span class="ml-2 text-sm text-gray-900">Verified Institution</span>
          </label>
        </div>

        <!-- Contact Information -->
        <FormInput
          class="sm:col-span-3"
          v-model="formState.phone"
          label="Phone"
          placeholder="Contact number"
          type="tel"
        />

        <FormInput
          class="sm:col-span-3"
          v-model="formState.email"
          label="Email"
          placeholder="Contact email"
          type="email"
        />

        <FormInput
          class="sm:col-span-4"
          v-model="formState.website"
          label="Website"
          placeholder="www.example.com"
          type="url"
        />
      </div>
    </div>

    <!-- Study Center Details -->
    <div class="border-b border-gray-900/10 pb-12">
      <h2 class="text-2xl text-neutral-900 font-medium">Study Center Details</h2>
      <p class="text-base text-gray-600">Provide specific information about your study center.</p>

      <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 max-w-3xl">
        <FormInput
          class="sm:col-span-2"
          v-model="formState.capacity"
          label="Total Capacity"
          placeholder="Maximum number of people"
          type="number"
          :error="errors.capacity"
        />

        <!-- Hourly Rate Range -->
        <div class="sm:col-span-4 grid grid-cols-2 gap-4">
          <FormInput
            v-model="formState.hourlyRateRange[0]"
            label="Minimum Rate (per hour)"
            placeholder="e.g., 10"
            type="number"
          />
          <FormInput
            v-model="formState.hourlyRateRange[1]"
            label="Maximum Rate (per hour)"
            placeholder="e.g., 25"
            type="number"
          />
        </div>

        <!-- 24/7 Access -->
        <div class="col-span-full">
          <label class="inline-flex items-center">
            <input 
              type="checkbox" 
              v-model="formState.has24Access"
              class="rounded border-gray-300 text-blue-600 focus:ring-blue-600"
            />
            <span class="ml-2 text-sm text-gray-900">24/7 Access Available</span>
          </label>
        </div>

        <!-- Rooms -->
        <div class="col-span-full">
          <FormTextarea
            v-model="roomsList"
            label="Available Rooms"
            placeholder="Enter room names, separated by commas"
            :rows="3"
            help-text="List all available study rooms"
            :error="errors.rooms"
          />
        </div>

        <!-- Amenities -->
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

    <!-- Featured Image -->
    <div class="border-b border-gray-900/10 pb-12">
      <h2 class="text-2xl text-neutral-900 font-medium">Center Images</h2>
      <p class="text-base text-gray-600">Add images of your study center.</p>

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
        {{ isLoading ? 'Creating Center...' : 'Create Study Center' }}
      </button>
    </div>
  </form>
</template>
