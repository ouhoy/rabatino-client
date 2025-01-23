<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { z } from 'zod'
import type { JobPost } from '~/types/jobs'
import { JobType, WorkLocation } from '~/types/jobs'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();
const slug = route.params.slug;
const isLoading = ref(false);
const isFetching = ref(true);

// Zod schema based on JobPost interface
const jobSchema = z.object({
  // Post interface fields
  title: z.string().min(3, 'Job title must be at least 3 characters').max(100, 'Title is too long'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  address: z.string().min(5, 'Address is required'),
  latitude: z.number({ invalid_type_error: 'Latitude is required' }),
  longitude: z.number({ invalid_type_error: 'Longitude is required' }),
  website: z.string().url('Must be a valid URL'),
  phone: z.string().optional(),
  email: z.string().email('Must be a valid email'),
  featuredImage: z.string().url('Must be a valid image URL'),

  // JobPost specific fields
  company: z.string().min(2, 'Company name is required'),
  logo: z.string().url('Must be a valid logo URL'),
  location: z.string().min(2, 'Location is required'),
  salary: z.string().min(1, 'Salary range is required'),
  jobType: z.nativeEnum(JobType),
  workLocation: z.nativeEnum(WorkLocation),
  requirements: z.array(z.string()).min(1, 'At least one requirement is required'),
  applicationLink: z.string().url('Must be a valid application URL'),
  expiryDate: z.string().min(1, 'Expiry date is required'),
  isActive: z.boolean()
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
  company: '',
  logo: '',
  location: '',
  salary: '',
  requirements: '',
  applicationLink: '',
  expiryDate: ''
})

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

const handleRequirementsChange = (event: Event) => {
  const value = (event.target as HTMLTextAreaElement).value
  formState.value.requirements = value.split('\n').filter(line => line.trim() !== '')
  requirementsList.value = value
}

const validateForm = () => {
  // Reset errors
  Object.keys(errors.value).forEach(key => {
    errors.value[key as keyof typeof errors.value] = ''
  })

  try {
    jobSchema.parse(formState.value)
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

// Fetch existing job data
async function fetchJobData() {
  try {
    isFetching.value = true;
    const response = await fetch(`${config.public.apiBaseUrl}/jobs/${slug}`);
    if (!response.ok) throw new Error('Failed to fetch job data');
    
    const data = await response.json();
    
    // Populate form state with fetched data
    formState.value = {
      id: data.id,
      title: data.title,
      description: data.description,
      userId: data.userId,
      address: data.address,
      latitude: Number(data.latitude),
      longitude: Number(data.longitude),
      website: data.website,
      phone: data.phone,
      email: data.email,
      featuredImage: data.featuredImage,
      company: data.company,
      logo: data.logo,
      location: data.address, // Using address as location
      salary: data.salary,
      jobType: data.jobType as JobType,
      workLocation: data.workLocation as WorkLocation,
      requirements: data.requirements,
      applicationLink: data.applicationLink,
      expiryDate: data.expiryDate.split('T')[0], // Format date for input
      isActive: true,
      createdAt: new Date()
    };

    // Populate requirements textarea
    requirementsList.value = data.requirements.join('\n');

  } catch (error) {
    console.error('Error fetching job:', error);
  } finally {
    isFetching.value = false;
  }
}

// Modified submit handler for update
const handleSubmit = async () => {
  if (!validateForm()) {
    console.log('Form validation failed', errors.value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  isLoading.value = true;
  try {
    const jobData = {
      title: formState.value.title,
      userId: formState.value.userId,
      typeId: 1,
      description: formState.value.description,
      address: formState.value.address,
      latitude: formState.value.latitude,
      longitude: formState.value.longitude,
      website: formState.value.website,
      phone: formState.value.phone,
      email: formState.value.email,
      featuredImage: formState.value.featuredImage,
      company: formState.value.company,
      logo: formState.value.logo,
      salary: formState.value.salary,
      jobType: formState.value.jobType,
      workLocation: formState.value.workLocation,
      requirements: formState.value.requirements,
      applicationLink: formState.value.applicationLink,
      expiryDate: formState.value.expiryDate,
      isActive: formState.value.isActive
    };

    const response = await fetch(`${config.public.apiBaseUrl}/jobs/${slug}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jobData)
    });

    if (!response.ok) throw new Error('Failed to update job posting');

    const data = await response.json();
    console.log('Job updated successfully:', data);
    
    // Redirect to dashboard after successful update
    router.push('/dashboard');
    
  } catch (error) {
    console.error('Error updating job:', error);
  } finally {
    isLoading.value = false;
  }
};

// Fetch data on component mount
onMounted(() => {
  fetchJobData();
});
</script>

<template>
  <!-- Add loading state -->
  <div v-if="isFetching" class="flex items-center justify-center min-h-screen">
    <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-neutral-900"></div>
  </div>

  <!-- Show form only after data is loaded -->
  <form v-else @submit.prevent="handleSubmit" class="space-y-12">
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
            :error="errors.title"
        />

        <FormInput
            class="sm:col-span-4"
            v-model="formState.company"
            label="Company Name"
            placeholder="Enter company name"
            type="text"
            :error="errors.company"
        />

        <FormTextarea
            class="col-span-full"
            v-model="formState.description"
            label="Job Description"
            placeholder="Describe the role and responsibilities..."
            :rows="4"
            help-text="Include key responsibilities and expectations."
            :error="errors.description"
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
          :error="errors.salary"
      />

      <FormInput
          class="sm:col-span-3"
          v-model="formState.location"
          label="Location"
          placeholder="e.g., New York, NY"
          type="text"
          :error="errors.location"
      />

      <FormInput
          class="sm:col-span-3"
          v-model="formState.expiryDate"
          label="Application Deadline"
          type="date"
          placeholder=""
          :error="errors.expiryDate"
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
            :error="errors.requirements"
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
            :error="errors.applicationLink"
        />

        <FormInput
            class="sm:col-span-3"
            v-model="formState.email"
            label="Contact Email"
            placeholder="careers@company.com"
            type="email"
            :error="errors.email"
        />

        <FormInput
            class="sm:col-span-3"
            v-model="formState.phone"
            label="Contact Phone"
            placeholder="+1 (555) 123-4567"
            type="tel"
            :error="errors.phone"
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
            :error="errors.website"
        />

        <FormInput
            class="sm:col-span-full"
            v-model="formState.logo"
            label="Company Logo URL"
            placeholder="https://company.com/logo.png"
            type="url"
            :error="errors.logo"
        />

        <FormInput
            class="sm:col-span-full"
            v-model="formState.address"
            label="Company Address"
            placeholder="Full company address"
            type="text"
            :error="errors.address"
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
            :error="errors.featuredImage"
        />
      </div>
    </div>

    <!-- Modified submit button text -->
    <div class="mt-6 flex items-center justify-end gap-x-6">
      <button
          type="submit"
          class="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          :disabled="isLoading"
      >
        {{ isLoading ? 'Updating Job...' : 'Update Job' }}
      </button>
    </div>
  </form>
</template>
