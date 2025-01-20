<script setup lang="ts">
import { ref, computed } from 'vue'
import { XMarkIcon } from '@heroicons/vue/20/solid'

interface Image {
  id: string
  url: string
  file: File
  isCover: boolean
}

const props = defineProps<{
  error?: string
}>()

const emit = defineEmits(['update:images'])

const images = ref<Image[]>([])
const draggingIndex = ref<number | null>(null)
const dropTargetIndex = ref<number | null>(null)

const imagePreviewUrls = computed(() => {
  return images.value.sort((a, b) => (b.isCover ? 1 : 0) - (a.isCover ? 1 : 0))
})

const handleFileInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return

  Array.from(input.files).forEach(file => {
    if (file.type.startsWith('image/')) {
      addImage(file)
    }
  })
  input.value = ''
}

const addImage = (file: File) => {
  const image: Image = {
    id: Math.random().toString(36).substring(7),
    url: URL.createObjectURL(file),
    file,
    isCover: images.value.length === 0 // First image is cover by default
  }
  images.value.push(image)
  emit('update:images', images.value)
}

const removeImage = (index: number) => {
  URL.revokeObjectURL(images.value[index].url)
  images.value.splice(index, 1)
  if (images.value.length > 0 && !images.value.some(img => img.isCover)) {
    images.value[0].isCover = true
  }
  emit('update:images', images.value)
}

const setCover = (index: number) => {
  images.value.forEach(img => img.isCover = false)
  images.value[index].isCover = true
  emit('update:images', images.value)
}

const handleDragStart = (index: number) => {
  draggingIndex.value = index
}

const handleDragOver = (e: DragEvent, index: number) => {
  e.preventDefault()
  dropTargetIndex.value = index
}

const handleDrop = (e: DragEvent, index: number) => {
  e.preventDefault()
  if (draggingIndex.value === null) return
  
  const draggedImage = images.value[draggingIndex.value]
  images.value.splice(draggingIndex.value, 1)
  images.value.splice(index, 0, draggedImage)
  
  draggingIndex.value = null
  dropTargetIndex.value = null
  emit('update:images', images.value)
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center">
      <label class="block text-sm font-medium leading-6 text-gray-900">Space Photos</label>
      <span class="text-sm" 
            :class="{'text-red-600': images.length < 5, 'text-gray-500': images.length >= 5}">
        {{ images.length }} photos (minimum 5)
      </span>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Cover Image (takes full width) -->
      <div v-if="images.length > 0" 
           class="md:col-span-2 relative aspect-[16/9] rounded-xl overflow-hidden">
        <img :src="imagePreviewUrls[0].url" 
             class="w-full h-full object-cover" 
             alt="Cover photo">
        <div class="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button @click="removeImage(0)" 
                  class="p-2 bg-white rounded-full hover:bg-gray-100">
            <XMarkIcon class="w-5 h-5"/>
          </button>
        </div>
      </div>

      <!-- Other Images Grid -->
      <template v-for="(image, index) in imagePreviewUrls.slice(1)" :key="image.id">
        <div class="relative aspect-[16/9] rounded-xl overflow-hidden"
             draggable="true"
             @dragstart="handleDragStart(index + 1)"
             @dragover="handleDragOver($event, index + 1)"
             @drop="handleDrop($event, index + 1)"
             :class="{'border-2 border-indigo-600': dropTargetIndex === index + 1}">
          <img :src="image.url" 
               class="w-full h-full object-cover" 
               alt="Space photo">
          <div class="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button @click="setCover(index + 1)" 
                    class="px-3 py-1 bg-white rounded-full hover:bg-gray-100 text-sm">
              Set as cover
            </button>
            <button @click="removeImage(index + 1)" 
                    class="p-2 bg-white rounded-full hover:bg-gray-100">
              <XMarkIcon class="w-5 h-5"/>
            </button>
          </div>
        </div>
      </template>

      <!-- Upload Button - Takes full width when no images -->
      <div class="relative aspect-[16/9] rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center"
           :class="{ 'md:col-span-2': images.length === 0 }">
        <input type="file" 
               accept="image/*" 
               multiple 
               class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
               @change="handleFileInput">
        <div class="text-center">
          <div class="text-gray-600">Click to upload or drag images here</div>
          <div class="text-sm text-gray-500">PNG, JPG, WEBP up to 10MB</div>
          <div v-if="images.length < 5" class="text-sm text-red-600 mt-1">
            {{ 5 - images.length }} more photos required
          </div>
        </div>
      </div>
    </div>

    <p v-if="error" class="mt-2 text-sm text-red-600">{{ error }}</p>
    <p v-if="images.length < 5" class="mt-2 text-sm text-gray-500">
      Please add at least 5 photos of your space
    </p>
  </div>
</template>
