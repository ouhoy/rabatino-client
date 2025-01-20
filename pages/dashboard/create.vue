<script setup lang="ts">
import { ref } from 'vue'
import { TourismType } from '~/types/tourism'
import { InstitutionType } from '~/types/education'
import { JobType, WorkLocation } from '~/types/jobs'

// Main categories
const categories = [
  { id: 'tourism', name: 'Tourism', description: 'Hotels, Restaurants, and Attractions' },
  { id: 'education', name: 'Education', description: 'Universities, Colleges, Libraries, and Study Centers' },
  { id: 'jobs', name: 'Career', description: 'Job Postings and Opportunities' },
  { id: 'business', name: 'Business', description: 'Business News and Updates' },
]

// Sub-categories based on types
const tourismTypes = Object.values(TourismType).map(type => ({
  id: type.toLowerCase(),
  name: type.charAt(0) + type.slice(1).toLowerCase().replace('_', ' '),
  type: type
}))

const educationTypes = Object.values(InstitutionType).map(type => ({
  id: type.toLowerCase(),
  name: type.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' '),
  type: type
}))

const jobTypes = {
  types: Object.values(JobType).map(type => ({
    id: type.toLowerCase(),
    name: type.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' '),
    type: type
  })),
  locations: Object.values(WorkLocation).map(loc => ({
    id: loc.toLowerCase(),
    name: loc.charAt(0) + loc.slice(1).toLowerCase(),
    type: loc
  }))
}

// Step tracking
const currentStep = ref(1)
const selectedCategory = ref('')
const selectedType = ref('')
const selectedSubType = ref('')

const goToStep = (step: number) => {
  currentStep.value = step
}

const getSubCategories = () => {
  switch (selectedCategory.value) {
    case 'tourism':
      return tourismTypes
    case 'education':
      return educationTypes
    case 'jobs':
      return jobTypes.types
    default:
      return []
  }
}

const handleCategorySelect = (categoryId: string) => {
  selectedCategory.value = categoryId
  selectedType.value = ''
  selectedSubType.value = ''
  goToStep(2)
}

// Update handleTypeSelect to format the component name
const handleTypeSelect = (typeId: string) => {
  selectedType.value = typeId
  goToStep(3)
}
</script>

<template>
  <main class="w-full max-w-5xl mx-auto py-10 px-4">
    <!-- Step 1: Choose Category -->
    <div v-if="currentStep === 1" class="space-y-6">
      <div class="text-center space-y-2">
        <h2 class="text-2xl font-semibold text-gray-900">What would you like to create?</h2>
        <p class="text-gray-500">Choose the type of content you want to share</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          v-for="category in categories"
          :key="category.id"
          @click="handleCategorySelect(category.id)"
          class="p-6 border rounded-xl text-left hover:border-blue-500 hover:bg-blue-50 transition-colors"
        >
          <h3 class="text-lg font-medium text-gray-900">{{ category.name }}</h3>
          <p class="mt-2 text-sm text-gray-500">{{ category.description }}</p>
        </button>
      </div>
    </div>

    <!-- Step 2: Choose Sub-category -->
    <div v-else-if="currentStep === 2" class="space-y-6">
      <div class="flex items-center gap-2 mb-8">
        <button 
          @click="goToStep(1)"
          class="text-blue-600 hover:text-blue-700"
        >
          ← Back
        </button>
        <h2 class="text-2xl font-semibold text-gray-900">
          Select {{ selectedCategory }} type
        </h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <button
          v-for="type in getSubCategories()"
          :key="type.id"
          @click="handleTypeSelect(type.id)"
          class="p-6 border rounded-xl text-left hover:border-blue-500 hover:bg-blue-50 transition-colors"
        >
          <h3 class="text-lg font-medium text-gray-900">{{ type.name }}</h3>
        </button>
      </div>
    </div>

    <!-- Step 3: Create Form -->
    <div v-else-if="currentStep === 3" class="space-y-6">
      <div class="flex items-center gap-2 mb-8">
        <button 
          @click="goToStep(2)"
          class="text-blue-600 hover:text-blue-700"
        >
          ← Back
        </button>
        <h2 class="text-2xl font-semibold text-gray-900">
          Create {{ selectedType }}
        </h2>
      </div>

      <!-- Dynamic form component based on selected type -->
      <component 
        :is="`create-${selectedCategory}-${selectedType}-form`" 
        v-if="selectedCategory && selectedType"
      />
      <p v-else class="text-red-600">
        Form not available for this type yet.
      </p>
    </div>
  </main>
</template>

<style scoped>

</style>