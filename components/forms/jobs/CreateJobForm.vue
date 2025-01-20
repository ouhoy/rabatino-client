<script setup lang="ts">
import { ref } from 'vue'
import type { JobPost } from '~/types/jobs'
import { JobType, WorkLocation } from '~/types/jobs'

const formState = ref({
  // Basic Post interface fields
  id: '',
  title: '',
  description: '',
  createdAt: new Date(),
  userId: '',
  address: '',
  latitude: 0,
  longitude: 0,
  website: '',
  phone: '',
  email: '',
  featuredImage: '',

  // JobPost specific fields
  company: '',
  logo: '',
  location: '',
  salary: '',
  jobType: JobType.FULL_TIME,
  workLocation: WorkLocation.OFFICE,
  requirements: [] as string[],
  applicationLink: '',
  expiryDate: '',
  isActive: true
})

const requirementsList = ref('')

const jobTypes = Object.values(JobType).map(type => ({
  value: type,
  label: type.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ')
}))

const workLocations = Object.values(WorkLocation).map(location => ({
  value: location,
  label: location.charAt(0) + location.slice(1).toLowerCase()
}))

const handleRequirementsChange = (value: string) => {
  formState.value.requirements = value.split('\n').filter(line => line.trim() !== '')
  requirementsList.value = value
}
</script>

<template>
  <form class="space-y-12">
    <!-- Basic Information -->
    <div class="border-b border-gray-900/10 pb-12">
      <h2 class="text-2xl text-neutral-900 font-medium">Job Details</h2>
      <p class="text-base text-gray-600">Provide information about the job position.</p>

      <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 max-w-3xl">
        <FormInput
          class="sm:col-span-4"
          v-model="formState.title"
          label="Job Title"
          placeholder="e.g., Senior Software Engineer"
          type="text"
        />

        <FormInput
          class="sm:col-span-4"
          v-model="formState.company"
          label="Company Name"
          placeholder="Enter company name"
          type="text"
        />

        <FormTextarea
          class="col-span-full"
          v-model="formState.description"
          label="Job Description"
          placeholder="Describe the role and responsibilities..."
          :rows="4"
          help-text="Include key responsibilities and expectations."
        />
      </div>
    </div>

    <!-- Job Specifics -->
    <div class="border-b border-gray-900/10 pb-12">
      <h2 class="text-2xl text-neutral-900 font-medium">Job Specifics</h2>
      <p class="text-base text-gray-600">Specify job type, location, and compensation.</p>

      <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 max-w-3xl">
        <!-- Job Type -->
        <div class="sm:col-span-3">
          <label class="text-sm font-medium text-gray-900">Job Type</label>
          <div class="mt-4 space-y-3">
            <div v-for="type in jobTypes" :key="type.value" class="flex items-center">
              <input
                type="radio"
                :id="type.value"
                v-model="formState.jobType"
                :value="type.value"
                class="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-600"
              />
              <label :for="type.value" class="ml-3 block text-sm text-gray-900">
                {{ type.label }}
              </label>
            </div>
          </div>
        </div>

        <!-- Work Location -->
        <div class="sm:col-span-3">
          <label class="text-sm font-medium text-gray-900">Work Location</label>
          <div class="mt-4 space-y-3"></div>
            <div v-for="loc in workLocations" :key="loc.value" class="flex items-center">
              <input
                type="radio"
                :id="loc.value"
                v-model="formState.workLocation"
                :value="loc.value"
                class="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-600"
              />
              <label :for="loc.value" class="ml-3 block text-sm text-gray-900">
                {{ loc.label }}
              </label>
            </div>
          </div>
        </div>

        <FormInput
          class="sm:col-span-3"
          v-model="formState.salary"
          label="Salary Range"
          placeholder="e.g., $60,000 - $80,000"
          type="text"
        />

        <FormInput
          class="sm:col-span-3"
          v-model="formState.location"
          label="Location"
          placeholder="e.g., New York, NY"
          type="text"
        />

        <FormInput
          class="sm:col-span-3"
          v-model="formState.expiryDate"
          label="Application Deadline"
          type="date"
          placeholder=""
        />
      </div>
   

    <!-- Requirements -->
    <div class="border-b border-gray-900/10 pb-12">
      <h2 class="text-2xl text-neutral-900 font-medium">Requirements</h2>
      <p class="text-base text-gray-600">List the requirements for this position.</p>

      <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 max-w-3xl">
        <FormTextarea
          class="col-span-full"
          v-model="requirementsList"
          label="Job Requirements"
          placeholder="Enter each requirement on a new line..."
          :rows="6"
          help-text="List qualifications, skills, and experience required."
          @input="handleRequirementsChange"
        />
      </div>
    </div>

    <!-- Contact Information -->
    <div class="border-b border-gray-900/10 pb-12">
      <h2 class="text-2xl text-neutral-900 font-medium">Contact & Application</h2>
      <p class="text-base text-gray-600">How candidates can apply and contact you.</p>

      <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 max-w-3xl">
        <FormInput
          class="sm:col-span-full"
          v-model="formState.applicationLink"
          label="Application URL"
          placeholder="https://careers.company.com/apply"
          type="url"
        />

        <FormInput
          class="sm:col-span-3"
          v-model="formState.email"
          label="Contact Email"
          placeholder="careers@company.com"
          type="email"
        />

        <FormInput
          class="sm:col-span-3"
          v-model="formState.phone"
          label="Contact Phone"
          placeholder="+1 (555) 123-4567"
          type="tel"
        />
      </div>
    </div>

    <!-- Company Details -->
    <div class="border-b border-gray-900/10 pb-12">
      <h2 class="text-2xl text-neutral-900 font-medium">Company Details</h2>
      <p class="text-base text-gray-600">Additional information about the company.</p>

      <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 max-w-3xl">
        <FormInput
          class="sm:col-span-full"
          v-model="formState.website"
          label="Company Website"
          placeholder="www.company.com"
          type="url"
        />

        <FormInput
          class="sm:col-span-full"
          v-model="formState.logo"
          label="Company Logo URL"
          placeholder="https://company.com/logo.png"
          type="url"
        />

        <FormInput
          class="sm:col-span-full"
          v-model="formState.address"
          label="Company Address"
          placeholder="Full company address"
          type="text"
        />
      </div>
    </div>

    <!-- Location Details -->
    <div class="border-b border-gray-900/10 pb-12">
      <h2 class="text-2xl text-neutral-900 font-medium">Location Details</h2>
      <p class="text-base text-gray-600">Specify the exact location coordinates.</p>

      <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 max-w-3xl">
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
      </div>
    </div>

    <!-- Replace the Images Section with just Featured Image -->
    <div class="border-b border-gray-900/10 pb-12">
      <h2 class="text-2xl text-neutral-900 font-medium">Featured Image</h2>
      <p class="text-base text-gray-600">Add a featured image for the job posting.</p>

      <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 max-w-3xl">
        <FormInput
          class="sm:col-span-full"
          v-model="formState.featuredImage"
          label="Featured Image URL"
          placeholder="https://example.com/featured-image.jpg"
          type="url"
        />
      </div>
    </div>

    <!-- Submit Button -->
    <div class="mt-6 flex items-center justify-end gap-x-6">
      <button type="submit" class="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        Post Job
      </button>
    </div>
  </form>
</template>
