<script setup lang="ts">
import { ref, computed } from 'vue'
import { z } from 'zod'
import type { University } from '~/types/education'
import { InstitutionType } from '~/types/education'

const config = useRuntimeConfig()
const isLoading = ref(false)

// Zod schema based on University interface
const universitySchema = z.object({
  // Post interface fields
  title: z.string().min(3, 'University name must be at least 3 characters').max(100, 'Name is too long'),
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

  // University specific fields
  faculties: z.array(z.string()).min(1, 'At least one faculty is required'),
  ranking: z.string().min(1, 'Ranking information is required'),
  accreditation: z.string().min(1, 'Accreditation information is required'),
  hasHousing: z.boolean(),
  researchCenters: z.array(z.string()),
  facilities: z.array(z.string()).min(1, 'At least one facility is required')
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
  faculties: '',
  ranking: '',
  accreditation: '',
  facilities: '',
  researchCenters: ''
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
  type: InstitutionType.UNIVERSITY,

  // University specific fields
  faculties: [] as string[],
  ranking: '',
  accreditation: '',
  hasHousing: false,
  researchCenters: [] as string[],
  facilities: [] as string[],
})

const commonFacilities = [
  'Modern Library',
  'Sports Complex',
  'Student Center',
  'Research Labs',
  'Campus Housing',
  'Health Center',
  'Cafeteria',
  'Computer Labs',
  'Auditorium',
  'Parking'
]

// Computed properties for array fields
const facultiesList = computed({
  get: () => formState.value.faculties.join(', '),
  set: (value: string) => {
    formState.value.faculties = value.split(',').map(item => item.trim()).filter(Boolean)
  }
})

const researchCentersList = computed({
  get: () => formState.value.researchCenters.join(', '),
  set: (value: string) => {
    formState.value.researchCenters = value.split(',').map(item => item.trim()).filter(Boolean)
  }
})

const facilitiesList = computed({
  get: () => formState.value.facilities.join(', '),
  set: (value: string) => {
    formState.value.facilities = value.split(',').map(item => item.trim()).filter(Boolean)
  }
})

const validateForm = () => {
  // Reset errors
  Object.keys(errors.value).forEach(key => {
    errors.value[key as keyof typeof errors.value] = ''
  })

  try {
    universitySchema.parse(formState.value)
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
    const universityData = {
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
      institutionType: 'UNIVERSITY',

      faculties: formState.value.faculties,
      ranking: formState.value.ranking,
      accreditation: formState.value.accreditation,
      hasHousing: formState.value.hasHousing,
      researchCenters: formState.value.researchCenters,
      facilities: formState.value.facilities
    }

    const response = await fetch(`${config.public.apiBaseUrl}/education/universities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(universityData)
    })

    if (!response.ok) {
      throw new Error('Failed to create university')
    }

    const data = await response.json()
    console.log('University created successfully:', data)
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
      type: InstitutionType.UNIVERSITY,
      faculties: [],
      ranking: '',
      accreditation: '',
      hasHousing: false,
      researchCenters: [],
      facilities: []
    }
  } catch (error) {
    console.error('Error creating university:', error)
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
      <p class="text-base text-gray-600">Provide main details about your university.</p>

      <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 max-w-3xl">
        <FormInput
          class="sm:col-span-4"
          v-model="formState.title"
          label="University Name"
          placeholder="Enter university name"
          type="text"
          :error="errors.title"
        />

        <FormTextarea
          class="col-span-full"
          v-model="formState.description"
          label="Description"
          placeholder="Describe your university..."
          :rows="4"
          help-text="Include information about programs, history, and unique features."
          :error="errors.description"
        />

        <!-- University Type -->
        <div class="col-span-full">
          <label class="text-sm font-medium text-gray-900">University Type</label>
          <div class="mt-4 space-x-4">
            <label class="inline-flex items-center">
              <input type="checkbox" v-model="formState.private" class="rounded border-gray-300" />
              <span class="ml-2">Private Institution</span>
            </label>
            <label class="inline-flex items-center">
              <input type="checkbox" v-model="formState.hasHousing" class="rounded border-gray-300" />
              <span class="ml-2">Campus Housing Available</span>
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- Location and Contact -->
    <div class="border-b border-gray-900/10 pb-12">
      <h2 class="text-2xl text-neutral-900 font-medium">Location & Contact Information</h2>
      <p class="text-base text-gray-600">Help students find and reach your university.</p>

      <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 max-w-3xl">
        <FormInput
          class="sm:col-span-full"
          v-model="formState.address"
          label="Address"
          placeholder="Full university address"
          type="text"
          :error="errors.address"
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

        <!-- Add Verification Status -->
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

        <FormInput
          class="sm:col-span-3"
          v-model="formState.phone"
          label="Phone"
          placeholder="Administrative contact"
          type="tel"
          :error="errors.phone"
        />

        <FormInput
          class="sm:col-span-3"
          v-model="formState.email"
          label="Email"
          placeholder="Admissions email"
          type="email"
          :error="errors.email"
        />

        <FormInput
          class="sm:col-span-4"
          v-model="formState.website"
          label="Website"
          placeholder="University website"
          type="url"
          :error="errors.website"
        />
      </div>
    </div>

    <!-- Academic Information -->
    <div class="border-b border-gray-900/10 pb-12">
      <h2 class="text-2xl text-neutral-900 font-medium">Academic Information</h2>
      <p class="text-base text-gray-600">Academic details and accreditation.</p>

      <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 max-w-3xl">
        <FormInput
          class="sm:col-span-full"
          v-model="formState.ranking"
          label="University Ranking"
          placeholder="e.g., Top 100 Global Universities"
          type="text"
          :error="errors.ranking"
        />

        <FormInput
          class="sm:col-span-full"
          v-model="formState.accreditation"
          label="Accreditation"
          placeholder="e.g., National Education Board"
          type="text"
          :error="errors.accreditation"
        />

        <!-- Faculties Input -->
        <div class="col-span-full">
          <FormTextarea
            v-model="facultiesList"
            label="Faculties"
            placeholder="Enter faculties, separated by commas"
            :rows="3"
            help-text="List all available faculties"
            :error="errors.faculties"
          />
        </div>

        <!-- Research Centers Input -->
        <div class="col-span-full">
          <FormTextarea
            v-model="researchCentersList"
            label="Research Centers"
            placeholder="Enter research centers, separated by commas"
            :rows="3"
            help-text="List major research centers"
            :error="errors.researchCenters"
          />
        </div>
      </div>
    </div>

    <!-- Facilities -->
    <div class="border-b border-gray-900/10 pb-12">
      <h2 class="text-2xl text-neutral-900 font-medium">Campus Facilities</h2>
      <p class="text-base text-gray-600">Select available facilities.</p>

      <div class="mt-4 grid grid-cols-2 gap-4">
        <div v-for="facility in commonFacilities" :key="facility" class="flex items-center gap-2">
          <input 
            type="checkbox" 
            :id="facility"
            v-model="formState.facilities"
            :value="facility"
            class="rounded border-gray-300"
          />
          <label :for="facility" class="text-sm text-gray-900">{{ facility }}</label>
        </div>
      </div>

      <div class="col-span-full mt-6">
        <FormTextarea
          v-model="facilitiesList"
          label="Facilities"
          placeholder="Enter facilities, separated by commas"
          :rows="3"
          help-text="List all available facilities"
          :error="errors.facilities"
        />
      </div>
    </div>

    <!-- Featured Image -->
    <div class="border-b border-gray-900/10 pb-12">
      <h2 class="text-2xl text-neutral-900 font-medium">University Images</h2>
      <p class="text-base text-gray-600">Provide image URLs for your university.</p>

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
        {{ isLoading ? 'Creating University...' : 'Create University Listing' }}
      </button>
    </div>
  </form>
</template>
