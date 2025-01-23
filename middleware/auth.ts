
const useAuthStore = defineStore('auth', () => {
    const config = useRuntimeConfig()
    const user = ref(null)
    const isAuthenticated = computed(() => !!user.value)

console.log('config.public.apiBaseUrl', config.public.apiBaseUrl)
    async function login(email: string, password: string) {
        try {
            const response = await fetch(`${config.public.apiBaseUrl}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email, password}),
                credentials: 'include',
            })
            // ... handle response
        } catch (error) {
            console.error('Login error:', error)
        }
    }

    async function logout() {
        try {
            const response = await fetch(`${config.public.apiBaseUrl}/auth/logout`, {
                method: 'POST',
                credentials: 'include',
            })

            if (response.ok) {
                console.log('Logged out successfully')
                user.value = null
                // Optionally, redirect the user or update the UI
            } else {
                console.error('Logout failed:', response.statusText)
            }
        } catch (error) {
            console.error('Logout error:', error)
        }
    }


    return {user, isAuthenticated, login, logout}
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