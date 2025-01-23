
const useAuthStore = defineStore('auth', () => {
    const user = ref(null)
    const isAuthenticated = computed(() => !!user.value)

    return {user, isAuthenticated, }
})

export default defineNuxtRouteMiddleware((to) => {
    const authStore = useAuthStore()
  
    // Check if route requires authentication
    if (to.meta.auth?.required && !authStore.isAuthenticated) {
      return navigateTo('/login')
    }
  
    // Check if route is for unauthenticated users only
    if (to.meta.auth?.unauthenticatedOnly && authStore.isAuthenticated) {
      return navigateTo('/')
    }
  })