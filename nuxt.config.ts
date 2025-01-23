// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/google-fonts',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/leaflet',
    '@pinia/nuxt'
  ],
  runtimeConfig: {

    // Public keys that are exposed to the client
    public: {
      apiBaseUrl: process.env.BASE_URL
    }
  },
  googleFonts: {
    families: {
      Inter: [400, 500, 600, 700],
      Alegreya: [400, 500, 600, 700],
    }
  }
})