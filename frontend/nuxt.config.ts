// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    [
      '@nuxtjs/color-mode',
      {
        classSuffix: '',
        preference: 'system', // default value of $colorMode.preference
        fallback: 'light', // fallback value if not system preference found
      }
    ],
    '@nuxt/eslint'
  ],
  runtimeConfig: {
    // Private keys (server-side only)
    // Public keys that are exposed to the client
    public: {
      strapiBaseUrl: process.env.STRAPI_API_URL || 'http://localhost:1337',
      strapiApiToken: process.env.STRAPI_API_TOKEN || '',
    }
  },
  app: {
    // Default head tags
    head: {
      title: 'Blog Platform',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'A blog platform built with Nuxt and Strapi' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    }
  },
})