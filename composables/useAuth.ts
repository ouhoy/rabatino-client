export const useAuthStore = defineStore('auth', () => {
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

            if (!response.ok) {
                throw new Error('Login failed')
            }

            const data = await response.json()
            user.value = data.user
            return true
        } catch (error) {
            console.error('Login error:', error)
            return false
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

// Add this export to make logout directly available
export function logout() {
    const authStore = useAuthStore()
    return authStore.logout()
}