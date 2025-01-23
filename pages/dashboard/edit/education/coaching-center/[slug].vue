<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { z } from 'zod'
import type { CoachingCenter } from '~/types/education'
import { InstitutionType } from '~/types/education'
definePageMeta({
  layout: 'dashboard'
})
const config = useRuntimeConfig()

const route = useRoute()
const router = useRouter()
const slug = route.params.slug
const isFetchingData = ref(false)
const fetchError = ref<string | null>(null)

// Zod schema based on CoachingCenter interface
const coachingCenterSchema = z.object({
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

  // CoachingCenter specific fields
  specialty: z.string().min(3, 'Specialty is required'),
  courses: z.array(z.string()).min(1, 'At least one course is required'),
  schedule: z.string().min(3, 'Schedule information is required')
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
  specialty: '',
  courses: '',
  schedule: ''
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
  type: InstitutionType.COACHING_CENTER,

  // CoachingCenter specific fields
  specialty: '',
  courses: [] as string[],
  schedule: ''
})

const coursesList = computed({
  get: () => formState.value.courses.join(', '),
  set: (value: string) => {
    formState.value.courses = value.split(',').map(item => item.trim()).filter(Boolean)
  }
})

const validateForm = () => {
  // Reset errors
  Object.keys(errors.value).forEach(key => {
    errors.value[key as keyof typeof errors.value] = ''
  })

  try {
    coachingCenterSchema.parse(formState.value)
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

const isLoading = ref(false)

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
    const coachingData = {
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
      institutionType: 'COACHING_CENTER',
      specialty: formState.value.specialty,
      courses: formState.value.courses,
      schedule: formState.value.schedule
    }

    const response = await fetch(`${config.public.apiBaseUrl}/education/coaching-centers/${slug}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(coachingData)
    })

    if (!response.ok) {
      throw new Error('Failed to update coaching center')
    }

    const data = await response.json()
    console.log('Coaching center updated successfully:', data)
    router.push('/dashboard')
  } catch (error) {
    console.error('Error updating coaching center:', error)
  } finally {
    isLoading.value = false
  }
}

// Fetch coaching center data on mount
onMounted(async () => {
  await fetchCoachingCenterData()
})

async function fetchCoachingCenterData() {
  try {
    isFetchingData.value = true
    fetchError.value = null

    const response = await fetch(`${config.public.apiBaseUrl}/education/coaching-centers/${slug}`)
    if (!response.ok) {
      throw new Error('Failed to fetch coaching center data')
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
      type: InstitutionType.COACHING_CENTER,
      specialty: data.specialty,
      courses: data.courses || [],
      schedule: data.schedule || ''
    }
  } catch (error) {
    console.error('Error fetching coaching center:', error)
    fetchError.value = 'Failed to load coaching center data. Please try again.'
  } finally {
    isFetchingData.value = false
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
        <p class="text-base text-gray-600">Provide details about your coaching center.</p>

        <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 max-w-3xl">
          <FormInput
              class="sm:col-span-4"
              v-model="formState.title"
              label="Center Name"
              placeholder="Enter coaching center name"
              type="text"
              :error="errors.title"
          />

          <FormTextarea
              class="col-span-full"
              v-model="formState.description"
              label="Description"
              placeholder="Describe your coaching center..."
              :rows="4"
              help-text="Highlight your teaching methods, success rates, and specialties."
              :error="errors.description"
          />

          <div class="col-span-full">
            <label class="inline-flex items-center">
              <input type="checkbox" v-model="formState.private" class="rounded border-gray-300" />
              <span class="ml-2">Private Institution</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Location and Contact -->
      <div class="border-b border-gray-900/10 pb-12">
        <h2 class="text-2xl text-neutral-900 font-medium">Location & Contact</h2>
        <p class="text-base text-gray-600">Help students find and reach your coaching center.</p>

        <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 max-w-3xl">
          <FormInput
              class="sm:col-span-full"
              v-model="formState.address"
              label="Address"
              placeholder="Full address"
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

      <!-- Coaching Details -->
      <div class="border-b border-gray-900/10 pb-12">
        <h2 class="text-2xl text-neutral-900 font-medium">Coaching Details</h2>
        <p class="text-base text-gray-600">Tell us about your coaching programs.</p>

        <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 max-w-3xl">
          <FormInput
              class="sm:col-span-full"
              v-model="formState.specialty"
              label="Specialty"
              placeholder="e.g., Test Preparation, Academic Support"
              type="text"
              :error="errors.specialty"
          />

          <FormInput
              class="sm:col-span-full"
              v-model="formState.schedule"
              label="Schedule"
              placeholder="e.g., Monday-Friday 9AM-6PM, Weekend Sessions Available"
              type="text"
              :error="errors.schedule"
          />

          <FormTextarea
              class="col-span-full"
              v-model="coursesList"
              label="Available Courses"
              placeholder="Enter courses separated by commas"
              :rows="3"
              help-text="List all courses and programs offered"
              :error="errors.courses"
          />
        </div>
      </div>

      <!-- Featured Image -->
      <div class="border-b border-gray-900/10 pb-12">
        <h2 class="text-2xl text-neutral-900 font-medium">Center Images</h2>
        <p class="text-base text-gray-600">Add images of your coaching center.</p>

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
          {{ isLoading ? 'Updating Coaching Center...' : 'Update Coaching Center' }}
        </button>
      </div>
    </form>
  </div>
</template>
