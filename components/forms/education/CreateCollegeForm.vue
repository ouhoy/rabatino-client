<script setup lang="ts">
import { ref, computed } from 'vue'
import type { College } from '~/types/education'
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
</script>

<template>
  <form class="space-y-12">
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
          class="sm:col-span-full"
          v-model="formState.website"
          label="Website"
          placeholder="https://example.com"
          type="url"
        />

        <FormInput
          class="sm:col-span-full"
          v-model="formState.phone"
          label="Phone"
          placeholder="e.g., +1 234 567 890"
          type="tel"
        />

        <FormInput
          class="sm:col-span-full"
          v-model="formState.email"
          label="Email"
          placeholder="e.g., info@example.com"
          type="email"
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
        />

        <FormInput
          class="sm:col-span-full"
          v-model="formState.affiliation"
          label="Affiliation"
          placeholder="e.g., National Technical Education Board"
          type="text"
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
        />
      </div>
    </div>

    <!-- Submit Button -->
    <div class="mt-6 flex items-center justify-end gap-x-6">
      <button type="submit" class="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        Create College Listing
      </button>
    </div>
  </form>
</template>
