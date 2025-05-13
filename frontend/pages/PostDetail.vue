<template>
  <div class="container mx-auto p-4">
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <p class="text-xl">Loading post...</p>
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="bg-red-100 text-red-700 p-4 rounded">
      <p>{{ error }}</p>
    </div>
    
    <!-- Post Not Found -->
    <div v-else-if="!post" class="text-center py-8">
      <p class="text-xl">Post not found</p>
      <NuxtLink to="/" class="text-blue-500 hover:underline mt-4 inline-block">
        Back to posts
      </NuxtLink>
    </div>
    
    <!-- Post Content -->
    <div v-else class="max-w-3xl mx-auto">
      <NuxtLink to="/" class="text-blue-500 hover:underline mb-6 inline-block">
        ← Back to posts
      </NuxtLink>
      
      <article>
        <h1 class="text-4xl font-bold mb-4">{{ post.attributes.title }}</h1>
        
        <div class="flex items-center mb-6">
          <span v-if="post.attributes.authors?.data && post.attributes.authors.data.length > 0" class="text-sm opacity-75">
            By {{ getAuthorNames(post.attributes.authors.data) }}
          </span>
          <span v-else class="text-sm opacity-75">
            Unknown Author
          </span>
          
          <span v-if="post.attributes.category?.data" class="ml-4 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
            {{ post.attributes.category.data.attributes.name }}
          </span>
        </div>
        
        <div class="prose prose-lg max-w-none" :class="{ 'prose-invert': isDark }">
          <div v-if="typeof post.attributes.content === 'string'" v-html="renderMarkdown(post.attributes.content)"></div>
          <div v-else-if="Array.isArray(post.attributes.content)">
            <!-- Render each content block -->
            <div v-for="(block, index) in post.attributes.content" :key="index">
              <p v-if="block.type === 'paragraph'" class="mb-4">
                {{ renderBlock(block) }}
              </p>
              <h2 v-else-if="block.type === 'heading'" class="text-2xl font-bold mt-6 mb-4">
                {{ renderBlock(block) }}
              </h2>
              <div v-else>
                {{ renderBlock(block) }}
              </div>
            </div>
          </div>
          <p v-else>No content available</p>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const config = useRuntimeConfig()
const route = useRoute()
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

const post = ref(null)
const loading = ref(true)
const error = ref(null)

// Format author names
function getAuthorNames(authors) {
  if (!authors || authors.length === 0) return 'Unknown'
  
  return authors
    .map(author => author.attributes.name)
    .filter(Boolean)
    .join(', ')
}

// Simple markdown renderer
function renderMarkdown(text) {
  if (!text) return ''
  
  // This is a very basic markdown renderer
  // In a real app, use a proper markdown library
  return text
    .replace(/#{3}(.+)/g, '<h3>$1</h3>')
    .replace(/#{2}(.+)/g, '<h2>$1</h2>')
    .replace(/#{1}(.+)/g, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>')
}

// Render blocks from rich text editor
function renderBlock(block) {
  if (!block) return ''
  
  if (block.children && Array.isArray(block.children)) {
    return block.children
      .map(child => child.text || '')
      .join('')
  }
  
  return ''
}

// Fetch post by slug
async function fetchPost() {
  loading.value = true
  error.value = null
  
  const slug = route.params.slug
  
  if (!slug) {
    error.value = 'Post not found'
    loading.value = false
    return
  }
  
  try {
    const url = `${config.public.strapiBaseUrl}/api/blog-posts?filters[slug][$eq]=${slug}&populate=authors,category`
    
    const { data } = await useFetch(url, {
      headers: {
        'Authorization': `Bearer ${config.public.strapiApiToken}`
      }
    })
    
    if (data.value && data.value.data && data.value.data.length > 0) {
      post.value = data.value.data[0]
    } else {
      post.value = null
      error.value = 'Post not found'
    }
  } catch (err) {
    console.error('Error fetching post:', err)
    error.value = 'Failed to load blog post. Please try again later.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchPost()
})
</script>