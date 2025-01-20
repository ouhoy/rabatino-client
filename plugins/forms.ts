import { defineNuxtPlugin } from '#app'
import forms from '~/components/forms'

export default defineNuxtPlugin((nuxtApp) => {
  Object.entries(forms).forEach(([name, component]) => {
    nuxtApp.vueApp.component(name, component)
  })
})
