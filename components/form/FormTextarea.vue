<script setup lang="ts">
interface TextareaProps {
  label: string
  placeholder?: string
  error?: string
  modelValue: string
  rows?: number
  helpText?: string
}

const { label, placeholder, error, modelValue, rows = 3, helpText } = defineProps<TextareaProps>()
const emit = defineEmits(['update:modelValue'])

const onInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement;
  emit('update:modelValue', target.value);
};
</script>

<template>
  <div >
    <label :for="label.trim().replace(' ', '').toLowerCase()" class="block text-sm font-medium leading-6 text-gray-900">{{ label }}</label>
    <div class="mt-2">
      <textarea
        :value="modelValue"
        @input="onInput"
        :name="label.trim().replace(' ', '').toLowerCase()"
        :id="label.trim().replace(' ', '').toLowerCase()"
        :placeholder="placeholder"
        :rows="rows"
        class="p-2 block outline-none w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
      />
    </div>

    <p v-if="helpText" class="mt-3 text-sm leading-6 text-gray-600">{{ helpText }}</p>
    <p v-if="error" class="mt-2 flex justify-start gap-1 items-center text-sm text-red-600 dark:text-red-500">
      <span>{{ error }}</span>
    </p>
  </div>
</template>

<style scoped></style>
