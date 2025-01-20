<script setup lang="ts">
type InputType = 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'search' | 'date'

interface InputProps {
  label: string
  type: InputType
  placeholder: string
  error?: string
  modelValue: string | number
}

const props = defineProps<InputProps>()
const emit = defineEmits(['update:modelValue']);

const textLabel = ref(props.label);

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const value = props.type === 'number' ? 
    target.value === '' ? '' : Number(target.value) : 
    target.value;
  emit('update:modelValue', value);
};
</script>

<template>
  <div>
    <label :for="textLabel.trim().replace(' ', '').toLowerCase()" class="block text-sm font-medium leading-6 text-gray-900">{{ textLabel }}</label>
    <div class="mt-2">
      <input  :value="modelValue"
              @input="onInput"
              :type="type"
              :name="textLabel.trim().replace(' ', '').toLowerCase()"
              :id="textLabel.trim().replace(' ', '').toLowerCase()"
              :placeholder="placeholder"

              class="outline-0 block w-full rounded-md border-0 pl-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
      <p v-if="error" class="mt-2 flex justify-start gap-1 items-center text-sm text-red-600 dark:text-red-500"> <span>{{error}}</span></p>

    </div>
  </div>
</template>

<style scoped></style>
