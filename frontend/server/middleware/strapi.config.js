export default defineEventHandler((event) => {
  // This middleware runs on server-side only
  const config = useRuntimeConfig()
  
  // Log a warning if Strapi API configuration is missing
  if (!config.public.strapiBaseUrl || !config.public.strapiApiToken) {
    console.warn('⚠️ Strapi API configuration is incomplete. Make sure to set STRAPI_API_URL and STRAPI_API_TOKEN environment variables.')
  }
})