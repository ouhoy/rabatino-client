<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { z } from 'zod'
import type { College } from '~/types/education'
import { InstitutionType } from '~/types/education'
definePageMeta({
  layout: 'dashboard'
})
const config = useRuntimeConfig()
const isLoading = ref(false)
const route = useRoute()
const router = useRouter()
const slug = route.params.slug
const isFetchingData = ref(false)
const fetchError = ref<string | null>(null)

// Zod schema based on College interface
const collegeSchema = z.object({
  // Post interface fields
  title: z.string().min(3, 'College name must be at least 3 characters').max(100, 'Name is too long'),
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

  // College specific fields
  departments: z.array(z.string()).min(1, 'At least one department is required'),
  specialization: z.string().min(3, 'Specialization is required'),
  affiliation: z.string().min(3, 'Affiliation information is required'),
  hasNote: z.boolean(),
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
  departments: '',
  specialization: '',
  affiliation: '',
  facilities: ''
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
  type: InstitutionType.COLLEGE,

  // College specific fields
  departments: [] as string[],
  specialization: '',
  affiliation: '',
  hasNote: false,
  facilities: [] as string[],
})

const commonFacilities = [
  'Computer Labs',
  'Library',
  'Student Lounge',
  'Cafeteria',
  'Sports Facilities',
  'Auditorium',
  'Study Rooms',
  'Parking'
]

const departmentsList = computed({
  get: () => formState.value.departments.join(', '),
  set: (value: string) => {
    formState.value.departments = value.split(',').map(item => item.trim()).filter(Boolean)
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
    collegeSchema.parse(formState.value)
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

// Fetch college data on mount
onMounted(async () => {
  await fetchCollegeData()
})

async function fetchCollegeData() {
  try {
    isFetchingData.value = true
    fetchError.value = null

    const response = await fetch(`${config.public.apiBaseUrl}/education/colleges/${slug}`)
    if (!response.ok) {
      throw new Error('Failed to fetch college data')
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
      isVerified: data.isVerified,
      private: data.private,
      type: InstitutionType.COLLEGE,
      departments: data.departments || [],
      specialization: data.specialization,
      affiliation: data.affiliation,
      hasNote: data.hasNote,
      facilities: data.facilities || []
    }
  } catch (error) {
    console.error('Error fetching college:', error)
    fetchError.value = 'Failed to load college data. Please try again.'
  } finally {
    isFetchingData.value = false
  }
}

// Modify handleSubmit for update operation
const handleSubmit = async () => {
  if (!validateForm()) {
    // ...existing validation code...
    return
  }

  isLoading.value = true
  try {
    const collegeData = {
      title: formState.value.title,
      userId: 1,
      typeId: 2,
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
      institutionType: 'COLLEGE',
      departments: formState.value.departments,
      specialization: formState.value.specialization,
      affiliation: formState.value.affiliation,
      hasNote: formState.value.hasNote,
      facilities: formState.value.facilities
    }

    const response = await fetch(`${config.public.apiBaseUrl}/education/colleges/${slug}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(collegeData)
    })

    if (!response.ok) {
      throw new Error('Failed to update college')
    }

    const data = await response.json()
    console.log('College updated successfully:', data)
    router.push('/dashboard')
  } catch (error) {
    console.error('Error updating college:', error)
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
        <p class="text-base text-gray-600">Provide main details about your college.</p>

        <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 max-w-3xl">
          <FormInput
              class="sm:col-span-4"
              v-model="formState.title"
              label="College Name"
              placeholder="Enter college name"
              type="text"
              :error="errors.title"
          />

          <FormTextarea
              class="col-span-full"
              v-model="formState.description"
              label="Description"
              placeholder="Describe your college..."
              :rows="4"
              help-text="Include information about your college's mission and achievements."
          />

          <div class="col-span-full">
            <label class="text-sm font-medium text-gray-900">College Type</label>
            <div class="mt-4 space-x-4">
              <label class="inline-flex items-center">
                <input type="checkbox" v-model="formState.private" class="rounded border-gray-300" />
                <span class="ml-2">Private Institution</span>
              </label>
              <label class="inline-flex items-center">
                <input type="checkbox" v-model="formState.hasNote" class="rounded border-gray-300" />
                <span class="ml-2">Study Notes Available</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Location and Contact -->
      <div class="border-b border-gray-900/10 pb-12">
        <h2 class="text-2xl text-neutral-900 font-medium">Location & Contact Information</h2>
        <p class="text-base text-gray-600">Help students find and reach your college.</p>

        <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 max-w-3xl">
          <FormInput
              class="sm:col-span-full"
              v-model="formState.address"
              label="Address"
              placeholder="Full college address"
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
              class="sm:col-span-full"
              v-model="formState.website"
              label="Website"
              placeholder="https://example.com"
              type="url"
              :error="errors.website"
          />

          <FormInput
              class="sm:col-span-full"
              v-model="formState.phone"
              label="Phone"
              placeholder="e.g., +1 234 567 890"
              type="tel"
              :error="errors.phone"
          />

          <FormInput
              class="sm:col-span-full"
              v-model="formState.email"
              label="Email"
              placeholder="e.g., info@example.com"
              type="email"
              :error="errors.email"
          />
        </div>
      </div>

      <!-- Academic Information -->
      <div class="border-b border-gray-900/10 pb-12">
        <h2 class="text-2xl text-neutral-900 font-medium">Academic Information</h2>
        <p class="text-base text-gray-600">Academic details and specializations.</p>

        <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 max-w-3xl">
          <FormInput
              class="sm:col-span-full"
              v-model="formState.specialization"
              label="Specialization"
              placeholder="e.g., Technical and Applied Sciences"
              type="text"
              :error="errors.specialization"
          />

          <FormInput
              class="sm:col-span-full"
              v-model="formState.affiliation"
              label="Affiliation"
              placeholder="e.g., National Technical Education Board"
              type="text"
              :error="errors.affiliation"
          />

          <!-- Has Study Notes -->
          <div class="col-span-full">
            <label class="inline-flex items-center">
              <input
                  type="checkbox"
                  v-model="formState.hasNote"
                  class="rounded border-gray-300 text-blue-600 focus:ring-blue-600"
              />
              <span class="ml-2 text-sm text-gray-900">Study Notes Available</span>
            </label>
          </div>

          <FormTextarea
              class="col-span-full"
              v-model="departmentsList"
              label="Departments"
              placeholder="Enter departments, separated by commas"
              :rows="3"
              help-text="List all available departments"
              :error="errors.departments"
          />
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

        <FormTextarea
            v-model="facilitiesList"
            label="Facilities"
            placeholder="Enter facilities, separated by commas"
            :rows="3"
            help-text="List available facilities"
            :error="errors.facilities"
        />
      </div>

      <!-- Featured Image -->
      <div class="border-b border-gray-900/10 pb-12">
        <h2 class="text-2xl text-neutral-900 font-medium">College Images</h2>
        <p class="text-base text-gray-600">Provide image URLs for your college.</p>

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
          {{ isLoading ? 'Updating College...' : 'Update College' }}
        </button>
      </div>
    </form>
  </div>
</template>
