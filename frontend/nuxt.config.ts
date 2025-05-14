export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  modules: ['@nuxtjs/tailwindcss', [
    '@nuxtjs/color-mode',
    {
      classSuffix: '',
      preference: 'system',
      fallback: 'light',
    }
  ], '@nuxt/eslint', '@nuxtjs/color-mode'],
  runtimeConfig: {
    public: {
     strapiUrl: process.env.STRAPI_URL || 'http://localhost:1337'
    }
  },
  app: {
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