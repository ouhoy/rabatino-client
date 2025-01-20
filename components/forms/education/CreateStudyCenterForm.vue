<script setup lang="ts">
import { ref } from 'vue'
import type { StudyCenter } from '~/types/education'

const formState = ref({
  title: '',
  description: '',
  featuredImage: '',
  address: '',
  website: '',
  phone: '',
  email: '',
  isVerified: false,
  private: false,
  capacity: 0,
  amenities: [] as string[],
  hourlyRateRange: [0, 0],
  has24Access: false,
  rooms: [] as string[]
})

const commonAmenities = [
  'High-Speed WiFi',
  'Individual Study Desks',
  'Group Study Tables',
  'Power Outlets',
  'Printing Services',
  'Air Conditioning',
  'Coffee & Snacks',
  'Lockers',
  'Soundproof Rooms',
  'Multimedia Equipment',
  'Whiteboards',
  'Meeting Rooms'
]

const commonRooms = [
  'Silent Study Room',
  'Group Study Room',
  'Discussion Room',
  'Private Cubicle',
  'Conference Room',
  'Multimedia Room'
]
</script>

<template>
  <form class="space-y-12">
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
      <p class="text-base text-gray-600">Help students find and reach your center.</p>

      <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 max-w-3xl">
        <FormInput
          class="sm:col-span-full"
          v-model="formState.address"
          label="Address"
          placeholder="Full address"
          type="text"
        />

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
      <h2 class="text-2xl text-neutral-900 font-medium">Center Details</h2>
      <p class="text-base text-gray-600">Information about capacity and rates.</p>

      <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 max-w-3xl">
        <FormInput
          class="sm:col-span-2"
          v-model="formState.capacity"
          label="Total Capacity"
          placeholder="Maximum occupancy"
          type="number"
        />

        <div class="sm:col-span-4">
          <label class="text-sm font-medium text-gray-900">Hourly Rate Range</label>
          <div class="mt-2 grid grid-cols-2 gap-4">
            <FormInput
              v-model="formState.hourlyRateRange[0]"
              label="Minimum Rate"
              placeholder="Min $/hour"
              type="number"
            />
            <FormInput
              v-model="formState.hourlyRateRange[1]"
              label="Maximum Rate"
              placeholder="Max $/hour"
              type="number"
            />
          </div>
        </div>

        <!-- Room Types -->
        <div class="col-span-full">
          <label class="text-sm font-medium text-gray-900">Available Rooms</label>
          <div class="mt-4 grid grid-cols-2 gap-4">
            <div v-for="room in commonRooms" :key="room" class="flex items-center gap-2">
              <input 
                type="checkbox" 
                :id="room"
                v-model="formState.rooms"
                :value="room"
                class="rounded border-gray-300"
              />
              <label :for="room" class="text-sm text-gray-900">{{ room }}</label>
            </div>
          </div>
        </div>

        <!-- Amenities -->
        <div class="col-span-full">
          <label class="text-sm font-medium text-gray-900">Available Amenities</label>
          <div class="mt-4 grid grid-cols-2 gap-4">
            <div v-for="amenity in commonAmenities" :key="amenity" class="flex items-center gap-2">
              <input 
                type="checkbox" 
                :id="amenity"
                v-model="formState.amenities"
                :value="amenity"
                class="rounded border-gray-300"
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
      <button type="submit" class="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        Create Study Center Listing
      </button>
    </div>
  </form>
</template>
