<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6">Latest Blog Posts</h1>
    
    <!-- Category Filter -->
    <div class="mb-6">
      <label for="category" class="mr-2">Filter by Category:</label>
      <select 
        id="category" 
        v-model="selectedCategory" 
        class="p-2 border rounded"
        :class="{ 'bg-gray-800 text-white': isDark }"
      >
        <option value="">All Categories</option>
        <option v-for="category in categories" :key="category.id" :value="category.id">
          {{ category.attributes.name }}
        </option>
      </select>
    </div>
    
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <p class="text-xl">Loading posts...</p>
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="bg-red-100 text-red-700 p-4 rounded">
      <p>{{ error }}</p>
    </div>
    
    <!-- No Posts State -->
    <div v-else-if="posts.length === 0" class="text-center py-8">
      <p class="text-xl">No posts found</p>
    </div>
    
    <!-- Posts Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="post in posts" 
        :key="post.id" 
        class="post-card rounded-lg overflow-hidden shadow-lg"
        :class="{ 'bg-gray-800 text-white': isDark, 'bg-white': !isDark }"
      >
        <div class="p-6">
          <h2 class="text-xl font-bold mb-2">{{ post.attributes.title }}</h2>
          
          <div class="flex items-center mb-4">
            <span v-if="post.attributes.authors?.data && post.attributes.authors.data.length > 0" class="text-sm opacity-75">
              By {{ getAuthorNames(post.attributes.authors.data) }}
            </span>
            <span v-else class="text-sm opacity-75">
              Unknown Author
            </span>
          </div>
          
          <div class="mb-4">
            <span 
              v-if="post.attributes.category?.data" 
              class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
              :class="{ 'bg-blue-900 text-blue-100': isDark }"
            >
              {{ post.attributes.category.data.attributes.name }}
            </span>
          </div>
          
          <p class="text-sm mb-4">{{ getContentSnippet(post.attributes.content) }}</p>
          
          <NuxtLink 
            :to="`/post/${post.attributes.slug}`" 
            class="inline-block px-4 py-2 rounded text-sm"
            :class="{ 'bg-gray-700 hover:bg-gray-600': isDark, 'bg-blue-500 hover:bg-blue-600 text-white': !isDark }"
          >
            Read more
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue'

const config = useRuntimeConfig()
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

const posts = ref([])
const categories = ref([])
const selectedCategory = ref('')
const loading = ref(true)
const error = ref(null)

// Get content snippet from rich text blocks
function getContentSnippet(content) {
  if (!content) return 'No content available'
  
  // For rich text in blocks format, extract text from the first block
  let snippet = ''
  try {
    if (typeof content === 'string') {
      snippet = content
    } else if (Array.isArray(content)) {
      // Find the first text block
      const textBlock = content.find(block => block.type === 'paragraph')
      if (textBlock && textBlock.children) {
        snippet = textBlock.children
          .map(child => child.text || '')
          .join('')
      }
    }
  } catch (e) {
    snippet = 'Content preview not available'
  }
  
  // Limit to 150 characters
  return snippet.length > 150 ? snippet.substring(0, 150) + '...' : snippet
}

// Format author names
function getAuthorNames(authors) {
  if (!authors || authors.length === 0) return 'Unknown'
  
  return authors
    .map(author => author.attributes.name)
    .filter(Boolean)
    .join(', ')
}

// Fetch categories
async function fetchCategories() {
  try {
    const { data } = await useFetch(`${config.public.strapiBaseUrl}/api/categories`, {
      headers: {
        'Authorization': `Bearer ${config.public.strapiApiToken}`
      }
    })
    
    if (data.value && data.value.data) {
      categories.value = data.value.data
    }
  } catch (err) {
    console.error('Error fetching categories:', err)
  }
}

// Fetch posts with optional category filter
async function fetchPosts() {
  loading.value = true
  error.value = null
  
  try {
    let url = `${config.public.strapiBaseUrl}/api/blog-posts?populate=authors,category`
    
    // Add category filter if selected
    if (selectedCategory.value) {
      url += `&filters[category][id][$eq]=${selectedCategory.value}`
    }
    
    const { data } = await useFetch(url, {
      headers: {
        'Authorization': `Bearer ${config.public.strapiApiToken}`
      }
    })
    
    if (data.value && data.value.data) {
      posts.value = data.value.data
    } else {
      posts.value = []
    }
  } catch (err) {
    console.error('Error fetching posts:', err)
    error.value = 'Failed to load blog posts. Please try again later.'
  } finally {
    loading.value = false
  }
}

// Refetch posts when category changes
watch(selectedCategory, () => {
  fetchPosts()
})

onMounted(() => {
  fetchCategories()
  fetchPosts()
})
</script>

<style scoped>
.post-card {
  transition: all 0.3s ease;
}

.post-card:hover {
  transform: translateY(-5px);
}
</style>