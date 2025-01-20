<script setup lang="ts">
import { ref, computed } from 'vue'
import type { CoachingCenter } from '~/types/education'
import { InstitutionType } from '~/types/education'

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

const handleSubmit = () => {
  console.log('Submitting Coaching Center:', formState.value)
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-12">
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
        />

        <FormTextarea
          class="col-span-full"
          v-model="formState.description"
          label="Description"
          placeholder="Describe your coaching center..."
          :rows="4"
          help-text="Highlight your teaching methods, success rates, and specialties."
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
        />

        <FormInput
          class="sm:col-span-full"
          v-model="formState.schedule"
          label="Schedule"
          placeholder="e.g., Monday-Friday 9AM-6PM, Weekend Sessions Available"
          type="text"
        />

        <FormTextarea
          class="col-span-full"
          v-model="coursesList"
          label="Available Courses"
          placeholder="Enter courses separated by commas"
          :rows="3"
          help-text="List all courses and programs offered"
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
        />
      </div>
    </div>

    <!-- Submit Button -->
    <div class="mt-6 flex items-center justify-end gap-x-6">
      <button type="submit" class="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        Create Coaching Center Listing
      </button>
    </div>
  </form>
</template>
