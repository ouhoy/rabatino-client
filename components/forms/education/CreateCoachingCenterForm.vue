<script setup lang="ts">
import { ref, computed } from 'vue'
import type { CoachingCenter } from '~/types/education'

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
  specialty: '',
  courses: [] as string[],
  schedule: '',
})

const coursesList = computed({
  get: () => formState.value.courses.join(', '),
  set: (value: string) => {
    formState.value.courses = value.split(',').map(item => item.trim()).filter(Boolean)
  }
})
</script>

<template>
  <form class="space-y-12">
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
  </form>
</template>
