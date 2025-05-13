// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  runtimeConfig: {
    strapiApiToken: process.env.STRAPI_API_TOKEN,
    strapiApiUrl: process.env.STRAPI_API_URL, 
    public: {
      // Any variables here will be exposed to the client-side (not recommended for the API token)
    }
  },

  modules: ['@nuxt/eslint'],
})