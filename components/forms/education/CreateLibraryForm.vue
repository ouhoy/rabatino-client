<script setup lang="ts">
import { ref, computed } from 'vue'
import { z } from 'zod'
import type { Library } from '~/types/education'
import { InstitutionType } from '~/types/education'

const config = useRuntimeConfig()
const isLoading = ref(false)

// Zod schema based on Library interface
const librarySchema = z.object({
  // Post interface fields
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title is too long'),
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

  // Library specific fields
  bookCount: z.number().min(0, 'Book count must be positive'),
  sections: z.array(z.string()).min(1, 'At least one section is required'),
  hasDigitalAccess: z.boolean(),
  operationHours: z.string().min(1, 'Operating hours are required'),
  hasPrinting: z.boolean(),
  hasStudyRooms: z.boolean()
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
  bookCount: '',
  sections: '',
  operationHours: ''
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
  type: InstitutionType.LIBRARY,

  // Library specific fields
  bookCount: 0,
  sections: [] as string[],
  hasDigitalAccess: false,
  operationHours: '',
  hasPrinting: false,
  hasStudyRooms: false
})

const commonSections = [
  'Fiction',
  'Non-Fiction',
  'Reference',
  'Periodicals',
  'Children\'s Literature',
  'Digital Media',
  'Research Materials',
  'Academic Resources',
  'Local History'
]

const sectionsList = computed({
  get: () => formState.value.sections.join(', '),
  set: (value: string) => {
    formState.value.sections = value.split(',').map(item => item.trim()).filter(Boolean)
  }
})

const validateForm = () => {
  // Reset errors
  Object.keys(errors.value).forEach(key => {
    errors.value[key as keyof typeof errors.value] = ''
  })

  try {
    librarySchema.parse(formState.value)
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
    // Restructure the data to match API requirements
    const libraryData = {
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
      institutionType: 'LIBRARY',

      bookCount: Number(formState.value.bookCount),
      sections: formState.value.sections,
      hasDigitalAccess: formState.value.hasDigitalAccess,
      operationHours: formState.value.operationHours,
      hasPrinting: formState.value.hasPrinting,
      hasStudyRooms: formState.value.hasStudyRooms
    }

    const response = await fetch(`${config.public.apiBaseUrl}/education/libraries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(libraryData)
    })

    if (!response.ok) {
      throw new Error('Failed to create library')
    }

    const data = await response.json()
    console.log('Library created successfully:', data)
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
      type: InstitutionType.LIBRARY,
      bookCount: 0,
      sections: [],
      hasDigitalAccess: false,
      operationHours: '',
      hasPrinting: false,
      hasStudyRooms: false
    }
  } catch (error) {
    console.error('Error creating library:', error)
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
      <p class="text-base text-gray-600">Provide details about your library.</p>

      <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 max-w-3xl">
        <FormInput
          class="sm:col-span-4"
          v-model="formState.title"
          label="Library Name"
          placeholder="Enter library name"
          type="text"
          :error="errors.title"
        />

        <FormTextarea
          class="col-span-full"
          v-model="formState.description"
          label="Description"
          placeholder="Describe your library..."
          :rows="4"
          help-text="Highlight your collections, facilities, and special features."
          :error="errors.description"
        />

        <div class="col-span-full">
          <label class="inline-flex items-center">
            <input type="checkbox" v-model="formState.private" class="rounded border-gray-300" />
            <span class="ml-2">Private Library</span>
          </label>
        </div>
      </div>
    </div>

    <!-- Location and Contact -->
    <div class="border-b border-gray-900/10 pb-12">
      <h2 class="text-2xl text-neutral-900 font-medium">Location & Contact</h2>
      <p class="text-base text-gray-600">Help visitors find and reach your library.</p>

      <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 max-w-3xl">
        <FormInput
          class="sm:col-span-full"
          v-model="formState.address"
          label="Address"
          placeholder="Full library address"
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
          placeholder="Contact number"
          type="tel"
          :error="errors.phone"
        />

        <FormInput
          class="sm:col-span-3"
          v-model="formState.email"
          label="Email"
          placeholder="Contact email"
          type="email"
          :error="errors.email"
        />

        <FormInput
          class="sm:col-span-4"
          v-model="formState.website"
          label="Website"
          placeholder="www.example.com"
          type="url"
          :error="errors.website"
        />
      </div>
    </div>

    <!-- Library Details -->
    <div class="border-b border-gray-900/10 pb-12">
      <h2 class="text-2xl text-neutral-900 font-medium">Library Details</h2>
      <p class="text-base text-gray-600">Tell us about your library's collection and services.</p>

      <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 max-w-3xl">
        <FormInput
          class="sm:col-span-3"
          v-model="formState.bookCount"
          label="Book Count"
          placeholder="Total number of books"
          type="number"
          :error="errors.bookCount"
        />

        <FormInput
          class="sm:col-span-3"
          v-model="formState.operationHours"
          label="Operating Hours"
          placeholder="e.g., 9:00 AM - 8:00 PM"
          type="text"
          :error="errors.operationHours"
        />

        <!-- Services -->
        <div class="col-span-full">
          <label class="text-sm font-medium text-gray-900">Available Services</label>
          <div class="mt-4 space-y-3">
            <div class="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="digitalAccess"
                v-model="formState.hasDigitalAccess"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-600"
              />
              <label for="digitalAccess" class="text-sm text-gray-900">Digital Access Available</label>
            </div>
            <div class="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="printing"
                v-model="formState.hasPrinting"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-600"
              />
              <label for="printing" class="text-sm text-gray-900">Printing Services</label>
            </div>
            <div class="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="studyRooms"
                v-model="formState.hasStudyRooms"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-600"
              />
              <label for="studyRooms" class="text-sm text-gray-900">Study Rooms Available</label>
            </div>
          </div>
        </div>

        <!-- Library Sections -->
        <div class="col-span-full">
          <label class="text-sm font-medium text-gray-900">Library Sections</label>
          <div class="mt-4 grid grid-cols-2 gap-4">
            <div v-for="section in commonSections" :key="section" class="flex items-center gap-2">
              <input 
                type="checkbox" 
                :id="section"
                v-model="formState.sections"
                :value="section"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-600"
              />
              <label :for="section" class="text-sm text-gray-900">{{ section }}</label>
            </div>
          </div>
          <FormTextarea
            v-model="sectionsList"
            label="Library Sections"
            placeholder="Enter sections, separated by commas"
            :rows="3"
            help-text="List all library sections"
            :error="errors.sections"
          />
        </div>
      </div>
    </div>

    <!-- Featured Image -->
    <div class="border-b border-gray-900/10 pb-12">
      <h2 class="text-2xl text-neutral-900 font-medium">Library Images</h2>
      <p class="text-base text-gray-600">Add images of your library.</p>

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
        {{ isLoading ? 'Creating Library...' : 'Create Library Listing' }}
      </button>
    </div>
  </form>
</template>
